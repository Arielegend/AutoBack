import { ApplyingCharge } from './ApplyingCharge';
import { ApplyingCurrencyCharge, ChargeMapType, CurrencyRateChargeType, CurrencyType, Mandatory, PercentageCharge, QuoteParam, RateChargeAlias, RateChargeKey, RateChargeMapType, TotalChargeSetTypeRequest } from '../Rates/rateTypes.js';
import { TotalChargeParams } from './chargeTypes';
import { Money } from 'bigint-money';
import { TotalCost } from './ApplyingChargeSet';
export declare class TotalCharge<M extends Mandatory> {
    private totalChargesInNis;
    private totalChargesInUsd;
    private totalChargesInEur;
    private mandatory;
    constructor(mandatory: M, total: TotalChargeParams<M>);
    getTotalCharge(): {
        totalChargesInNis: {
            sumTotal: ApplyingCurrencyCharge<"NIS", M>;
            charges: ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType, "NIS", M, QuoteParam>[];
        };
        totalChargesInUsd: {
            sumTotal: ApplyingCurrencyCharge<"USD", M>;
            charges: ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType, "USD", M, QuoteParam>[];
        };
        totalChargesInEur: {
            sumTotal: ApplyingCurrencyCharge<"EUR", M>;
            charges: ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType, "EUR", M, QuoteParam>[];
        };
    };
    private setZeroChargeIfEmpty;
    calculatePercentCharge<PCN extends RateChargeAlias, PCM extends Mandatory>(percentageChargeName: PCN, mandatory: PCM, percentage: string, shipmentDetails: TotalChargeSetTypeRequest): {
        totalChargesInNis: ApplyingCharge<PCN, "percent", PercentageCharge, ChargeMapType<PCN, "percent", PercentageCharge> & ChargeMapType<"YataCharge", "percent", PercentageCharge>, "NIS", PCM, TotalChargeSetTypeRequest>;
    };
    getTotalSum(): string;
    calculateTotalCharge(): TotalCost<M>;
    getMandatory(): M;
    toString(): string;
    applyingCurrencyChargeToMoney<C extends CurrencyType, M extends Mandatory>(charge: ApplyingCurrencyCharge<C, M>): Money;
    addCharges<C extends CurrencyType, M extends Mandatory>(sumTotal: ApplyingCurrencyCharge<C, M>, chargeB: ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, any, C, M, QuoteParam>): ApplyingCurrencyCharge<C, M> | undefined;
    private reduceChargeSum;
    private getSumTotalForSpecificCurrency;
}
