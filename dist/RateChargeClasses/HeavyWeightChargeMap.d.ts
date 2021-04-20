import { ContainerDetails } from '../RFQ/requestTypes';
import { ApplyingCurrencyCharge, ChargeMap, ChargeMapIterableType, ChargeMapName, ContainerTypeRequest, CurrencyType, FixCharge, GridElement, HeavyWeightChargeMapType, InvalidChargeSetMessage, Mandatory, ShipmentDetails, Weight } from '../Rates/rateTypes';
import { ApplyingCharge } from '../ApplyingCharges/ApplyingCharge';
import { ApplyingQuoteCharge } from '../ApplyingCharges/chargeTypes';
/**
 * System subtypes.
 * */
export declare class HeavyWeightChargesMap implements ChargeMap<'HeavyWeightCharges', Weight<'ton'>, FixCharge, HeavyWeightChargeMapType, ContainerTypeRequest> {
    chargeMapName: ChargeMapName<HeavyWeightChargeMapType>;
    chargeMap: ChargeMapIterableType<Weight<'ton'>, FixCharge> | InvalidChargeSetMessage<HeavyWeightChargeMapType>;
    constructor(chargeTable: Pick<GridElement, keyof GridElement>[][] | string);
    getChargeMap(freightTransportRateObject: Pick<GridElement, keyof GridElement>[][]): ChargeMapIterableType<Weight<'ton'>, FixCharge> | InvalidChargeSetMessage<HeavyWeightChargeMapType>;
    fromString(serializedChargeMap: string): ChargeMapIterableType<Weight<'ton'>, FixCharge> | InvalidChargeSetMessage<HeavyWeightChargeMapType>;
    toString(): string;
    invalidChargeSetMessage(): InvalidChargeSetMessage<HeavyWeightChargeMapType>;
    calcMe(containers: ShipmentDetails<'LocalContainerCharges', ContainerTypeRequest>): ApplyingCharge<'HeavyWeightCharges', Weight<'ton'>, FixCharge, HeavyWeightChargeMapType, CurrencyType, Mandatory, ContainerTypeRequest>[] | InvalidChargeSetMessage<HeavyWeightChargeMapType>;
    getChargeForContainer(container: ContainerDetails, chargeMap: ChargeMapIterableType<Weight<'ton'>, FixCharge>): {
        applyingCharge: ApplyingCurrencyCharge<CurrencyType, 'Y'>;
        containerCharge: ApplyingQuoteCharge<HeavyWeightChargeMapType>;
        container: ContainerDetails;
    };
}
