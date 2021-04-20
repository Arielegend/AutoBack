import { BoxesTypeRequest, ChargeMap, ChargeMapIterableType, ChargeMapName, ChargeName, CurrencyType, GridElement, InvalidChargeSetMessage, Mandatory, ShipmentDetails, WeightRatioRule, WeightRuleChargeMapType } from '../Rates/rateTypes';
import { ApplyingCharge } from '../ApplyingCharges/ApplyingCharge';
export declare class LocalsByWeightChargeMap implements ChargeMap<'WeightRulesCharges', ChargeName, WeightRatioRule, WeightRuleChargeMapType, BoxesTypeRequest> {
    chargeMapName: ChargeMapName<WeightRuleChargeMapType>;
    chargeMap: ChargeMapIterableType<ChargeName, WeightRatioRule> | InvalidChargeSetMessage<WeightRuleChargeMapType>;
    constructor(chargeTable: Pick<GridElement, keyof GridElement>[][] | string);
    fromString(serializedChargeTable: string): ChargeMapIterableType<ChargeName, WeightRatioRule> | InvalidChargeSetMessage<WeightRuleChargeMapType>;
    getChargeMap(chargeMap: Pick<GridElement, keyof GridElement>[][]): ChargeMapIterableType<ChargeName, WeightRatioRule> | InvalidChargeSetMessage<WeightRuleChargeMapType>;
    invalidChargeSetMessage(): InvalidChargeSetMessage<WeightRuleChargeMapType>;
    toString(): string;
    calcMe(shipmentDetails: ShipmentDetails<'WeightRulesCharges', BoxesTypeRequest>): ApplyingCharge<'WeightRulesCharges', ChargeName, WeightRatioRule, WeightRuleChargeMapType, CurrencyType, Mandatory, BoxesTypeRequest>[] | InvalidChargeSetMessage<WeightRuleChargeMapType>;
}
