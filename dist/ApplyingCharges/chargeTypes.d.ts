import { AirChargeMapType, ApplyingCurrencyCharge, ChargeName, ContainerCharge, ContainerType, CurrencyCharge, CurrencyRateChargeType, CurrencyType, FixCharge, FixChargeMapType, HeavyWeightChargeMapType, LclChargeMapType, LclKey, LocalContainerChargeMapType, Mandatory, PercentageCharge, PerTon, QuoteParam, RateChargeAlias, RateChargeKey, RateChargeMapType, ThcChargeMapType, Weight, WeightChargeMapType, WeightRatioRule, WeightRuleChargeMapType, YataChargeMapType } from '../Rates/rateTypes';
import { ApplyingCharge } from './ApplyingCharge';
import { TotalCharge } from './TotalCharge';
export declare type Currency = Pick<CurrencyCharge, 'currency' | 'amount'>;
export interface TotalChargeParams<M extends Mandatory> {
    totalChargesInNis: ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType, 'NIS', M, QuoteParam>[];
    totalChargesInUsd: ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType, 'USD', M, QuoteParam>[];
    totalChargesInEur: ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType, 'EUR', M, QuoteParam>[];
}
export declare type ApplyingCurrency<C extends CurrencyType> = Pick<ApplyingCurrencyCharge<C, 'Y'>, 'currency' | 'amount'>;
export declare type TotalChargeSet = {
    mandatory: TotalCharge<'Y'>;
    nonMandatory: TotalCharge<'N'>;
};
export declare type InvalidCurrencyMessage = 'Error: Invalid Currency Construction.';
export declare type InvalidMoneyMessage = 'Error: Conversion to BigInt Money Failure.';
export declare type InvalidMoneyAdditionMessage = 'Error: Add Currency Charges Failure.';
export declare type ApplyingQuoteCharge<RMT extends RateChargeMapType> = 
/** Inferring the type of rate charge from the type of a charge map.*/
RMT extends ThcChargeMapType ? [
    ContainerType,
    ContainerCharge
] : RMT extends LclChargeMapType ? [
    LclKey,
    WeightRatioRule
] : RMT extends LocalContainerChargeMapType ? [
    ChargeName,
    ContainerCharge
] : RMT extends WeightChargeMapType ? [
    Weight,
    WeightRatioRule
] : RMT extends WeightRuleChargeMapType ? [
    string,
    WeightRatioRule
] : RMT extends HeavyWeightChargeMapType ? [
    Weight<'ton'>,
    FixCharge
] : RMT extends FixChargeMapType ? [
    string,
    FixCharge
] : RMT extends YataChargeMapType ? [
    'percent',
    PercentageCharge
] : 
/** Base Charges in Fob */
RMT extends LclChargeMapType ? [
    PerTon,
    WeightRatioRule
] : RMT extends AirChargeMapType ? [
    Weight | 'minimumWeight',
    WeightRatioRule
] : [
    ContainerType,
    FixCharge
];
