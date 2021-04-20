import { TotalCharge } from './TotalCharge';
import { ApplyingCharge } from './ApplyingCharge';
import {
  ApplyingCurrencyCharge,
  CurrencyRateChargeType,
  CurrencyType,
  Mandatory,
  QuoteParam,
  RateChargeAlias,
  RateChargeKey,
  RateChargeMapType,
} from '../Rates/rateTypes';
import { TotalChargeSet } from './chargeTypes';
import { reduceApplyingChargesArrayToTotal } from './chargeUtils';
import { breakLine } from '../Rates/rateUtils';

export interface TotalCost<M extends Mandatory> {
  totalChargesInNis: { sumTotal: ApplyingCurrencyCharge<'NIS', M>, charges: ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType, 'NIS', M, QuoteParam>[] };
  totalChargesInUsd: { sumTotal: ApplyingCurrencyCharge<'USD', M>, charges: ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType, 'USD', M, QuoteParam>[] };
  totalChargesInEur: { sumTotal: ApplyingCurrencyCharge<'EUR', M>, charges: ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType, 'EUR', M, QuoteParam>[] };
}

export type TotalChargeCost = { mandatory: TotalCost<'Y'>; nonMandatory: TotalCost<'N'> };
export type TotalChargeSetCost = { originCost?: TotalChargeCost; freightTransportCost?: TotalChargeCost, localCost: TotalChargeCost };


export class ApplyingChargeSet {
  private origin?: TotalChargeSet;
  private freightTransport?: TotalChargeSet;
  private local: TotalChargeSet | 'Invalid Local Charges';

  constructor(
    localRateCharges: ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType, CurrencyType, Mandatory, QuoteParam>[],
    freightTransportCharges?: ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType, CurrencyType, Mandatory, QuoteParam>[],
    originCharges?: ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType, CurrencyType, Mandatory, QuoteParam>[],
  ) {
    const local = this.getTotalChargePerArray(localRateCharges);

    this.local = local === undefined ? 'Invalid Local Charges' : local;
    if (local !== undefined) {
      if (freightTransportCharges !== undefined) {
        this.freightTransport = this.getTotalChargePerArray(freightTransportCharges);
      }
      if (originCharges !== undefined) {
        this.origin = this.getTotalChargePerArray(originCharges);
      }
    }
  }

  public getTotalCharge(): TotalChargeSetCost | undefined {
    let originCost, freightTransportCost, localCost;

    if (typeof this.local !== 'string') {
      const localMandatory = this.calculateCostPerPart(this.local.mandatory);
      const localNonMandatory = this.calculateCostPerPart(this.local.nonMandatory);
       if (localMandatory === undefined || localNonMandatory === undefined) return undefined;

      localCost = {
        mandatory: localMandatory,
        nonMandatory: localNonMandatory,
      };

      if (this.freightTransport !== undefined) {

        const freightTransportMandatory = this.calculateCostPerPart(this.freightTransport.mandatory);
        const freightTransportNonMandatory = this.calculateCostPerPart(this.freightTransport.nonMandatory);

        if (freightTransportMandatory === undefined || freightTransportNonMandatory === undefined) return undefined;


        freightTransportCost = {
          mandatory: freightTransportMandatory,
          nonMandatory: freightTransportNonMandatory,
        };
      }
      if (this.origin !== undefined) {
        const originMandatory = this.calculateCostPerPart(this.origin.mandatory);
        const originNonMandatory = this.calculateCostPerPart(this.origin.nonMandatory);

        if (originMandatory === undefined || originNonMandatory === undefined) return undefined;


        originCost = {
          mandatory: originMandatory,
          nonMandatory: originNonMandatory,
        };
      }


      return {
        freightTransportCost: freightTransportCost,
        originCost: originCost,
        localCost: localCost,
      };
    }
  }

  calculateCostPerPart<M extends Mandatory>(part: TotalCharge<M>): TotalCost<M> | undefined {
    const totalCost = part.calculateTotalCharge();
    if (totalCost === undefined) return undefined;
    return totalCost as unknown as TotalCost<M>;
  }

  toString() {
    const totalCostPerPart = this.getTotalCharge();
    if (totalCostPerPart === undefined) return '';

    const { localCost, originCost, freightTransportCost } = totalCostPerPart;

    const local = { name: 'Local', charges: this.local, total: localCost };

    const origin =
      originCost === undefined ?
        undefined :
        { name: 'Origin', charges: this.origin, total: originCost };

    const freight =
      freightTransportCost === undefined ?
        undefined :
        { name: 'Freight Transport', charges: this.freightTransport, total: freightTransportCost };


    const filterUndefinedParts = [origin, freight, local].filter(part => part !== undefined) as { name: string, charges: TotalChargeSet, total: TotalChargeCost }[];

    return filterUndefinedParts
      .map(
        (part, index) => {
          const mandatory = part.charges.mandatory.toString();
          const nonMandatory = part.charges.nonMandatory.toString();
          const partBreakLine = index === filterUndefinedParts.length - 1 ? '' : breakLine(part.name.length) + breakLine(part.name.length);

          const mandatoryCharges = part.total.mandatory;

          const totalMandatoryCostNis = mandatoryCharges.totalChargesInNis === undefined ? '' : this.getApplyingCurrency(mandatoryCharges.totalChargesInNis.sumTotal);
          const totalMandatoryCostEur = mandatoryCharges.totalChargesInEur === undefined ? '' : this.getApplyingCurrency(mandatoryCharges.totalChargesInEur.sumTotal);
          const totalMandatoryCostUsd = mandatoryCharges.totalChargesInUsd === undefined ? '' : this.getApplyingCurrency(mandatoryCharges.totalChargesInUsd.sumTotal);


          const nonMandatoryCharges = part.total.nonMandatory;

          const totalNonMandatoryCostNis = nonMandatoryCharges.totalChargesInNis === undefined ? '' : this.getApplyingCurrency(nonMandatoryCharges.totalChargesInNis.sumTotal);
          const totalNonMandatoryCostEur = nonMandatoryCharges.totalChargesInEur === undefined ? '' : this.getApplyingCurrency(nonMandatoryCharges.totalChargesInEur.sumTotal);
          const totalNonMandatoryCostUsd = nonMandatoryCharges.totalChargesInUsd === undefined ? '' : this.getApplyingCurrency(nonMandatoryCharges.totalChargesInUsd.sumTotal);

          const mandatoryString = [totalMandatoryCostNis, totalMandatoryCostUsd, totalMandatoryCostEur].join(', ');
          const nonMandatoryString = [totalNonMandatoryCostNis, totalNonMandatoryCostEur, totalNonMandatoryCostUsd].join(', ');
          const totalCostBreakLine = breakLine(part.name.toUpperCase().length, '=');

          const totalCost = `\n${totalCostBreakLine}\nMandatory Total Cost: ${mandatoryString},\nNon Mandatory Total Cost: ${nonMandatoryString}.`;

          const mandatoryTitle = `Mandatory charges:`;

          const nonMandatoryTitle = `Non Mandatory charges:`;
          return `\n${part.name.toUpperCase()}:${totalCost}\n\n${mandatoryTitle}\n${breakLine(mandatoryTitle.length)}\n${mandatory}` +
            `\n\n${nonMandatoryTitle}\n${breakLine(nonMandatoryTitle.length)}\n${nonMandatory}\n`;

        },
      ).join('');
  }

  getApplyingCurrency = (charge: ApplyingCurrencyCharge<CurrencyType, Mandatory>) => `${charge.currency} ${charge.amount}`;

  private getTotalChargePerArray = (applyingCharges: ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType, CurrencyType, Mandatory, QuoteParam>[]):
    TotalChargeSet | undefined => reduceApplyingChargesArrayToTotal(applyingCharges);
}

