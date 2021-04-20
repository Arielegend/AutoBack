import { ContainerDetails } from '../../../RFQ/requestTypes';
import { ChargeMap, ChargeMapIterableType, ChargeMapName, ContainerType, ContainerCharge, CurrencyType, FclChargeMapType, GridElement, InvalidChargeSetMessage, Mandatory, ShipmentDetails, ContainerTypeRequest } from '../../../Rates/rateTypes';
import { ApplyingCharge } from '../../../ApplyingCharges/ApplyingCharge';
export declare class FreightFclBaseChargeMap implements ChargeMap<'FclCharge', ContainerType, ContainerCharge, FclChargeMapType, ContainerTypeRequest> {
    chargeMapName: ChargeMapName<FclChargeMapType>;
    chargeMap: ChargeMapIterableType<ContainerType, ContainerCharge> | InvalidChargeSetMessage<FclChargeMapType>;
    constructor(baseRate: Pick<GridElement, keyof GridElement>[][] | string);
    getChargeMap(chargeTable: Pick<GridElement, keyof GridElement>[][]): ChargeMapIterableType<ContainerType, ContainerCharge> | InvalidChargeSetMessage<FclChargeMapType>;
    invalidChargeSetMessage(): InvalidChargeSetMessage<FclChargeMapType>;
    fromString(serializedChargeTable: string): ChargeMapIterableType<ContainerType, ContainerCharge> | InvalidChargeSetMessage<FclChargeMapType>;
    toString(): string;
    calcMe(shipmentDetails: ShipmentDetails<'FclCharge', ContainerTypeRequest>): ApplyingCharge<'FclCharge', ContainerType, ContainerCharge, FclChargeMapType, CurrencyType, Mandatory, ContainerTypeRequest>[] | InvalidChargeSetMessage<FclChargeMapType>;
    rateCoversRequestedContainers(containers: ContainerDetails[]): boolean;
}
