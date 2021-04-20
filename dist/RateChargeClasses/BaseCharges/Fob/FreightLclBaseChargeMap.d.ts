import { BoxesTypeRequest, ChargeMap, ChargeMapIterableType, ChargeMapName, CurrencyType, GridElement, InvalidChargeSetMessage, LclChargeMapType, LclKey, Mandatory, ShipmentDetails, WeightRatioRule } from '../../../Rates/rateTypes';
import { ApplyingCharge } from '../../../ApplyingCharges/ApplyingCharge';
export declare class FreightLclBaseChargeMap implements ChargeMap<'LclCharge', LclKey, WeightRatioRule, LclChargeMapType, BoxesTypeRequest> {
    chargeMapName: ChargeMapName<LclChargeMapType>;
    chargeMap: ChargeMapIterableType<LclKey, WeightRatioRule> | InvalidChargeSetMessage<LclChargeMapType>;
    constructor(chargeRow: Pick<GridElement, keyof GridElement>[][] | string);
    getChargeMap(chargeTable: Pick<GridElement, keyof GridElement>[][]): ChargeMapIterableType<LclKey, WeightRatioRule> | InvalidChargeSetMessage<LclChargeMapType>;
    fromString(charge: string): ChargeMapIterableType<LclKey, WeightRatioRule> | InvalidChargeSetMessage<LclChargeMapType>;
    invalidChargeSetMessage(): InvalidChargeSetMessage<LclChargeMapType>;
    toString(): string;
    calcMe(shipmentDetails?: ShipmentDetails<'LclCharge', BoxesTypeRequest>): ApplyingCharge<'LclCharge', LclKey, WeightRatioRule, LclChargeMapType, CurrencyType, Mandatory, BoxesTypeRequest>[] | InvalidChargeSetMessage<LclChargeMapType>;
}
