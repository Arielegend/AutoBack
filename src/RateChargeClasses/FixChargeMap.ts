import {
  ChargeMap, ChargeMapIterableType, ChargeMapName,
  ChargeName,
  CurrencyType, FixCharge, FixChargeMapType,
  FixCharges, FixTypeRequest,
  GridElement,
  InvalidChargeSetMessage,
  Mandatory, ShipmentDetails,
} from '../Rates/rateTypes';
import { ApplyingCharge } from '../ApplyingCharges/ApplyingCharge';
import { currencyFromString } from '../ApplyingCharges/chargeUtils';

/**
 * Charge Parameters to be multiplying with the unit charge.
 * TODO: write full explanation.
 * */

export class FixChargeMap implements ChargeMap<'FixCharges', ChargeName, FixCharge,FixChargeMapType, FixTypeRequest> {
  chargeMapName: ChargeMapName<FixChargeMapType> = 'FixCharges';
  chargeMap: ChargeMapIterableType<ChargeName, FixCharge> | InvalidChargeSetMessage<FixChargeMapType>;

  constructor(chargesTable: Pick<GridElement, keyof GridElement>[][] | string) {
    this.chargeMap = typeof chargesTable === 'string' ?
      this.fromString(chargesTable) :
      this.getChargeMap(chargesTable);
  }


  fromString(serializedChargeMap: string) {
    try {

      const chargeObject = JSON.parse(serializedChargeMap);

      const notATableOrAMap =
        chargeObject as Pick<GridElement, keyof GridElement>[][] === undefined ||
        new Map(chargeObject) === undefined;
      if (notATableOrAMap) return this.invalidChargeSetMessage();

      return typeof chargeObject[0][0] === 'string' ?
        new Map(chargeObject) as FixCharges :
        this.getChargeMap(chargeObject);

    } catch (e) {
      return this.invalidChargeSetMessage();
    }
  }

  toString(): string {
    return typeof this.chargeMap === 'string' ?
      this.invalidChargeSetMessage() :
      JSON.stringify(Array.from(this.chargeMap.entries()));
  };

  getChargeMap(chargeTable: Pick<GridElement, keyof GridElement>[][]): FixCharges | InvalidChargeSetMessage<FixChargeMapType> {

    const fixCharges = chargeTable
      .map(
        (fixCharge: Pick<GridElement, keyof GridElement>[]) => {
          const currencyString = currencyFromString(fixCharge[2].value as string);
          if (typeof currencyString !== 'string'){
            return [
              fixCharge[1].value as string,
              {
                charge: {
                  amount: currencyString.amount ,
                  currency: fixCharge[2].currencyType as CurrencyType,
                  mandatory: fixCharge[3].value as Mandatory,
                },
              },
            ];
          } else {
            return undefined;
          }
        },
      );
     if (fixCharges.every(charge => charge !== undefined)) {
      return new Map(
        fixCharges as [ChargeName, FixCharge][]
      );
    }
    return this.invalidChargeSetMessage();
  }

  invalidChargeSetMessage(): InvalidChargeSetMessage<FixChargeMapType> {
    return 'Invalid Fix ChargeSet.';
  }

  calcMe(): ApplyingCharge<'FixCharges', ChargeName, FixCharge,FixChargeMapType, CurrencyType, Mandatory,FixTypeRequest>[] | InvalidChargeSetMessage<FixChargeMapType> {
    const applicableCharges: ApplyingCharge<'FixCharges', ChargeName, FixCharge,FixChargeMapType, CurrencyType, Mandatory,FixTypeRequest>[] = [];

    if (this.chargeMap === this.invalidChargeSetMessage()) return this.invalidChargeSetMessage();
    const chargesIterator = this.chargeMap.entries();
    let nextCharge = chargesIterator.next();

    while (!nextCharge.done) {
      const [chargeName, chargeObj] = nextCharge.value;
      applicableCharges.push(
        new ApplyingCharge<'FixCharges', ChargeName, FixCharge,FixChargeMapType, CurrencyType, Mandatory,FixTypeRequest>(
          'FixCharges',chargeObj.charge, [chargeName, chargeObj]),
      );
      nextCharge = chargesIterator.next();
    }
    return applicableCharges.length === 0 ? this.invalidChargeSetMessage() : applicableCharges;
  }


}

