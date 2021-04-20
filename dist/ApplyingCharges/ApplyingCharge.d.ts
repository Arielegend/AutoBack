import { ApplyingCurrencyCharge, ChargeMapType, CurrencyRateChargeType, CurrencyType, Mandatory, QuoteParam, RateChargeAlias, RateChargeKey, RateChargeMapType, WeightRatioRule, WeightUnit } from '../Rates/rateTypes';
import { Money } from 'bigint-money';
import { ApplyingQuoteCharge } from './chargeTypes';
import { Box } from '../CargoUnit/Box';
import { Container } from '../CargoUnit/Container';
/** Class representing a single applyingCharge we apply in a rate, in any part, on any type.
 *
 * @ApplyingCharge<C extends CurrencyType, M extends Mandatory>{
 *   @applyingCharge: {
 *   @amount: string # value in decimal point.
 *   @currency: C # C is of CurrencyType = 'NIS' | 'USD' | 'EUR'.
 *   @mandatory: M # M is 'Y'| 'N', depending on if the rate applyingCharge is mandatory or not.
 *  }
 * */
export declare class ApplyingCharge<RN extends RateChargeAlias, RK extends RateChargeKey, R extends CurrencyRateChargeType, RMT extends ChargeMapType<RN, RK, R> & RateChargeMapType, C extends CurrencyType, M extends Mandatory, QP extends QuoteParam> {
    private readonly chargeMapName?;
    private applyingCharge?;
    private readonly rateCharge?;
    private shipmentRequest?;
    constructor(chargeMapName: RN, currencyCharge?: ApplyingCurrencyCharge<C, M>, rateCharge?: ApplyingQuoteCharge<RMT>, shipmentRequest?: QP);
    getCharge(): {
        currency: C;
        amount: string;
        mandatory: M;
    } | undefined;
    getCurrency(): C | undefined;
    getMandatory(): M | undefined;
    currencyChargeFromStringValue(currency: string, mandatory: M): this;
    private moneyToCurrencyChargeObject;
    scaleCharge(scalar: string): void;
    toMoney(): Money | undefined;
    eq(otherCharge: ApplyingCharge<RN, RK, R, RMT, C, M, QP>): boolean | undefined;
    gt(otherCharge: ApplyingCharge<RN, RK, R, RMT, C, M, QP>): boolean | undefined;
    st(otherCharge: ApplyingCharge<RN, RK, R, RMT, C, M, QP>): boolean | undefined;
    weightChargeParameter: (applyingRateCharge: WeightRatioRule, unit: WeightUnit) => string;
    private static getContainerChargeParameter;
    boxesRequest: (boxes: Box[]) => string;
    containerRequest: (containers: Container[]) => string;
    /**TODO Switch to Total Request*/
    totalRequest: (sumTotal: ApplyingCurrencyCharge<CurrencyType, Mandatory>) => string;
    toString(): string;
}
