import { ChargeMap, ChargeMapIterableType, ChargeMapName, CurrencyType, GridElement, InvalidChargeSetMessage, Mandatory, PercentageCharge, ShipmentDetails, TotalChargeSetTypeRequest, YataChargeMapType } from '../Rates/rateTypes';
import { ApplyingCharge } from '../ApplyingCharges/ApplyingCharge';
export declare class YataChargeMap implements ChargeMap<'YataCharge', 'percent', PercentageCharge, YataChargeMapType, TotalChargeSetTypeRequest> {
    chargeMapName: ChargeMapName<YataChargeMapType>;
    chargeMap: ChargeMapIterableType<'percent', PercentageCharge> | InvalidChargeSetMessage<YataChargeMapType>;
    constructor(chargesTable: Pick<GridElement, keyof GridElement>[][] | string);
    getChargeMap(chargeTable: Pick<GridElement, keyof GridElement>[][] | string): ChargeMapIterableType<'percent', PercentageCharge> | InvalidChargeSetMessage<YataChargeMapType>;
    calcMe(shipmentDetails: ShipmentDetails<'YataCharge', TotalChargeSetTypeRequest>): ApplyingCharge<'YataCharge', 'percent', PercentageCharge, YataChargeMapType, CurrencyType, Mandatory, TotalChargeSetTypeRequest>[] | InvalidChargeSetMessage<YataChargeMapType>;
    fromString(serializedChargeMap: string): ChargeMapIterableType<'percent', PercentageCharge> | InvalidChargeSetMessage<YataChargeMapType>;
    toString(): string;
    invalidChargeSetMessage(): InvalidChargeSetMessage<YataChargeMapType>;
    private getUnwrappedYataCharge;
}
