import { ContainerType, CurrencyType, GridElement, Mandatory, RateType } from '../Rates/rateTypes';
/** Input Object Local Charges*/
export declare const generalInfoInput: () => {
    carrierName: string;
    freightForwarderName: string;
    rateID: string;
    rateName: string;
    rateType: RateType;
    region: string;
    validFrom: string;
    validTo: string;
};
export declare const oceanFclTable: () => Pick<GridElement, keyof GridElement>[][];
export declare const localsByContainerTable: () => Pick<GridElement, keyof GridElement>[][];
export declare const oceanFclHeavy: () => Pick<GridElement, keyof GridElement>[][];
export declare const oceanFclFreightFix: () => ({
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
export declare const inputFobOceanFclObject: () => {
    freightTransportRatesObject: {
        oceanFCLTable: string;
        oceanFCLFreightFix: string;
        oceanFCLHEAVY: string;
        portDefaultDestinationIsrael: string;
    };
    localRatesObject: {
        LocalsOceanFCLByContainerTypeTable: string;
        LocalsOceanFCLFixTable: string;
        thc20: string;
        thc40: string;
    };
    carrierName: string;
    freightForwarderName: string;
    rateID: string;
    rateName: string;
    rateType: RateType;
    region: string;
    validFrom: string;
    validTo: string;
};
/** Mock Types FCL Charges */
export interface FclBaseCharges {
    containerType: ContainerType;
    amount: string;
    currency: CurrencyType;
    mandatory: Mandatory;
}
export interface HeavyContainerCharges {
    value: string;
    amount: string;
    currency: CurrencyType;
    mandatory: Mandatory;
}
export interface FixChargeProps {
    chargeName: string;
    amount: string;
    currency: CurrencyType;
    mandatory: Mandatory;
}
export declare type LocalContainerChargeProps = {
    chargeName: string;
    containerType: ContainerType;
    currency: CurrencyType;
    amount: string;
    mandatory: Mandatory;
};
export interface ThcChargeProps {
    containerType: ContainerType;
    currency: CurrencyType;
    amount: string;
    mandatory: Mandatory;
}
/** Mock FCL Charges string generators. */
export declare const fclBaseCharges: (props: FclBaseCharges[]) => string[];
export declare const oceanHeavyCharges: (props: HeavyContainerCharges[]) => string[];
export declare const fclFreightFix: (props: FixChargeProps[]) => string[];
export declare const localFreightFix: (props: FixChargeProps[]) => string[];
export declare const localContainerCharges: (props: LocalContainerChargeProps[]) => string[];
export declare const thcCharges: (props: ThcChargeProps[]) => string[];
