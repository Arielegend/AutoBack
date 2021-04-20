import { ContainerDetails } from '../RFQ/requestTypes';
import {
  ApplyingCurrencyCharge,
  ChargeMap,
  ChargeMapIterableType,
  ChargeMapName,
  ContainerTypeRequest,
  CurrencyCharge,
  CurrencyType,
  FixCharge,
  GridElement,
  HeavyWeightChargeMapType,
  HeavyWeightCharges,
  InvalidChargeSetMessage,
  Mandatory,
  ShipmentDetails,
  Weight,
  WeightUnit,
} from '../Rates/rateTypes';
import { weightBge } from '../Rates/rateUtils';
import { ApplyingCharge } from '../ApplyingCharges/ApplyingCharge';
import { currencyFromString } from '../ApplyingCharges/chargeUtils';
import { ApplyingQuoteCharge } from '../ApplyingCharges/chargeTypes';
import { Container } from '../CargoUnit/Container';

/**
 * System subtypes.
 * */

export class HeavyWeightChargesMap implements ChargeMap<'HeavyWeightCharges', Weight<'ton'>, FixCharge, HeavyWeightChargeMapType, ContainerTypeRequest> {
  chargeMapName: ChargeMapName<HeavyWeightChargeMapType> = 'HeavyWeightCharges';
  chargeMap: ChargeMapIterableType<Weight<'ton'>, FixCharge> | InvalidChargeSetMessage<HeavyWeightChargeMapType>;

  constructor(chargeTable: Pick<GridElement, keyof GridElement>[][] | string) {
    this.chargeMap = typeof chargeTable === 'string' ?
      this.fromString(chargeTable) :
      this.getChargeMap(chargeTable);
  }

  getChargeMap(
    freightTransportRateObject: Pick<GridElement, keyof GridElement>[][],
  ): ChargeMapIterableType<Weight<'ton'>, FixCharge> | InvalidChargeSetMessage<HeavyWeightChargeMapType> {

    const chargeMapEntries: ([false, false] | [Weight<'ton'>, { charge: CurrencyCharge }])[] =
      freightTransportRateObject
        .map(
          (heavyWeightCharge: Pick<GridElement, keyof GridElement>[]) => {

            const weight = heavyWeightCharge[1];
            const tableInputCharge = heavyWeightCharge[2];
            const charge = currencyFromString(tableInputCharge.value as string);

            if (typeof charge === 'string') return [false, false];
            if (charge.currency !== tableInputCharge.currencyType) return [false, false];

            const weightValue = (weight.value as string).replace(/ ton/, '');

            return [
              { value: weightValue, unit: 'ton' as WeightUnit },
              {
                charge: {
                  amount: charge.amount as string,
                  currency: charge.currency as CurrencyType,
                  mandatory: 'Y' as Mandatory,
                },
              },
            ];
          },
        );

    if (chargeMapEntries.every(([weight, charge]) => weight && charge)) {

      const heavyWeightChargeMap = new Map(
        chargeMapEntries as [Weight<'ton'>, { charge: CurrencyCharge }][],
      );

      if (heavyWeightChargeMap !== undefined) {
        return heavyWeightChargeMap;
      }
    }
    return this.invalidChargeSetMessage();
  }

  fromString(serializedChargeMap: string): ChargeMapIterableType<Weight<'ton'>, FixCharge> | InvalidChargeSetMessage<HeavyWeightChargeMapType> {
    try {
      const chargeObject = JSON.parse(serializedChargeMap);

      const undefinedAsTableOrMap = chargeObject as Pick<GridElement, keyof GridElement>[][] === undefined ||
        new Map(chargeObject) as HeavyWeightCharges === undefined;

      if (undefinedAsTableOrMap) return this.invalidChargeSetMessage();

      return typeof chargeObject[0][0].unit === 'string' ?
        new Map(chargeObject) as HeavyWeightCharges :
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

  invalidChargeSetMessage(): InvalidChargeSetMessage<HeavyWeightChargeMapType> {
    return 'Invalid Heavy Weight ChargeSet.';
  }

  calcMe(containers: ShipmentDetails<'LocalContainerCharges', ContainerTypeRequest>):
    ApplyingCharge<'HeavyWeightCharges', Weight<'ton'>, FixCharge, HeavyWeightChargeMapType, CurrencyType, Mandatory, ContainerTypeRequest>[] |
    InvalidChargeSetMessage<HeavyWeightChargeMapType> {

    const chargeMap = this.chargeMap;

    if (typeof chargeMap !== 'string') {
      return containers.requestDetails
        // for each container we iterate for the chargemap set, exctracting its charge value...
        .map(
          container =>
            this.getChargeForContainer(container, chargeMap),
        )
        .map(
          (charge) => {
            const containerChargesToApply: ApplyingCharge<'HeavyWeightCharges', Weight<'ton'>, FixCharge, HeavyWeightChargeMapType, CurrencyType, Mandatory, ContainerTypeRequest>[] = [];
            const applyingHeavyContainerCharge =
              new ApplyingCharge<'HeavyWeightCharges', Weight<'ton'>, FixCharge, HeavyWeightChargeMapType, CurrencyType, Mandatory, ContainerTypeRequest>(
                'HeavyWeightCharges',
                charge.applyingCharge,
                charge.containerCharge,
                {
                  name: 'Containers',
                  requestDetails: [charge.container],
                  chargeParamObj: [new Container(charge.container.containerType, charge.container.weight, charge.container.count)],
                },
              );
            applyingHeavyContainerCharge.scaleCharge(charge.container.count);
            containerChargesToApply.push(
              applyingHeavyContainerCharge,
            );
            return containerChargesToApply;
          },
        ).flat();
    }
    return this.invalidChargeSetMessage();
  }

  getChargeForContainer(container: ContainerDetails, chargeMap: ChargeMapIterableType<Weight<'ton'>, FixCharge>): {
    applyingCharge: ApplyingCurrencyCharge<CurrencyType, 'Y'>
    containerCharge: ApplyingQuoteCharge<HeavyWeightChargeMapType>
    container: ContainerDetails,
  } {

    const chargesIterator = chargeMap.entries();
    let nextCharge = chargesIterator.next();
    let applyingCharge = nextCharge.value[1];
    let rateCharge = nextCharge.value;
    while (!nextCharge.done && weightBge<'ton'>(container.weight, nextCharge.value[0])) {
      applyingCharge = nextCharge.value[1];
      rateCharge = nextCharge.value;
      nextCharge = chargesIterator.next();
    }

    return {
      applyingCharge: {
        currency: applyingCharge.charge.currency,
        amount: applyingCharge.charge.amount,
        mandatory: 'Y',
      },
      containerCharge: rateCharge,
      container: container,
    };
  }

}


