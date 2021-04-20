import {
  BoxesTypeRequest,
  ChargeMap,
  ChargeMapIterableType,
  ChargeMapName,
  CurrencyType,
  GridElement,
  InvalidChargeSetMessage,
  LclChargeMapType,
  LclKey,
  Length,
  Mandatory,
  ShipmentDetails,
  WeightRatioRule,
} from '../../../Rates/rateTypes';
import { ApplyingCharge } from '../../../ApplyingCharges/ApplyingCharge';
import { currencyFromString } from '../../../ApplyingCharges/chargeUtils';
import { Box } from '../../../CargoUnit/Box';
import { massInKg } from '../../../Rates/rateUtils';

export class FreightLclBaseChargeMap implements ChargeMap<'LclCharge', LclKey, WeightRatioRule, LclChargeMapType, BoxesTypeRequest> {
  chargeMapName: ChargeMapName<LclChargeMapType> = 'LclCharge';
  chargeMap: ChargeMapIterableType<LclKey, WeightRatioRule> | InvalidChargeSetMessage<LclChargeMapType>;

  constructor(chargeRow: Pick<GridElement, keyof GridElement>[][] | string) {
    this.chargeMap = typeof (chargeRow) === 'string' ?
      this.fromString(chargeRow) :
      this.getChargeMap(chargeRow);
  }

  getChargeMap(chargeTable: Pick<GridElement, keyof GridElement>[][]): ChargeMapIterableType<LclKey, WeightRatioRule> | InvalidChargeSetMessage<LclChargeMapType> {


    const deserializedCurrencyCharge = currencyFromString(chargeTable[0][1].value as string);

    if (typeof deserializedCurrencyCharge === 'string') return this.invalidChargeSetMessage();
    if (deserializedCurrencyCharge.currency !== chargeTable[0][1].currencyType) return this.invalidChargeSetMessage();

    return new Map([
        ['perTon', {
          charge: {
            amount: deserializedCurrencyCharge.amount as string,
            currency: chargeTable[0][1].currencyType as CurrencyType,
            mandatory: 'Y' as Mandatory,
          },
          ratio: chargeTable[0][0].value as string,
        }],
      ] as [LclKey, WeightRatioRule][],
    );
  }

  fromString(charge: string): ChargeMapIterableType<LclKey, WeightRatioRule> | InvalidChargeSetMessage<LclChargeMapType> {
    const chargeObject = JSON.parse(charge);
    const parsedObject = JSON.parse(chargeObject);


    return new Map<LclKey, WeightRatioRule>(parsedObject);

  }

  invalidChargeSetMessage(): InvalidChargeSetMessage<LclChargeMapType> {
    return 'Invalid LCL Base Charge';
  }

  toString(): string {
    return typeof this.chargeMap === 'string' ?
      this.invalidChargeSetMessage() :
      JSON.stringify(Array.from(this.chargeMap.entries()));
  };


  calcMe(shipmentDetails?: ShipmentDetails<'LclCharge', BoxesTypeRequest>):
    ApplyingCharge<'LclCharge', LclKey, WeightRatioRule, LclChargeMapType, CurrencyType, Mandatory, BoxesTypeRequest>[] | InvalidChargeSetMessage<LclChargeMapType> {

    if (shipmentDetails !== undefined) {
      const applicableCharges: ApplyingCharge<'LclCharge', LclKey, WeightRatioRule, LclChargeMapType, CurrencyType, Mandatory, BoxesTypeRequest>[] = [];
      const lclChargeMap = this.chargeMap;

      if (this.invalidChargeSetMessage() === lclChargeMap) return this.invalidChargeSetMessage();


      const applyingRateCharge = Array.from(lclChargeMap.entries())[0][1];

      const ratio = applyingRateCharge.ratio;

      const boxes = shipmentDetails
        .requestDetails
        .map(
          box =>
            new Box(
              {
                length: box.length as Length,
                height: box.height as Length,
                width: box.width as Length,
              },
              box.weight,
              ratio,
              box.count,
            ),
        );


      // const areWithinLimits = boxes.map(box => box.isWithinRateLimits(limitSize, limitWeight));
      const scalarInTons =
        boxes.map(
          box => massInKg(box.getQuotingWeight('ton')),
        ).reduce(
          (massA, massB) =>
            massA.plus(massB),
        ).value
          .toString();


      const charge = applyingRateCharge.charge;

      const lclCharge =
        new ApplyingCharge<'LclCharge', LclKey, WeightRatioRule, LclChargeMapType, CurrencyType, Mandatory, BoxesTypeRequest>(
          'LclCharge',
          charge,
          ['perTon', applyingRateCharge],
          { ...shipmentDetails, chargeParamObj: boxes },
        );


      lclCharge.scaleCharge(scalarInTons);
      const applyingCharge = lclCharge;

      if (applyingCharge === undefined) return this.invalidChargeSetMessage();
      applicableCharges.push(applyingCharge);

      return applicableCharges;
    }
    return this.invalidChargeSetMessage();
  }
}