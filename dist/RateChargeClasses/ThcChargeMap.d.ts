import { ChargeMap, ChargeMapIterableType, ChargeMapName, ContainerType, ContainerCharge, CurrencyType, GridElement, InvalidChargeSetMessage, Mandatory, ThcChargeMapType, ShipmentDetails, ContainerTypeRequest } from '../Rates/rateTypes';
import { ApplyingCharge } from '../ApplyingCharges/ApplyingCharge';
export declare class ThcChargeMap implements ChargeMap<'ThcCharge', ContainerType, ContainerCharge, ThcChargeMapType, ContainerTypeRequest> {
    chargeMapName: ChargeMapName<ThcChargeMapType>;
    chargeMap: ChargeMapIterableType<ContainerType, ContainerCharge> | InvalidChargeSetMessage<ThcChargeMapType>;
    constructor(chargeTable: GridElement[][] | string);
    fromString(serializedChargeMap: string): ChargeMapIterableType<ContainerType, ContainerCharge> | InvalidChargeSetMessage<ThcChargeMapType>;
    getChargeMap(chargeTable: Pick<GridElement, keyof GridElement>[][]): ChargeMapIterableType<ContainerType, ContainerCharge> | InvalidChargeSetMessage<ThcChargeMapType>;
    invalidChargeSetMessage(): InvalidChargeSetMessage<ThcChargeMapType>;
    toString(): string;
    calcMe(containers: ShipmentDetails<'ThcCharge', ContainerTypeRequest>): ApplyingCharge<'ThcCharge', ContainerType, ContainerCharge, ThcChargeMapType, CurrencyType, Mandatory, ContainerTypeRequest>[] | InvalidChargeSetMessage<ThcChargeMapType>;
}
