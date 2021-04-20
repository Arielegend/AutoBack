import {
  AirChargeParams,
  ChargeSetType,
  ErrorMessage,
  FclChargeParams,
  GridElement,
  LclChargeParams,
  LimitsShipmentsAirLcl,
  PercentageCharge,
  RateLineParams,
  RateSubmissionParamsDeserialized,
} from './rateTypes';
import { FixChargeMap } from '../RateChargeClasses/FixChargeMap';
import { HeavyWeightChargesMap } from '../RateChargeClasses/HeavyWeightChargeMap';
import { LocalContainerChargeMap } from '../RateChargeClasses/LocalContainerChargeMap';

import { LocalsByWeightChargeMap } from '../RateChargeClasses/LocalsByWeightChargeMap';
import { FreightFclBaseChargeMap } from '../RateChargeClasses/BaseCharges/Fob/FreightFclBaseChargeMap';
import { FreightLclBaseChargeMap } from '../RateChargeClasses/BaseCharges/Fob/FreightLclBaseChargeMap';
import { FreightAirBaseChargeMap } from '../RateChargeClasses/BaseCharges/Fob/FreightAirBaseChargeMap';

import { ThcChargeMap } from '../RateChargeClasses/ThcChargeMap';
import { currencyFromString, regexCurrencyInvalidConstruction } from '../ApplyingCharges/chargeUtils';
import { Currency, InvalidCurrencyMessage } from '../ApplyingCharges/chargeTypes';
import { YataChargeMap } from '../RateChargeClasses/YataChargeMap';


export class RateLineSet {
  rateChargesPerPointOfOrigin:
    | RateLineParams[]
    | ErrorMessage

  constructor(rateSubmission: RateSubmissionParamsDeserialized) {
    this.rateChargesPerPointOfOrigin = this.rateProcessing(rateSubmission);
  }

  invalidChargeSetMessage = (chargeSet: ChargeSetType): ErrorMessage => {
    return `Invalid ${chargeSet} ChargeSet.` as ErrorMessage;
  };


  rateProcessing = (
    rateSubmission: RateSubmissionParamsDeserialized,
  ): RateLineParams[] | ErrorMessage  => {
    const {
      freightTransportRatesObject,
      localRatesObject,
      originRatesObject,
      ...generalInfo
    } = rateSubmission;

    /*const originRatesObject = originRates === undefined ? "" : JSON.parse(originRates);*/
    //

    switch (rateSubmission.rateType) {
      case 'ImportFOBOCEANFCL':

        return this.fclChargesProcessing({
          localRatesObject,
          freightTransportRatesObject,
          ...generalInfo,
        });

      case 'ImportFOBOCEANLCL':
        return this.lclChargesProcessing({
          localRatesObject,
          freightTransportRatesObject,
          ...generalInfo,
        });

      case 'ImportFOBAIR':
        return this.airChargesProcessing({
          localRatesObject,
          freightTransportRatesObject,
          ...generalInfo,
        });

      case 'ImportEXWAIR':
        return 'Invalid Rate Submission.';

      case 'ImportEXWOCEANFCL':
        return 'Invalid Rate Submission.';

      case 'ImportEXWOCEANLCL':
        return 'Invalid Rate Submission.';

      default:
        return 'Invalid Rate Submission.';
    }
  };

  /** FCL Charges Processing */
  fclChargesProcessing = (fclFormSubmission: RateSubmissionParamsDeserialized): RateLineParams[] | ErrorMessage => {
    const {
      localRatesObject,
      freightTransportRatesObject,
      ...generalInfo
    } = fclFormSubmission;

    const oceanFclBaseRates = JSON.parse(freightTransportRatesObject.oceanFCLTable as string);
    const oceanFclHeavyRates = new HeavyWeightChargesMap(freightTransportRatesObject.oceanFCLHEAVY as string);
    const oceanFclFreightFix = new FixChargeMap(freightTransportRatesObject.oceanFCLFreightFix as string);

    const localsOceanFclContainerRates: LocalContainerChargeMap =
      new LocalContainerChargeMap(localRatesObject.LocalsOceanFCLByContainerTypeTable as string);
    const thc20 = localRatesObject.thc20;
    const thc40 = localRatesObject.thc40;

    const localsOceanFclFixRates = new FixChargeMap(localRatesObject.LocalsOceanFCLFixTable as string);

    const fclCharges: RateLineParams[] | undefined =
      this.getFclCharges({
          generalInfo,
          oceanFclBaseRates,
          oceanFclHeavyRates,
          oceanFclFreightFix,
          localsOceanFclFixRates,
          localsOceanFclContainerRates,
          thc20: thc20 as string,
          thc40: thc40 as string,
        },
      );

    return fclCharges === undefined
      ? this.invalidChargeSetMessage('FCL')
      : fclCharges;
  };

  private static getThcAsPickGridElement(thc20: string, thc40: string): Pick<GridElement, 'field' | 'value'>[][] | InvalidCurrencyMessage {
    const thc20Charge: Currency | InvalidCurrencyMessage = currencyFromString(thc20);
    const thc40Charge: Currency | InvalidCurrencyMessage = currencyFromString(thc40);

    const invalidThcCharges = thc20Charge === regexCurrencyInvalidConstruction && thc40Charge === regexCurrencyInvalidConstruction;
    return invalidThcCharges ?
    regexCurrencyInvalidConstruction : [
        [{ field: 'thc20', value: thc20 }],
        [{ field: 'thc40', value: thc40 }],
      ];
  }

  private getFclCharges(
    cleanedUpFcLFormSubmissions: FclChargeParams,
  ): RateLineParams[] | undefined {
    const {
      generalInfo,
      oceanFclBaseRates,
      oceanFclHeavyRates,
      oceanFclFreightFix,
      localsOceanFclFixRates,
      localsOceanFclContainerRates,
      thc20,
      thc40,
    } = cleanedUpFcLFormSubmissions;

    return oceanFclBaseRates.map(
      (baseRate: Pick<GridElement, keyof GridElement>[]) => {
        const fclChargesObject = new FreightFclBaseChargeMap([baseRate]);
        const portFrom = baseRate[1].value as string;
        const portTo = baseRate[2].value as string;
        const transitTime = (baseRate[3].value +
          ` ${baseRate[3].fieldType}`) as string;
        const route = baseRate[4].value as string;

        const thc = RateLineSet.getThcAsPickGridElement(thc20 as string, thc40 as string);
        const thcObject = new ThcChargeMap(thc);

        return {
          ...generalInfo,
          originCharges: '',
          pointOfOrigin: portFrom,
          pointOfDestination: portTo,
          transitTime,
          route,
          freightTransportCharges: JSON.stringify({
            fclCharges: fclChargesObject.toString(),
            oceanFclHeavyRates: oceanFclHeavyRates.toString(),
            oceanFclFreightFix: oceanFclFreightFix.toString(),
          }),
          localCharges: JSON.stringify({
            localsOceanFclFixRates: localsOceanFclFixRates.toString(),
            localsOceanFclContainerRates: localsOceanFclContainerRates.toString(),
            thcObject: thcObject.toString(),
          }),
        };
      },
    );
  }


  /** LCL Charges Processing*/
  private lclChargesProcessing = (lclFormSubmission: RateSubmissionParamsDeserialized): RateLineParams[] | ErrorMessage => {

    const {
      localRatesObject,
      freightTransportRatesObject,
      ...generalInfo
    } = lclFormSubmission;

    /* freight transport part is rates, limits, ratio */
    const oceanLclBaseRates = JSON.parse(freightTransportRatesObject.oceanLCLTable as string);

    const limits: LimitsShipmentsAirLcl = {
      limitHeightShipment: freightTransportRatesObject.limitHeightShipment as string,
      limitWeightShipment: freightTransportRatesObject.limitWeightShipment as string,
      limitWeightBox: freightTransportRatesObject.limitWeightBox as string,
    };

    const freightPartLclRatio = freightTransportRatesObject.oceanLCLRateRatio as string;

    // local part is FixTable, WeightTable
    const oceanLclLocalFix = new FixChargeMap(localRatesObject.FixedRules as string);
    const oceanLclLocalWeight = new LocalsByWeightChargeMap(localRatesObject.localsLclByWeightTable as string);

    const lclCharges =
      this.getLclCharges({
          generalInfo,
          oceanLclBaseRates,
          limits,
          freightPartLclRatio,
          oceanLclLocalFix,
          oceanLclLocalWeight,
        },
      );

    return lclCharges === undefined
      ? this.invalidChargeSetMessage('LCL')
      : lclCharges;
  };

  private getLclCharges(cleanedUpLcLFormSubmissions: LclChargeParams): RateLineParams[] | ErrorMessage {
    const {
      generalInfo,
      oceanLclBaseRates,
      limits,
      freightPartLclRatio,
      oceanLclLocalFix,
      oceanLclLocalWeight,
    } = cleanedUpLcLFormSubmissions;

    return oceanLclBaseRates.map(
      (baseRate: Pick<GridElement, keyof GridElement>[]) => {

        const mainFobPart = new FreightLclBaseChargeMap([
            [{ field: 'ratio', value: freightPartLclRatio }, ...baseRate.slice(5)],
          ],
        );
        const portFrom = baseRate[1].value as string;
        const portTo = baseRate[2].value as string;
        const transitTime = baseRate[3].value as string;
        const route = baseRate[4].value as string;

        return {
          ...generalInfo,
          originCharges: '',
          pointOfOrigin: portFrom,
          pointOfDestination: portTo,
          transitTime,
          route,
          freightTransportCharges: JSON.stringify({
            lclCharges: mainFobPart.toString(),
            limits: limits,
          }),
          localCharges: JSON.stringify({
            oceanLclLocalFix: oceanLclLocalFix.toString(),
            oceanLclLocalWeight: oceanLclLocalWeight.toString(),
          }),

        };

      },
    );

  }

  /** Air Charges Processing*/

  private airChargesProcessing = (rateSubmission: RateSubmissionParamsDeserialized): RateLineParams[] | ErrorMessage => {
    const {
      freightTransportRatesObject,
      localRatesObject,
      originRatesObject,
      ...generalInfo
    } = rateSubmission;


    const limits: LimitsShipmentsAirLcl = {
      limitHeightShipment: JSON.parse(freightTransportRatesObject.airLimits as string).limitHeightShipment as string,
      limitWeightShipment: JSON.parse(freightTransportRatesObject.airLimits as string).limitWeightShipment as string,
      limitWeightBox: JSON.parse(freightTransportRatesObject.airLimits as string).limitWeightBox as string,
    };


    const freightPartAirRatio = freightTransportRatesObject.airRatio as string;

    const airLocalsFix = new FixChargeMap(localRatesObject.LocalsAirFixTable as string);
    const airLocalsByWeight = new LocalsByWeightChargeMap(localRatesObject.LocalsAirByWeightTable as string);


    const yata: PercentageCharge = {
      percentage: localRatesObject.yata as string,
    };

    const airBaseRates = JSON.parse(
      freightTransportRatesObject.airTable as string,
    ) as Pick<GridElement, keyof GridElement>[][];


    const airChargesProcessed =
      this.getAirCharges({
          generalInfo,
          airBaseRates,
          limits,
          freightPartAirRatio,
          airLocalsFix,
          airLocalsByWeight,
          yata,
        },
      );

    if (typeof airChargesProcessed === 'string') {
      return this.invalidChargeSetMessage('Air');
    }

    return airChargesProcessed === undefined
      ? this.invalidChargeSetMessage('Air')
      : airChargesProcessed;
  };

  private getAirCharges = (cleanedUpFOBAirFormSubmission: AirChargeParams): RateLineParams[] | ErrorMessage => {
    const {
      airBaseRates,
      limits,
      freightPartAirRatio,
      airLocalsFix,
      airLocalsByWeight,
      yata,
      ...generalInfo
    } = cleanedUpFOBAirFormSubmission;

    const airBaseCharges =
      airBaseRates
        .map(
          (baseRate: Pick<GridElement, keyof GridElement>[]) => {
            const portFrom = baseRate[1].value as string;
            const portTo = 'TLV';
            const route = baseRate[2].value as string;
            const transitTime = (baseRate[3].value + ` ${baseRate[3].fieldType}`) as string;
            /*const minWeight = baseRate[4].value as string;*/

            const slicedAtCharges = baseRate.slice(4);
            const airFobCharges = new FreightAirBaseChargeMap(
              [
                [{ field: 'ratio', value: freightPartAirRatio }, ...slicedAtCharges],
              ],
            );

            const yataChargeMap = new YataChargeMap([[{ field: 'yata', value: yata.percentage as string }]]).toString();
            return {
              ...generalInfo.generalInfo,
              pointOfOrigin: portFrom,
              pointOfDestination: portTo,
              transitTime,
              route,
              freightTransportCharges: JSON.stringify({
                airFobCharges: airFobCharges.toString(),
                limits: limits,
              }),
              localCharges: JSON.stringify({
                airLocalsFix: airLocalsFix.toString(),
                airLocalsByWeight: airLocalsByWeight.toString(),
                yata: yataChargeMap,
              }),
              originCharges: '',
            };
          },
        );

    return airBaseCharges === undefined ?
      this.invalidChargeSetMessage('Air') :
      airBaseCharges;
  };

  toString(): string {
    if (typeof this.rateChargesPerPointOfOrigin !== 'string') {
      const rateLineStrArray = this.rateChargesPerPointOfOrigin
        .map(
          rateLine => {
            const { originCharges, freightTransportCharges, localCharges, ...generalInfo } = rateLine;

            const generalInfoStr = Object.entries(generalInfo)
              .map(
                ([key, value]) => {
                  return `\n\t\t${key}: ${value}`;
                },
              ).join('');

            const chargeStrArr = [freightTransportCharges, localCharges]
              .map(
                chargePart => {
                  const chargeObj = JSON.parse(chargePart);
                  const chargeObjectEntries = Object.entries(chargeObj);


                  const chargeStr =
                    chargeObjectEntries
                      .map(
                        ([key, chargeClassStr]) => {

                          if (typeof chargeClassStr === 'string') {
                            const chargeObjEntries = JSON.parse(chargeClassStr);
                            return `\n\t\t${key}: ${
                              chargeObjEntries
                                .map(
                                  this.keyValueString(),
                                ).join('')

                            }`;
                          }

                          if (typeof chargeClassStr === 'object' && chargeClassStr !== null) {
                            return `\n\t\t${key}: ${
                              Object.entries(chargeClassStr)
                                .map(
                                  this.keyValueString(),
                                ).join('')
                            }`;
                          }
                        },
                      );
                  return chargeStr.join('');
                },
              ).join('');


            return `\n\t\{\n${generalInfoStr}\n${chargeStrArr}\n\t\}`;
          },
        );

      return `[${rateLineStrArray.join(',')}\n]`;
    }
    return this.rateChargesPerPointOfOrigin;
  }

  private keyValueString() {
    return ([key, value]: [string, any]) => `\n\t\t\t[${JSON.stringify(key)},${JSON.stringify(value)}]`;
  }
}