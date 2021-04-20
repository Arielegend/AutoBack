import { ChargeMap, ChargeMapIterableType, ChargeMapName, ChargeName, ContainerCharge, ContainerTypeRequest, CurrencyType, GridElement, InvalidChargeSetMessage, LocalContainerChargeMapType, Mandatory, ShipmentDetails } from '../Rates/rateTypes';
import { ApplyingCharge } from '../ApplyingCharges/ApplyingCharge';
export declare class LocalContainerChargeMap implements ChargeMap<'LocalContainerCharges', ChargeName, ContainerCharge, LocalContainerChargeMapType, ContainerTypeRequest> {
    chargeMapName: ChargeMapName<LocalContainerChargeMapType>;
    chargeMap: ChargeMapIterableType<ChargeName, ContainerCharge> | InvalidChargeSetMessage<LocalContainerChargeMapType>;
    constructor(chargeTable: Pick<GridElement, keyof GridElement>[][] | string);
    getChargeMap(chargeTable: Pick<GridElement, keyof GridElement>[][]): ChargeMapIterableType<ChargeName, ContainerCharge> | InvalidChargeSetMessage<LocalContainerChargeMapType>;
    fromString(serializedChargeTable: string): ChargeMapIterableType<ChargeName, ContainerCharge> | InvalidChargeSetMessage<LocalContainerChargeMapType>;
    toString(): string;
    invalidChargeSetMessage(): InvalidChargeSetMessage<LocalContainerChargeMapType>;
    calcMe(shipmentDetails: ShipmentDetails<'LocalContainerCharges', ContainerTypeRequest>): ApplyingCharge<'LocalContainerCharges', ChargeName, ContainerCharge, LocalContainerChargeMapType, CurrencyType, Mandatory, ContainerTypeRequest>[] | InvalidChargeSetMessage<LocalContainerChargeMapType>;
}
