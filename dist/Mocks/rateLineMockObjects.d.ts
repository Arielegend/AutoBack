import { RateType } from '../Rates/rateTypes';
import { FclBaseCharges, FixChargeProps, HeavyContainerCharges, LocalContainerChargeProps, ThcChargeProps } from './fclMockObjects';
export declare const generalInfo: (carrierName: string, freightForwarderName: string, rateId: string, rateName: string, rateType: RateType, region: string, validFrom: string, validTo: string, pointOfOrigin: string, pointOfDestination: string, transitTime: string, route: string) => string[];
export declare type GeneralInfoParams = {
    carrierName: string;
    freightForwarderName: string;
    rateId: string;
    rateName: string;
    rateType: RateType;
    region: string;
    validFrom: string;
    validTo: string;
    pointOfOrigin: string;
    pointOfDestination: string;
    transitTime: string;
    route: string;
};
export declare type RateLineChargeProps = {
    generalInfoParams: GeneralInfoParams;
    fclBaseChargeParams: FclBaseCharges[];
    heavyChargeParams: HeavyContainerCharges[];
    oceanFclFreightFix: FixChargeProps[];
    localContainerParams: LocalContainerChargeProps[];
    localsOceanFclFixRates: FixChargeProps[];
    thcObject: ThcChargeProps[];
};
export declare const rateLineMock: (props: RateLineChargeProps[]) => string[];
