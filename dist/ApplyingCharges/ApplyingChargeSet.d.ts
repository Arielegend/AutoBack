import { TotalCharge } from './TotalCharge';
import { ApplyingCharge } from './ApplyingCharge';
import { ApplyingCurrencyCharge, CurrencyRateChargeType, CurrencyType, Mandatory, QuoteParam, RateChargeAlias, RateChargeKey, RateChargeMapType } from '../Rates/rateTypes';
export interface TotalCost<M extends Mandatory> {
    totalChargesInNis: {
        sumTotal: ApplyingCurrencyCharge<'NIS', M>;
        charges: ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType, 'NIS', M, QuoteParam>[];
    };
    totalChargesInUsd: {
        sumTotal: ApplyingCurrencyCharge<'USD', M>;
        charges: ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType, 'USD', M, QuoteParam>[];
    };
    totalChargesInEur: {
        sumTotal: ApplyingCurrencyCharge<'EUR', M>;
        charges: ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType, 'EUR', M, QuoteParam>[];
    };
}
export declare type TotalChargeCost = {
    mandatory: TotalCost<'Y'>;
    nonMandatory: TotalCost<'N'>;
};
export declare type TotalChargeSetCost = {
    originCost?: TotalChargeCost;
    freightTransportCost?: TotalChargeCost;
    localCost: TotalChargeCost;
};
export declare class ApplyingChargeSet {
    private origin?;
    private freightTransport?;
    private local;
    constructor(localRateCharges: ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType, CurrencyType, Mandatory, QuoteParam>[], freightTransportCharges?: ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType, CurrencyType, Mandatory, QuoteParam>[], originCharges?: ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType, CurrencyType, Mandatory, QuoteParam>[]);
    getTotalCharge(): TotalChargeSetCost | undefined;
    calculateCostPerPart<M extends Mandatory>(part: TotalCharge<M>): TotalCost<M> | undefined;
    toString(): string;
    getApplyingCurrency: (charge: ApplyingCurrencyCharge<CurrencyType, Mandatory>) => string;
    private getTotalChargePerArray;
}
