import { AirChargeKey, AirChargeMapType, BoxesTypeRequest, ChargeMap, ChargeMapIterableType, ChargeMapName, CurrencyType, GridElement, InvalidChargeSetMessage, Mandatory, ShipmentDetails, WeightRatioRule } from '../../../Rates/rateTypes';
import { ApplyingCharge } from '../../../ApplyingCharges/ApplyingCharge';
/**
 * System subtypes.
 * */
export declare class FreightAirBaseChargeMap implements ChargeMap<'AirChargeMap', AirChargeKey, WeightRatioRule, AirChargeMapType, BoxesTypeRequest> {
    chargeMapName: ChargeMapName<AirChargeMapType>;
    chargeMap: ChargeMapIterableType<AirChargeKey, WeightRatioRule> | InvalidChargeSetMessage<AirChargeMapType>;
    constructor(chargeTable: Pick<GridElement, keyof GridElement>[][] | string);
    getChargeMap(baseRate: Pick<GridElement, keyof GridElement>[][]): ChargeMapIterableType<AirChargeKey, WeightRatioRule> | InvalidChargeSetMessage<AirChargeMapType>;
    invalidChargeSetMessage(): InvalidChargeSetMessage<AirChargeMapType>;
    fromString(serializedChargeTable: string): ChargeMapIterableType<AirChargeKey, WeightRatioRule> | InvalidChargeSetMessage<AirChargeMapType>;
    toString(): string;
    calcMe(shipmentDetails: ShipmentDetails<'AirChargeMap', BoxesTypeRequest>): ApplyingCharge<'AirChargeMap', AirChargeKey, WeightRatioRule, AirChargeMapType, CurrencyType, Mandatory, BoxesTypeRequest>[] | InvalidChargeSetMessage<AirChargeMapType>;
    private getQuotedRateTotal;
    private orderAirChargeByWeightKeys;
    private parseWeightField;
}
