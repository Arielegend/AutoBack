import { ChargeMap, ChargeMapIterableType, ChargeMapName, ChargeName, CurrencyType, FixCharge, FixChargeMapType, FixCharges, FixTypeRequest, GridElement, InvalidChargeSetMessage, Mandatory } from '../Rates/rateTypes';
import { ApplyingCharge } from '../ApplyingCharges/ApplyingCharge';
/**
 * Charge Parameters to be multiplying with the unit charge.
 * TODO: write full explanation.
 * */
export declare class FixChargeMap implements ChargeMap<'FixCharges', ChargeName, FixCharge, FixChargeMapType, FixTypeRequest> {
    chargeMapName: ChargeMapName<FixChargeMapType>;
    chargeMap: ChargeMapIterableType<ChargeName, FixCharge> | InvalidChargeSetMessage<FixChargeMapType>;
    constructor(chargesTable: Pick<GridElement, keyof GridElement>[][] | string);
    fromString(serializedChargeMap: string): "Invalid Fix ChargeSet." | FixCharges;
    toString(): string;
    getChargeMap(chargeTable: Pick<GridElement, keyof GridElement>[][]): FixCharges | InvalidChargeSetMessage<FixChargeMapType>;
    invalidChargeSetMessage(): InvalidChargeSetMessage<FixChargeMapType>;
    calcMe(): ApplyingCharge<'FixCharges', ChargeName, FixCharge, FixChargeMapType, CurrencyType, Mandatory, FixTypeRequest>[] | InvalidChargeSetMessage<FixChargeMapType>;
}
