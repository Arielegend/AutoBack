import { GridElement } from '../Rates/rateTypes';
import { RequestFobAir } from '../RFQ/requestTypes';
import { TotalChargeSet } from '../ApplyingCharges/chargeTypes';
export declare const airTable: () => ({
    field: string;
    value: string;
    fieldType?: undefined;
    currencyType?: undefined;
} | {
    value: string;
    field: string;
    fieldType: string;
    currencyType?: undefined;
} | {
    field: string;
    value: string;
    fieldType: string;
    currencyType: string;
})[][];
export declare const airRatio: () => string;
export declare const airLimits: () => {
    limitHeightShipment: string;
    limitWeightShipment: string;
    limitWeightBox: string;
};
export declare const inputFreightTransportRatesObject: () => {
    airTable: string;
    airLimits: string;
    airRatio: string;
};
export declare const localsAirByWeightTable: () => ({
    field: string;
    value: string;
    fieldType?: undefined;
    currencyType?: undefined;
} | {
    value: string;
    field: string;
    fieldType: string;
    currencyType: string;
})[][];
export declare const localsAirFixTable: () => ({
    field: string;
    value: string;
    fieldType?: undefined;
    currencyType?: undefined;
} | {
    value: string;
    field: string;
    fieldType: string;
    currencyType: string;
})[][];
export declare const yata: () => string;
export declare const inputAirLocalsObject: () => {
    LocalsAirByWeightTable: string;
    LocalsAirFixTable: string;
    yata: string;
};
export declare const yataChargeSet: () => Pick<GridElement, keyof GridElement>[][];
export declare const processedAirTable: () => Pick<GridElement, "style" | "width" | "overflow" | "head" | "section" | "key" | "field" | "value" | "fieldType" | "currencyType" | "fieldName" | "readOnly" | "nonDeletable" | "component" | "colSpan" | "forceComponent" | "edited" | "updated" | "selected" | "options" | "name" | "memberOfSection" | "sectionIndex" | "paddingCell" | "staticSection" | "fieldMetadata" | "rowSpan" | "columnMetadataSection" | "dataEditor" | "className" | "disableEvents" | "valueViewer">[][];
export declare const requestDetails: () => RequestFobAir;
export declare const totalAirFreight: () => TotalChargeSet;
