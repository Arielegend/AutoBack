import { ApplyingCurrencyCharge, CurrencyCharge, CurrencyRateChargeType, CurrencyType, Mandatory, QuoteParam, RateChargeAlias, RateChargeKey, RateChargeMapType } from '../Rates/rateTypes';
import { Money } from 'bigint-money';
import { Currency, InvalidCurrencyMessage, InvalidMoneyAdditionMessage, InvalidMoneyMessage, TotalChargeSet } from './chargeTypes';
import { ApplyingCharge } from './ApplyingCharge';
import { TotalCharge } from './TotalCharge';
/**
 * CurrencyCharge Wrappers for BigIntMoney object.
 * */
export declare const currencyChargeObject: (charge: CurrencyCharge | Currency) => Money;
export declare const moneyToCurrencyCharge: (moneyCharge: Money) => Currency;
export declare const moneyFromString: (currencyCharge: CurrencyCharge | string) => Money | [InvalidMoneyMessage];
export declare const currencyStringMatch: (currencyCharge: string | CurrencyCharge) => RegExpMatchArray | null;
export declare const currencyFromString: (currencyCharge: CurrencyCharge | string) => Currency | InvalidCurrencyMessage;
export declare const addCharges: (chargeA: CurrencyCharge, chargeB: CurrencyCharge, mandatory: Mandatory) => CurrencyCharge | [InvalidMoneyMessage, InvalidMoneyAdditionMessage];
export declare const isZeroCharge: (charge: CurrencyCharge) => boolean;
export declare const compareCharges: (chargeA: CurrencyCharge, chargeB: CurrencyCharge) => 0 | 1 | -1;
export declare const zeroCharge: <C extends CurrencyType, M extends Mandatory>(currency: C, mandatory: M) => ApplyingCurrencyCharge<C, M>;
export declare const getPercentageCharge: (charge: CurrencyCharge, percentage: string) => CurrencyCharge;
export declare const reduceApplyingChargesArrayToTotal: (applyingCharges: ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType, CurrencyType, Mandatory, QuoteParam>[] | string) => TotalChargeSet | undefined;
export declare function totalApplyingInitialCharge<C extends CurrencyType, M extends Mandatory>(currency: C, mandatory: M): ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType, C, M, QuoteParam>[];
export declare const getZeroValueTotalObject: <M extends Mandatory>(mandatory: M) => TotalCharge<M>;
