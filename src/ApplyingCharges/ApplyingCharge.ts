import {
  ApplyingCurrencyCharge,
  ChargeMapType,
  ContainerCharge,
  CurrencyRateChargeType,
  CurrencyType, FixCharge,
  Mandatory,
  QuoteParam,
  RateChargeAlias,
  RateChargeKey,
  RateChargeMapType,
  Weight,
  WeightRatioRule,
  WeightUnit,
} from '../Rates/rateTypes';
import { Money } from 'bigint-money';
import {
  compareCharges,
  currencyChargeObject,
  currencyFromString,
  regexCurrencyInvalidConstruction,
  regexCurrencyInvalidConstructionString,
} from './chargeUtils';
import { ApplyingCurrency, ApplyingQuoteCharge } from './chargeTypes';
import { weightToString } from '../Rates/rateUtils';
import { Box } from '../CargoUnit/Box';
import { Container } from '../CargoUnit/Container';


/** Class representing a single applyingCharge we apply in a rate, in any part, on any type.
 *
 * @ApplyingCharge<C extends CurrencyType, M extends Mandatory>{
 *   @applyingCharge: {
 *   @ amount: string # value in decimal point.
 *   @ currency: C # C is of CurrencyType = 'NIS' | 'USD' | 'EUR'.
 *   @ mandatory: M # M is 'Y'| 'N', depending on if the rate applyingCharge is mandatory or not.
 *  }
 * */
export class ApplyingCharge<RN extends RateChargeAlias,
  RK extends RateChargeKey,
  R extends CurrencyRateChargeType,
  RMT extends ChargeMapType<RN, RK, R> &
    RateChargeMapType,
  C extends CurrencyType,
  M extends Mandatory,
  QP extends QuoteParam> {

  private readonly chargeMapName?: RN;
  private applyingCharge?: ApplyingCurrencyCharge<C, M>;
  private readonly rateCharge?: ApplyingQuoteCharge<RMT>;
  private shipmentRequest?: QP;

  constructor(chargeMapName: RN, currencyCharge?: ApplyingCurrencyCharge<C, M>, rateCharge?: ApplyingQuoteCharge<RMT>, shipmentRequest?: QP) {
    this.chargeMapName = chargeMapName;
    this.applyingCharge = currencyCharge;
    this.rateCharge = rateCharge;
    this.shipmentRequest = shipmentRequest;
  };


  // Returns {currency, amount, mandatory} || undefined
  getCharge() {
    if (this.applyingCharge !== undefined) {
      return {
        currency: this.applyingCharge.currency as C,
        amount: this.applyingCharge.amount,
        mandatory: this.applyingCharge.mandatory as M,
      };
    }
    return undefined;
  }


  getCurrency() {
    if (this.applyingCharge !== undefined) {
      return this.applyingCharge.currency;
    }
  }

  getMandatory() {
    if (this.applyingCharge !== undefined) {
      return this.applyingCharge.mandatory;
    }
  }

// currency is of Form <NIS 30>
  currencyChargeFromStringValue(currency: string, mandatory: M): this {
    const chargeFromString = currencyFromString(currency);
    if (chargeFromString !== regexCurrencyInvalidConstructionString) {
      this.applyingCharge = { currency: chargeFromString.currency as C, amount: chargeFromString.amount, mandatory };
    }
    return this;
  }


  // tslint:disable-next-line: no-shadowed-variable
  private moneyToCurrencyChargeObject = <M extends CurrencyType = C>(moneyCharge: Money): ApplyingCurrency<M> => {
    return {
      amount: moneyCharge.format(),
      currency: moneyCharge.currency as M,
    };
  };

  scaleCharge(scalar: string) {
    if (this.applyingCharge !== undefined) {
      this.applyingCharge = {
        ...this.moneyToCurrencyChargeObject(currencyChargeObject(this.applyingCharge).multiply(scalar)),
        mandatory: this.applyingCharge.mandatory,
      };
    }
  }


  toMoney() {
    if (this.applyingCharge !== undefined) {
      return new Money(this.applyingCharge.amount, this.applyingCharge.currency as C);
    }
  }


  eq(otherCharge: ApplyingCharge<RN, RK, R, RMT, C, M, QP>) {
    if (this.applyingCharge !== undefined && otherCharge.applyingCharge !== undefined) {
      if (this.getCurrency() === otherCharge.getCurrency()) {
        return compareCharges(this.applyingCharge, otherCharge.applyingCharge) === 0;
      }
    }
  }

  gt(otherCharge: ApplyingCharge<RN, RK, R, RMT, C, M, QP>) {
    if (this.applyingCharge !== undefined && otherCharge.applyingCharge !== undefined) {
      if (this.getCurrency() === otherCharge.getCurrency()) {
        return compareCharges(this.applyingCharge, otherCharge.applyingCharge) === 1;
      }
    }
  }

  st(otherCharge: ApplyingCharge<RN, RK, R, RMT, C, M, QP>) {
    if (this.applyingCharge !== undefined && otherCharge.applyingCharge !== undefined) {
      if (this.getCurrency() === otherCharge.getCurrency()) {
        return compareCharges(this.applyingCharge, otherCharge.applyingCharge) === -1;
      }
    }
  }

  weightChargeParameter = (applyingRateCharge: WeightRatioRule, unit: WeightUnit) => `${applyingRateCharge.charge.currency} ${applyingRateCharge.charge.amount} / Physical/Volume Weight (Volume Weight = 1 m3 * ${applyingRateCharge.ratio} ${unit})`;

  private static getContainerChargeParameter = (applyingRateCharge: ContainerCharge) =>
    `${applyingRateCharge.charge.currency} ${applyingRateCharge.charge.amount} / ${(applyingRateCharge as ContainerCharge).container}`;


  boxesRequest = (boxes: Box[]): string => `\n\t${boxes.map(box => box.toString().split('\n').join('\n\t'))}`;
  
  containerRequest = (containers: Container[]): string => `\n\t${containers.map(container => container.toString().split('\n').join('\n\t'))}`;

  /**TODO Switch to Total Request*/
  totalRequest = (sumTotal: ApplyingCurrencyCharge<CurrencyType, Mandatory>): string => `${sumTotal.currency} ${sumTotal.amount}`;

  toString(): string {
    if (this.applyingCharge !== undefined && this.rateCharge !== undefined) {

      const mandatoryString = this.getMandatory() === 'Y' ? 'mandatory' : 'non-mandatory';
      const applyingCurrencyChargeString = `${this.applyingCharge.currency} ${this.applyingCharge.amount}`;

      const applyingRateKey = this.rateCharge[0];
      const applyingRateCharge = this.rateCharge[1];


      const shipmentRequestStr =
        this.shipmentRequest?.name === 'Boxes' ?
          this.boxesRequest(this.shipmentRequest?.chargeParamObj as Box[]) :
          this.shipmentRequest?.name === 'Containers' ?
            this.containerRequest(this.shipmentRequest?.chargeParamObj as Container[]) :
            this.shipmentRequest?.name === 'TotalChargeSet' ?
              this.totalRequest(this.shipmentRequest?.chargeParamObj as ApplyingCurrencyCharge<CurrencyType, Mandatory>) :
              '';

      const shipmentRequest = `\n\tCharge Input:${shipmentRequestStr}`;

      const { chargeName, chargeParameter }: { chargeName: string, chargeParameter: string } =
        this.chargeMapName === 'ThcCharge' ?
          {
            chargeName: 'Thc Charge',
            chargeParameter: ApplyingCharge.getContainerChargeParameter(applyingRateCharge as ContainerCharge),
          } :
          this.chargeMapName === 'LocalContainerCharges' ?
            {
              chargeName: 'Local Container Charge',
              chargeParameter: ApplyingCharge.getContainerChargeParameter(applyingRateCharge as ContainerCharge),
            } :
            this.chargeMapName === 'HeavyWeightCharges' ?
              {
                chargeName: 'Heavy Weight Charge',
                chargeParameter: `${(applyingRateCharge as FixCharge).charge.currency} ${(applyingRateCharge as FixCharge).charge.amount} for weight >= ${weightToString<'ton'>(applyingRateKey as Weight<'ton'>)}`,
              } :
              this.chargeMapName === 'WeightCharges' ?
                {
                  chargeName: 'Weight Charge',
                  chargeParameter: weightToString<'kg'>(applyingRateKey as Weight),
                } :
                this.chargeMapName === 'WeightRulesCharges' ?
                  {
                    chargeName: 'Weight Rules Charges',
                    chargeParameter: this.weightChargeParameter(applyingRateCharge as WeightRatioRule, 'kg'),
                  } :
                  this.chargeMapName === 'FixCharges' ?
                    {
                      chargeName: 'Fix Charge',
                      chargeParameter: 'Fixed Charge',
                    } :
                    this.chargeMapName === 'YataCharge' ?
                      {
                        chargeName: 'YATA Charge',
                        chargeParameter: `Total Air Freight`,
                      } :
                      this.chargeMapName === 'LclCharge' ?
                        {
                          chargeName: 'LCL Freight Charge',
                          chargeParameter: `${(applyingRateCharge as WeightRatioRule).charge.currency} ${(applyingRateCharge as WeightRatioRule).charge.amount} for weight >= ${this.weightChargeParameter(applyingRateCharge as WeightRatioRule, 'kg')}`,
                        } :
                        this.chargeMapName === 'AirChargeMap' ?
                          {
                            chargeName: 'AIR Freight Charge',
                            chargeParameter: this.weightChargeParameter(applyingRateCharge as WeightRatioRule, 'kg'),

                          } :
                          {
                            chargeName: 'FCL Freight Charge',
                            chargeParameter: ApplyingCharge.getContainerChargeParameter(applyingRateCharge as ContainerCharge),
                          };


      const perChargeParam = `per rate of ${chargeParameter}`;


      const finalApplyingChargeWithParamString = `\n${chargeName}: [${applyingCurrencyChargeString}, ${mandatoryString}], ${perChargeParam},${shipmentRequest}`;
      const finalApplyingChargeWithoutParamString = `\n${chargeName}: [${applyingCurrencyChargeString}, ${mandatoryString}].`;

      return shipmentRequestStr === '' ? finalApplyingChargeWithoutParamString : finalApplyingChargeWithParamString;
    }
    return '';
  }


}

