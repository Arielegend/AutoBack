import {
  ApplyingCurrencyCharge,
  CurrencyCharge,
  CurrencyRateChargeType,
  CurrencyType,
  Mandatory, QuoteParam,
  RateChargeAlias,
  RateChargeKey,
  RateChargeMapType,
} from '../Rates/rateTypes';
import { Money } from 'bigint-money';
import {
  Currency,
  InvalidCurrencyMessage,
  InvalidMoneyAdditionMessage,
  InvalidMoneyMessage,
  TotalChargeSet,
} from './chargeTypes';
import { ApplyingCharge } from './ApplyingCharge';
import { TotalCharge } from './TotalCharge';

/**
 * CurrencyCharge Wrappers for BigIntMoney object.
 * */
export const currencyChargeObject = (charge: CurrencyCharge | Currency) => {
  return new Money(charge.amount, charge.currency);
};
export const regexCurrencyInvalidConstructionString = "Error: Invalid Currency Construction."

export type regexCurrencyInvalidConstruction = "Error: Invalid Currency Construction."

export const moneyToCurrencyCharge = (moneyCharge: Money): Currency => {
  return {
    amount: moneyCharge.format(),
    currency: moneyCharge.currency as CurrencyType,
  };
};


export const moneyFromString = (currencyCharge: CurrencyCharge | string): Money | [InvalidMoneyMessage] => {
  const matchCurrency = currencyStringMatch(currencyCharge);
  if (matchCurrency) {
    return new Money(matchCurrency[2], matchCurrency[1]);
  }
  return ['Error: Conversion to BigInt Money Failure.'];
};

// at currencyRegex we look for form "USD 30.05" OR "USD 30"
// Meaning looking for Currency, spaces, (digits OR digits followd by a dot and more digits)
const currencyRegex = () =>
  /^(NIS|USD|EUR)?\s*([1-9]\d*|(([1-9]\d*)\.\d+))?$/;

export const currencyStringMatch = (currencyCharge: string | CurrencyCharge) =>
  typeof currencyCharge === 'string' ?
    currencyCharge.match(currencyRegex()) :
    currencyCharge.amount.match(currencyRegex());

export const currencyFromString = (currencyCharge: CurrencyCharge | string): Currency | InvalidCurrencyMessage => {
  const matchCurrency = currencyStringMatch(currencyCharge);

  if (matchCurrency) {
    return { currency: matchCurrency[1] as CurrencyType, amount: matchCurrency[2] };
  }
  return regexCurrencyInvalidConstructionString;
};


export const addCharges = (chargeA: CurrencyCharge, chargeB: CurrencyCharge, mandatory: Mandatory): CurrencyCharge | [InvalidMoneyMessage, InvalidMoneyAdditionMessage] => {
  const validChargeA = moneyFromString(chargeA);
  const validChargeB = moneyFromString(chargeB);

  if (validChargeA instanceof Money && validChargeB instanceof Money) {
    const currency = moneyToCurrencyCharge(
      isZeroCharge(chargeA) ?
        validChargeB :
        isZeroCharge(chargeB) ?
          validChargeB :
          validChargeA.add(validChargeB),
    );
    return {
      mandatory: mandatory,
      ...currency,
    };
  } else return ['Error: Conversion to BigInt Money Failure.', 'Error: Add Currency Charges Failure.'];
};


export const isZeroCharge = (charge: CurrencyCharge) =>
  charge.amount === '0';


export const compareCharges = (chargeA: CurrencyCharge, chargeB: CurrencyCharge) =>
  currencyChargeObject(chargeA).compare(currencyChargeObject(chargeB));


export const zeroCharge = <C extends CurrencyType, M extends Mandatory>(currency: C, mandatory: M): ApplyingCurrencyCharge<C, M> => {
  return {
    amount: '0',
    currency: currency,
    mandatory: mandatory,
  };
};


export const getPercentageCharge = (charge: CurrencyCharge, percentage: string): CurrencyCharge => {
  return {
    ...moneyToCurrencyCharge(currencyChargeObject(charge).multiply(percentage).divide('100')),
    mandatory: charge.mandatory,
  };
};

export const reduceApplyingChargesArrayToTotal = (
  applyingCharges: ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType, CurrencyType, Mandatory,QuoteParam>[] | string
): TotalChargeSet | undefined => {

  if (typeof applyingCharges !== 'string') {

    const mandatory = filterMandatory(applyingCharges);
    const nonMandatory = filterNonMandatory(applyingCharges);

    const totalMandatory: TotalCharge<'Y'> = new TotalCharge<'Y'>(
      'Y',
      {
        totalChargesInNis: filterNisMandatoryTotal(mandatory),
        totalChargesInUsd: filterUsdMandatoryTotal(mandatory),
        totalChargesInEur: filterEurMandatoryTotal(mandatory),
      });

    const totalNonMandatory: TotalCharge<'N'> = new TotalCharge<'N'>(
      'N',
      {
        totalChargesInNis: filterNisNonMandatoryTotal(nonMandatory),
        totalChargesInUsd: filterUsdNonMandatoryTotal(nonMandatory),
        totalChargesInEur: filterEurNonMandatoryTotal(nonMandatory),
      },
    );

    return { mandatory: totalMandatory, nonMandatory: totalNonMandatory } as TotalChargeSet;
  }
  return undefined;
};

// Function recives mixedChargeArr, and returns all that are Mandatory
const filterMandatory = (
  mixedChargeArr: ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType, CurrencyType, Mandatory,QuoteParam>[]
): ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType, CurrencyType, 'Y', QuoteParam>[] => {
  return (mixedChargeArr.filter(charge => charge.getMandatory() === 'Y') as unknown
  ) as ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType, CurrencyType, 'Y',QuoteParam>[];
};

// Function recives mixedChargeArr, and returns all that are non-Mandatory
const filterNonMandatory = (
  mixedChargeArr: ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType, CurrencyType, Mandatory,QuoteParam>[]
): ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType, CurrencyType, 'N', QuoteParam>[] => {
  return (mixedChargeArr.filter(charge => charge.getMandatory() === 'N') as unknown
  ) as ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType, CurrencyType, 'N',QuoteParam>[];
};


const filterNisMandatoryTotal = (mixedChargeArr: ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType, CurrencyType, 'Y',QuoteParam>[]
): ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType, 'NIS', 'Y', QuoteParam> [] => {
  return (mixedChargeArr.filter(charge => charge.getCurrency() === 'NIS' && charge.getMandatory() === 'Y') as unknown
  ) as ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType, 'NIS', 'Y',QuoteParam>[];
};

const filterNisNonMandatoryTotal = (mixedChargeArr: ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType, CurrencyType, 'N',QuoteParam>[]
): ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType, 'NIS', 'N', QuoteParam> [] => {
  return (mixedChargeArr.filter(charge => charge.getCurrency() === 'NIS' && charge.getMandatory() === 'N') as unknown
  ) as ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType, 'NIS', 'N',QuoteParam> [];
};

/** USD type narrowing */

const filterUsdMandatoryTotal = (mixedChargeArr: ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType, CurrencyType, 'Y',QuoteParam>[]
): ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType, 'USD', 'Y', QuoteParam>[] => {
  return (mixedChargeArr.filter(charge => charge.getCurrency() === 'USD' && charge.getMandatory() === 'Y') as unknown
  ) as ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType, 'USD', 'Y',QuoteParam>[];
};

const filterUsdNonMandatoryTotal = (mixedChargeArr: ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType, CurrencyType, 'N',QuoteParam>[]
): ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType, 'USD', 'N', QuoteParam>[] => {
  return (mixedChargeArr.filter(charge => charge.getCurrency() === 'USD' && charge.getMandatory() === 'N') as unknown
  ) as ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType, 'USD', 'N',QuoteParam>[];
};

const filterEurMandatoryTotal = (mixedChargeArr: ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType, CurrencyType, 'Y',QuoteParam>[]
): ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType, 'EUR', 'Y', QuoteParam> [] => {
  return (mixedChargeArr.filter(charge => charge.getCurrency() === 'EUR' && charge.getMandatory() === 'Y') as unknown
  ) as ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType, 'EUR', 'Y',QuoteParam> [];
};

const filterEurNonMandatoryTotal = (mixedChargeArr: ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType, CurrencyType, 'N',QuoteParam>[]
): ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType, 'EUR', 'N', QuoteParam>  [] => {
  return (mixedChargeArr.filter(charge => charge.getCurrency() === 'EUR' && charge.getMandatory() === 'N') as unknown
  ) as ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType, 'EUR', 'N',QuoteParam> [];
};


export function totalApplyingInitialCharge<C extends CurrencyType, M extends Mandatory>(currency: C, mandatory: M
): ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType, C, M, QuoteParam>[] {
  return [new ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType, C, M, QuoteParam>('ZeroCharge', zeroCharge<C, M>(currency, mandatory))];
}

export const getZeroValueTotalObject = <M extends Mandatory>(mandatory: M): TotalCharge<M> => {
  return new TotalCharge<M>(
    mandatory,
    {
      totalChargesInNis: totalApplyingInitialCharge<'NIS', M>('NIS', mandatory),
      totalChargesInUsd: totalApplyingInitialCharge<'USD', M>('USD', mandatory),
      totalChargesInEur: totalApplyingInitialCharge<'EUR', M>('EUR', mandatory),
    },
  );
};
