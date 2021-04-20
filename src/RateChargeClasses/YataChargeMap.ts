import {
  ChargeMap,
  ChargeMapIterableType,
  ChargeMapName,
  CurrencyType,
  GridElement,
  InvalidChargeSetMessage,
  Mandatory,
  PercentageCharge,
  ShipmentDetails,
  TotalChargeSetTypeRequest,
  YataCharge,
  YataChargeMapType,
} from '../Rates/rateTypes';
import { ApplyingCharge } from '../ApplyingCharges/ApplyingCharge';


export class YataChargeMap implements ChargeMap<'YataCharge',
  'percent',
  PercentageCharge,
  YataChargeMapType,
  TotalChargeSetTypeRequest> {
  chargeMapName: ChargeMapName<YataChargeMapType> = 'YataCharge';
  chargeMap: ChargeMapIterableType<'percent', PercentageCharge> | InvalidChargeSetMessage<YataChargeMapType>;

  constructor(chargesTable: Pick<GridElement, keyof GridElement>[][] | string) {
    this.chargeMap = typeof chargesTable === 'string' ?
      this.fromString(chargesTable) :
      this.getChargeMap(chargesTable);
  }

  getChargeMap(chargeTable: Pick<GridElement, keyof GridElement>[][] | string): ChargeMapIterableType<'percent', PercentageCharge> | InvalidChargeSetMessage<YataChargeMapType> {
    if (typeof chargeTable === 'string') return JSON.parse(chargeTable);
    return new Map(
      [
        ['percent', { percentage: chargeTable[0][0].value as string }],
      ],
    );
  }

  calcMe(shipmentDetails: ShipmentDetails<'YataCharge', TotalChargeSetTypeRequest>):
    ApplyingCharge<'YataCharge', 'percent', PercentageCharge, YataChargeMapType, CurrencyType, Mandatory, TotalChargeSetTypeRequest>[] |
    InvalidChargeSetMessage<YataChargeMapType> {

    const applicableCharges: ApplyingCharge<'YataCharge', 'percent', PercentageCharge, YataChargeMapType, CurrencyType, Mandatory, TotalChargeSetTypeRequest>[] = [];
    const yataChargeInPercent = this.getUnwrappedYataCharge();

    if (yataChargeInPercent === this.invalidChargeSetMessage()) return this.invalidChargeSetMessage();

    const chargeParamObjNis =
      shipmentDetails
        .requestDetails
        .mandatory
        .getTotalCharge()
        .totalChargesInNis
        .sumTotal;

    const totalPercentageNis =
      shipmentDetails
        .requestDetails
        .mandatory
        .calculatePercentCharge<'YataCharge', 'Y'>(
          'YataCharge',
          'Y',
          yataChargeInPercent,
          { ...shipmentDetails, chargeParamObj: chargeParamObjNis },
        );

    const chargeParamObjUsd =
      shipmentDetails.
      requestDetails.
      mandatory.
      getTotalCharge()
        .totalChargesInUsd
        .sumTotal;

    const totalPercentageUsd =
      shipmentDetails
        .requestDetails
        .mandatory
        .calculatePercentCharge<'YataCharge', 'Y'>(
          'YataCharge',
          'Y',
          yataChargeInPercent,
          { ...shipmentDetails, chargeParamObj: chargeParamObjUsd },
        );

    const chargeParamObjEur =
      shipmentDetails
        .requestDetails
        .mandatory
        .getTotalCharge()
        .totalChargesInEur
        .sumTotal;

    const totalPercentageEur =
      shipmentDetails
        .requestDetails
        .mandatory
        .calculatePercentCharge<'YataCharge', 'Y'>(
          'YataCharge',
          'Y',
          yataChargeInPercent,
          { ...shipmentDetails, chargeParamObj: chargeParamObjEur },
        );

    applicableCharges.push(totalPercentageNis.totalChargesInNis);
    applicableCharges.push(totalPercentageUsd.totalChargesInUsd);
    applicableCharges.push(totalPercentageEur.totalChargesInEur);

    return applicableCharges;
  }

  fromString(serializedChargeMap: string): ChargeMapIterableType<'percent', PercentageCharge> | InvalidChargeSetMessage<YataChargeMapType> {
    try {

      const chargeObject = JSON.parse(serializedChargeMap);

      if (chargeObject === undefined) return this.invalidChargeSetMessage();

      return chargeObject;

    } catch (e) {
      return this.invalidChargeSetMessage();
    }
  }

  toString(): string {
    return typeof this.chargeMap === 'string' ?
      this.invalidChargeSetMessage() :
      JSON.stringify(Array.from(this.chargeMap));
  };

  invalidChargeSetMessage(): InvalidChargeSetMessage<YataChargeMapType> {
    return 'Invalid Yata';
  }

  private getUnwrappedYataCharge() {
    return this.chargeMap === this.invalidChargeSetMessage() ?
      this.invalidChargeSetMessage() : Array.from(this.chargeMap)[0][1].percentage;
  }
}