/// <reference types="react" />
import ReactDataSheet from 'react-datasheet';
import { BoxDetails, ContainerDetails } from '../RFQ/requestTypes';
import { FixChargeMap } from '../RateChargeClasses/FixChargeMap';
import { HeavyWeightChargesMap } from '../RateChargeClasses/HeavyWeightChargeMap';
import { LocalContainerChargeMap } from '../RateChargeClasses/LocalContainerChargeMap';
import { LocalsByWeightChargeMap } from '../RateChargeClasses/LocalsByWeightChargeMap';
import { ApplyingCharge } from '../ApplyingCharges/ApplyingCharge';
import { TotalChargeSet } from '../ApplyingCharges/chargeTypes';
import { GenericMeasure } from 'safe-units';
import { Box } from '../CargoUnit/Box';
import { Container } from '../CargoUnit/Container';
export declare type CellFieldType = 'cm' | 'kg' | 'ton' | 'decimal' | 'int' | 'date' | 'currency' | 'day' | 'boolean' | 'options' | 'percentOfCurrency' | 'dropdown';
export declare type CurrencyType = 'NIS' | 'USD' | 'EUR';
export interface GridElement extends ReactDataSheet.Cell<GridElement> {
    field: string;
    value: string | number | null;
    fieldType?: CellFieldType;
    currencyType?: CurrencyType;
    fieldName?: string;
    head?: boolean;
    readOnly?: boolean;
    nonDeletable?: boolean;
    component?: JSX.Element;
    colSpan?: number;
    forceComponent?: boolean;
    style?: Object;
    edited?: boolean;
    updated?: boolean;
    selected?: boolean;
    options?: string[];
    name?: string;
    section?: 'vertical' | 'horizontal';
    memberOfSection?: string;
    sectionIndex?: number;
    paddingCell?: boolean;
    staticSection?: boolean;
    fieldMetadata?: IValues;
    rowSpan?: number;
    columnMetadataSection?: GridElement[][];
}
export interface IValues {
    [key: string]: string | IValues;
}
export interface NonNestedIValues {
    [key: string]: string;
}
export declare type Mandatory = 'Y' | 'N';
export declare type CurrencyCharge = {
    amount: string;
    currency: CurrencyType;
    mandatory: Mandatory;
};
export declare type ModeOfTransport = 'AIR' | 'OCEAN';
export declare type ApplyingCurrencyCharge<C extends CurrencyType, M extends Mandatory> = {
    amount: string;
    currency: C;
    mandatory: M;
};
export declare type PercentageCharge = {
    percentage: string;
};
export declare type WeightUnit = 'kg' | 'ton';
export declare type Weight<T extends WeightUnit = 'kg'> = {
    value: string;
    unit: WeightUnit;
};
export declare type Length = {
    value: string;
    unit: 'cm';
};
export declare type PhysicalObjectSize = {
    length: Length;
    width: Length;
    height: Length;
};
export declare type Volume = {
    length: Length;
    width: Length;
    height: Length;
    volume: GenericMeasure<number, {
        length: '3';
    }>;
    unit: 'cm3';
};
export declare type VolumeWeightParam = {
    weight: Weight;
    volumeUnit: 'CBM';
};
export declare type MeasurementLimits = {
    heightLimit: Length;
    weightLimits: Weight;
    weightLimitPerBox: Weight;
};
export declare type LimitsShipmentsAirLcl = {
    limitHeightShipment: string;
    limitWeightShipment: string;
    limitWeightBox: string;
};
export declare type ContainerType = 'DV20' | 'DV40' | 'HQ40' | 'OT20' | 'OT40' | 'RF20' | 'RF40' | 'FR40' | 'TK20';
export declare type ContainerLimits = Map<ContainerType, MeasurementLimits> | 'No Limits';
export declare type ChargeName = string & Exclude<string, 'perTon'>;
export declare type ContainerCharge = {
    charge: CurrencyCharge;
    container: ContainerType;
};
export declare type LocalContainerCharges = Map<ChargeName, ContainerCharge>;
export declare type WeightRatioRule = {
    ratio: string;
    charge: CurrencyCharge;
};
export declare type FixCharge = {
    charge: CurrencyCharge;
};
export declare type LclKey = 'perTon';
export declare type AirChargeKey = Weight;
export declare type RateChargeKey = ChargeName | ContainerType | Weight<'ton'> | LclKey | Weight | 'percent' | AirChargeKey | 'Total';
export declare type CurrencyRateChargeType = WeightRatioRule | ContainerCharge | PercentageCharge | FixCharge;
export declare type FixCharges = Map<ChargeName, FixCharge>;
export declare type WeightRulesCharges = Map<ChargeName, WeightRatioRule>;
export declare type WeightCharges<T extends WeightUnit = 'kg'> = Map<Weight<T>, WeightRatioRule>;
export declare type AirChargeMap = Map<AirChargeKey, WeightRatioRule>;
export declare type HeavyWeightCharges = Map<Weight<'ton'>, FixCharge>;
export declare type YataCharge = Map<'percent', PercentageCharge>;
export declare type ThcCharge = Map<ContainerType, ContainerCharge>;
export declare type RateChargeAlias = 'ThcCharge' | 'LclCharge' | 'LocalContainerCharges' | 'HeavyWeightCharges' | 'WeightCharges' | 'WeightRulesCharges' | 'FixCharges' | 'YataCharge' | 'AirChargeMap' | 'FclCharge' | 'ZeroCharge' | 'TotalNisCharge' | 'TotalUsdCharge' | 'TotalEurCharge';
export declare type TotalAlias = RateChargeAlias & 'TotalNisCharge' | 'TotalUsdCharge' | 'TotalEurCharge';
export declare type ChargeMapIterableType<RK extends RateChargeKey, R extends CurrencyRateChargeType> = Map<RK, R>;
export declare type ChargeMapType<RN extends RateChargeAlias, RK extends RateChargeKey, R extends CurrencyRateChargeType> = {
    chargeName: RN;
    chargeRateLines: ChargeMapIterableType<RK, R>;
};
export declare type ThcChargeMapType = ChargeMapType<'ThcCharge', ContainerType, ContainerCharge>;
export declare type LclChargeMapType = ChargeMapType<'LclCharge', LclKey, WeightRatioRule>;
export declare type LocalContainerChargeMapType = ChargeMapType<'LocalContainerCharges', ChargeName, ContainerCharge>;
export declare type HeavyWeightChargeMapType = ChargeMapType<'HeavyWeightCharges', Weight<'ton'>, FixCharge>;
export declare type WeightChargeMapType = ChargeMapType<'WeightCharges', Weight, WeightRatioRule>;
export declare type WeightRuleChargeMapType = ChargeMapType<'WeightRulesCharges', ChargeName, WeightRatioRule>;
export declare type FixChargeMapType = ChargeMapType<'FixCharges', ChargeName, FixCharge>;
export declare type YataChargeMapType = ChargeMapType<'YataCharge', 'percent', PercentageCharge>;
export declare type AirChargeMapType = ChargeMapType<'AirChargeMap', AirChargeKey, WeightRatioRule>;
export declare type FclChargeMapType = ChargeMapType<'FclCharge', ContainerType, ContainerCharge>;
/**
 *  Query Rate Type - queried when a quote of @RateType is requested.
 * * TODO: write full explanation.
 * */
export declare type RateChargeMapType = (ThcChargeMapType | LclChargeMapType | LocalContainerChargeMapType | HeavyWeightChargeMapType | WeightChargeMapType | WeightRuleChargeMapType | FixChargeMapType | YataChargeMapType | AirChargeMapType | FclChargeMapType) & ChargeMapType<RateChargeAlias, RateChargeKey, CurrencyRateChargeType>;
export declare type RateType = 'ImportFOBOCEANFCL' | 'ImportFOBOCEANLCL' | 'ImportFOBAIR' | 'ImportEXWOCEANFCL' | 'ImportEXWOCEANLCL' | 'ImportEXWAIR';
/**
 * Rate Step Form Submission type.
 * * TODO: write full explanation.
 * */
export declare type RateSubmissionParams = {
    id: string;
    rateName: string;
    freightForwarderName: string;
    carrierName: string;
    rateType: RateType;
    region: string;
    validFrom: string;
    validTo: string;
    originRates?: string;
    freightTransportRates: string;
    localRates: string;
};
export declare type RateSubmissionParamsDeserialized = {
    rateID: string;
    rateName: string;
    freightForwarderName: string;
    region: string;
    carrierName: string;
    rateType: RateType;
    validFrom: string;
    validTo: string;
    originRatesObject?: IValues;
    freightTransportRatesObject: IValues;
    localRatesObject: IValues;
};
/**
 * Extracted Rate Line per Point of Origin -> Point of Arrival.
 * * TODO: write full explanation.
 */
export interface RateLineParams {
    rateID: string;
    rateName: string;
    pointOfOrigin: string;
    pointOfDestination: string;
    freightForwarderName: string;
    carrierName: string;
    rateType: RateType;
    validFrom: string;
    validTo: string;
    originCharges: string;
    freightTransportCharges: string;
    localCharges: string;
}
export declare type ChargeSetType = 'FCL' | 'LCL' | 'Air' | 'Inland' | 'Fix';
export declare type ErrorMessage = 'Invalid FCL ChargeSet.' | 'Invalid LCL ChargeSet.' | 'Invalid Inland ChargeSet.' | 'Invalid Fix ChargeSet.';
export declare type GeneralInfoRate = {
    rateID: string;
    rateType: RateType;
    rateName: string;
    freightForwarderName: string;
    carrierName: string;
    validFrom: string;
    validTo: string;
    region: string;
    cargoLoad?: string;
};
export declare type LclChargeParams = {
    generalInfo: GeneralInfoRate;
    oceanLclBaseRates: Pick<GridElement, keyof GridElement>[][];
    limits: LimitsShipmentsAirLcl;
    freightPartLclRatio: string;
    oceanLclLocalFix: FixChargeMap;
    oceanLclLocalWeight: LocalsByWeightChargeMap;
};
export declare type FclChargeParams = {
    generalInfo: GeneralInfoRate;
    oceanFclBaseRates: Pick<GridElement, keyof GridElement>[][];
    oceanFclHeavyRates: HeavyWeightChargesMap;
    oceanFclFreightFix: FixChargeMap;
    localsOceanFclFixRates: FixChargeMap;
    localsOceanFclContainerRates: LocalContainerChargeMap;
    thc20: string;
    thc40: string;
};
export declare type AirChargeParams = {
    generalInfo: GeneralInfoRate;
    airBaseRates: Pick<GridElement, keyof GridElement>[][];
    limits: LimitsShipmentsAirLcl;
    freightPartAirRatio: string;
    airLocalsFix: FixChargeMap;
    airLocalsByWeight: LocalsByWeightChargeMap;
    yata: PercentageCharge;
};
export declare type InvalidChargeSetMessage<R extends RateChargeMapType> = R extends ThcChargeMapType ? 'Invalid THC Charge.' : R extends LclChargeMapType ? 'Invalid LCL Base Charge' : R extends LocalContainerChargeMapType ? 'Invalid Locals By Container ChargeSet.' : R extends FclChargeMapType ? 'Invalid FCL ChargeSet.' : R extends HeavyWeightChargeMapType ? 'Invalid Heavy Weight ChargeSet.' : R extends AirChargeMapType ? 'Invalid Air Freight Charge' : R extends WeightChargeMapType ? 'Invalid Weight ChargeSet.' : R extends WeightRuleChargeMapType ? 'Invalid Locals By Weight ChargeSet.' : R extends YataChargeMapType ? 'Invalid Yata' : 'Invalid Fix ChargeSet.';
export declare type ChargeMapName<R extends RateChargeMapType> = R extends ThcChargeMapType ? 'ThcCharge' : R extends LclChargeMapType ? 'LclCharge' : R extends LocalContainerChargeMapType ? 'LocalContainerCharges' : R extends HeavyWeightChargeMapType ? 'HeavyWeightCharges' : R extends WeightChargeMapType ? 'WeightCharges' : R extends WeightRuleChargeMapType ? 'WeightRulesCharges' : R extends FixChargeMapType ? 'FixCharges' : R extends YataChargeMapType ? 'YataCharge' : R extends AirChargeMapType ? 'AirChargeMap' : 'FclCharge';
export declare type BoxesTypeRequest = {
    name: 'Boxes';
    requestDetails: BoxDetails[];
    chargeParamObj: Box[];
};
export declare type ContainerTypeRequest = {
    name: 'Containers';
    requestDetails: ContainerDetails[];
    chargeParamObj: Container[];
};
export declare type TotalChargeSetTypeRequest = {
    name: 'TotalChargeSet';
    requestDetails: TotalChargeSet;
    chargeParamObj: ApplyingCurrencyCharge<"NIS", "Y">;
};
export declare type FixTypeRequest = {
    name: 'FixChargeSet';
    details: [];
    chargeParamObj: [];
};
export declare type QuoteParam = BoxesTypeRequest | ContainerTypeRequest | TotalChargeSetTypeRequest | FixTypeRequest;
export declare type ShipmentDetails<RN extends RateChargeAlias, QP extends QuoteParam> = QP extends BoxesTypeRequest ? {
    name: 'Boxes';
    requestDetails: BoxDetails[];
} : QP extends TotalChargeSetTypeRequest ? {
    name: 'TotalChargeSet';
    requestDetails: TotalChargeSet;
} : QP extends ContainerTypeRequest ? {
    name: 'Containers';
    requestDetails: ContainerDetails[];
} : {
    name: 'FixChargeSet';
    requestDetails: [];
};
export interface ChargeMap<RN extends RateChargeAlias, RK extends RateChargeKey, R extends CurrencyRateChargeType, RMT extends ChargeMapType<RN, RK, R> & RateChargeMapType, QP extends QuoteParam> {
    chargeMap: ChargeMapIterableType<RK, R> | InvalidChargeSetMessage<RMT>;
    chargeMapName: ChargeMapName<RMT>;
    getChargeMap(chargeTable: Pick<GridElement, keyof GridElement>[][] | string): ChargeMapIterableType<RK, R> | InvalidChargeSetMessage<RMT>;
    fromString(serializedChargeMap: string): ChargeMapIterableType<RK, R> | InvalidChargeSetMessage<RMT>;
    invalidChargeSetMessage(): InvalidChargeSetMessage<RMT>;
    toString(): string;
    calcMe(shipmentDetails?: Pick<ShipmentDetails<RN, QP>, 'name' | 'requestDetails'>): ApplyingCharge<RN, RK, R, RMT, CurrencyType, Mandatory, QP>[] | InvalidChargeSetMessage<RMT>;
}
export declare type PerTon = 'perTon';
export declare type ThcType = 'thc20' | 'thc40';
