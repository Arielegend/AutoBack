import { ApplyingCharge } from './ApplyingCharge';
import {
  ApplyingCurrencyCharge,
  ChargeMapType,
  CurrencyRateChargeType,
  CurrencyType,
  Mandatory,
  PercentageCharge,
  QuoteParam,
  RateChargeAlias,
  RateChargeKey,
  RateChargeMapType,
  TotalChargeSetTypeRequest,
  YataChargeMapType,
} from '../Rates/rateTypes.js';
import { TotalChargeParams } from './chargeTypes';
import { moneyToCurrencyCharge, totalApplyingInitialCharge, zeroCharge } from './chargeUtils';
import { breakLine } from '../Rates/rateUtils';
import { Money } from 'bigint-money';
import { TotalCost } from './ApplyingChargeSet';

/*
! TotalCharge Stands for same Mandatory / nonMandatory 
! All elements must be Mandatory / nonMandatory
*/
export class TotalCharge<M extends Mandatory> {
  private totalChargesInNis: { sumTotal: ApplyingCurrencyCharge<'NIS', M>, charges: ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType, 'NIS', M, QuoteParam>[] };
  private totalChargesInUsd: { sumTotal: ApplyingCurrencyCharge<'USD', M>, charges: ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType, 'USD', M, QuoteParam>[] };
  private totalChargesInEur: { sumTotal: ApplyingCurrencyCharge<'EUR', M>, charges: ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType, 'EUR', M, QuoteParam>[] };

  private mandatory: M;

  constructor(mandatory: M, total: TotalChargeParams<M>) {
    this.mandatory = mandatory;
    this.totalChargesInNis = {
      sumTotal: zeroCharge<'NIS', M>('NIS', mandatory),
      charges: this.setZeroChargeIfEmpty<'NIS'>('NIS', total.totalChargesInNis),
    };
    this.totalChargesInUsd = {
      sumTotal: zeroCharge<'USD', M>('USD', mandatory),
      charges: this.setZeroChargeIfEmpty<'USD'>('USD', total.totalChargesInUsd),
    };
    this.totalChargesInEur = {
      sumTotal: zeroCharge<'EUR', M>('EUR', mandatory),
      charges: this.setZeroChargeIfEmpty<'EUR'>('EUR', total.totalChargesInEur),
    };
  }

  public getTotalCharge() {
    return {
      totalChargesInNis: this.totalChargesInNis,
      totalChargesInUsd: this.totalChargesInUsd,
      totalChargesInEur: this.totalChargesInEur,
    };
  }

  private setZeroChargeIfEmpty<C extends CurrencyType>(
    currency: C,
    applyingCharge: ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType, C, M, QuoteParam>[],
  ): ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType, C, M, QuoteParam>[] {

    return applyingCharge.length === 0 ? totalApplyingInitialCharge<C, M>(currency, this.getMandatory()) : applyingCharge;
  }



  calculatePercentCharge<PCN extends RateChargeAlias, PCM extends Mandatory>
  (percentageChargeName: PCN, mandatory: PCM, percentage: string, shipmentDetails: TotalChargeSetTypeRequest) {
    const totalCharge = this.calculateTotalCharge();

    const percentageOfNis = this.applyingCurrencyChargeToMoney(totalCharge.totalChargesInNis.sumTotal)
      .multiply(percentage).divide(100);

    const percentageOfEuro = this.applyingCurrencyChargeToMoney(totalCharge.totalChargesInEur.sumTotal)
      .multiply(percentage).divide(100);

    const percentageOfUsd = this.applyingCurrencyChargeToMoney(totalCharge.totalChargesInUsd.sumTotal)
      .multiply(percentage).divide(100);


    return {
      totalChargesInNis:
        new ApplyingCharge<PCN, 'percent', PercentageCharge, ChargeMapType<PCN, 'percent', PercentageCharge> & YataChargeMapType, 'NIS', PCM, TotalChargeSetTypeRequest>(
          percentageChargeName,
          { amount: percentageOfNis.format(), currency: 'NIS', mandatory: mandatory },
          ['percent', { percentage: percentage }],
          { ...shipmentDetails, chargeParamObj: { ...totalCharge.totalChargesInNis.sumTotal, mandatory: mandatory } },
        ),
      totalChargesInEur:
        new ApplyingCharge<PCN, 'percent', PercentageCharge, ChargeMapType<PCN, 'percent', PercentageCharge> & YataChargeMapType, 'EUR', PCM, TotalChargeSetTypeRequest>(
          percentageChargeName,
          { amount: percentageOfEuro.format(), currency: 'EUR', mandatory: mandatory },
          ['percent', { percentage: percentage }],
          { ...shipmentDetails, chargeParamObj: { ...totalCharge.totalChargesInEur.sumTotal, mandatory: mandatory } },
        ),
      totalChargesInUsd:
        new ApplyingCharge<PCN, 'percent', PercentageCharge, ChargeMapType<PCN, 'percent', PercentageCharge> & YataChargeMapType, 'USD', PCM, TotalChargeSetTypeRequest>(
          percentageChargeName,
          { amount: percentageOfUsd.format(), currency: 'USD', mandatory: mandatory },
          ['percent', { percentage: percentage }],
          { ...shipmentDetails, chargeParamObj: { ...totalCharge.totalChargesInUsd.sumTotal, mandatory: mandatory } },
        ),

    };

  }

  getTotalSum() {
    const totalSum = this.calculateTotalCharge();

    const totalAmountInNis = totalSum.totalChargesInNis;
    const totalAmountInEur = totalSum.totalChargesInEur;
    const totalAmountInUsd = totalSum.totalChargesInUsd;

    const breakLine1 = breakLine('Total Sum Charges:'.length)
    return `Total Sum Charges:\n${breakLine1}\n\tNIS: ${totalAmountInNis}\tUSD: ${totalAmountInUsd}\tEUR: ${totalAmountInEur}\n`;
  }


  calculateTotalCharge(): TotalCost<M> {

    return {
      totalChargesInNis: this.reduceChargeSum<'NIS', M>('NIS', this.mandatory, this.totalChargesInNis.charges),
      totalChargesInEur: this.reduceChargeSum<'EUR', M>('EUR', this.mandatory, this.totalChargesInEur.charges),
      totalChargesInUsd: this.reduceChargeSum<'USD', M>('USD', this.mandatory, this.totalChargesInUsd.charges),
    };
  }


  getMandatory(): M {
    return this.mandatory;
  }


  toString(): string {

    const nisCharges = { name: 'NIS', charges: this.totalChargesInNis.charges };
    const usdCharges = { name: 'USD', charges: this.totalChargesInUsd.charges };
    const eurCharges = { name: 'EUR', charges: this.totalChargesInEur.charges };


    const charges =
      [nisCharges, usdCharges, eurCharges].map(
        charge => {
          switch (charge.name as CurrencyType) {
            case 'NIS':
              return charge.charges.length === 0 ? '' : `Charges In NIS:\n\t${breakLine('Charges In NIS:'.length, '-')}${charge.charges.join('').split('\n').join('\n\t')}`;
            case 'USD':
              return charge.charges.length === 0 ? '' : `Charges In USD:\n\t${breakLine('Charges In USD:'.length, '-')}${charge.charges.join('').split('\n').join('\n\t')}`;
            case 'EUR':
              return charge.charges.length === 0 ? '' : `Charges In EUR:\n\t${breakLine('Charges In EUR:'.length, '-')}${charge.charges.join('').split('\n').join('\n\t')}`;
          }
        },
      );
    return `\n\t${charges.join('\n\t')}`;
  }

  applyingCurrencyChargeToMoney<C extends CurrencyType, M extends Mandatory>(charge: ApplyingCurrencyCharge<C, M>) {
    return new Money(charge.amount, charge.currency);
  }

  addCharges<C extends CurrencyType, M extends Mandatory>
  (sumTotal: ApplyingCurrencyCharge<C, M>, chargeB: ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, any, C, M, QuoteParam>):
    ApplyingCurrencyCharge<C, M> | undefined {
    const thisChargeSum = this.applyingCurrencyChargeToMoney(sumTotal);
    const otherChargeInCurrency = chargeB.toMoney();
    if (thisChargeSum !== undefined && otherChargeInCurrency !== undefined && sumTotal.currency === chargeB.getCurrency() ) {
      const money = thisChargeSum.add(otherChargeInCurrency);
      return { amount: money.format(), currency: sumTotal.currency, mandatory: sumTotal.mandatory };
    }
  }


  private reduceChargeSum<C extends CurrencyType, M extends Mandatory>
  (currency: C, mandatory: M, charges: ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType, C, M, QuoteParam>[]):
    { sumTotal: ApplyingCurrencyCharge<C, M>, charges: ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType, C, M, QuoteParam> [] } {
    return {
      sumTotal: {
        amount: this.getSumTotalForSpecificCurrency(charges),
        currency: currency,
        mandatory: mandatory,
      },
      charges: charges,
    };
  }

  private getSumTotalForSpecificCurrency<C extends CurrencyType, M extends Mandatory>(charges: ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType, C, M, QuoteParam>[]) {
    return moneyToCurrencyCharge(
      charges
        .map(
          charge =>
            this.applyingCurrencyChargeToMoney(
              charge.getCharge() as ApplyingCurrencyCharge<C, M>,
            ),
        )
        .reduce(
          (previousCurrencyCharge, thisCurrencyCharge) =>
            previousCurrencyCharge.add(thisCurrencyCharge),
        ),
    ).amount;
  }
}

