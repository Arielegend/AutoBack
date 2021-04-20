import {
  ChargeMap,
  ChargeMapIterableType,
  ChargeMapName,
  ChargeName,
  ContainerCharge,
  ContainerType,
  ContainerTypeRequest,
  CurrencyCharge,
  CurrencyType,
  GridElement,
  InvalidChargeSetMessage,
  LocalContainerChargeMapType,
  LocalContainerCharges,
  Mandatory,
  ShipmentDetails,
} from '../Rates/rateTypes';
import { ApplyingCharge } from '../ApplyingCharges/ApplyingCharge';
import { currencyFromString } from '../ApplyingCharges/chargeUtils';
import { Container } from '../CargoUnit/Container';

export class LocalContainerChargeMap implements ChargeMap<'LocalContainerCharges', ChargeName, ContainerCharge, LocalContainerChargeMapType, ContainerTypeRequest> {
  chargeMapName: ChargeMapName<LocalContainerChargeMapType> = 'LocalContainerCharges';
  chargeMap: ChargeMapIterableType<ChargeName, ContainerCharge> | InvalidChargeSetMessage<LocalContainerChargeMapType>;

  constructor(chargeTable: Pick<GridElement, keyof GridElement>[][] | string) {
    this.chargeMap = typeof chargeTable === 'string' ?
      this.fromString(chargeTable) :
      this.getChargeMap(chargeTable);
  }

  getChargeMap(chargeTable: Pick<GridElement, keyof GridElement>[][]): ChargeMapIterableType<ChargeName, ContainerCharge> | InvalidChargeSetMessage<LocalContainerChargeMapType> {

    const chargeMapEntries: (([false, false] | [ChargeName, ContainerCharge])[]) = chargeTable
      .map(
        (localContainerRates: Pick<GridElement, keyof GridElement>[]) => {

          const localContainerRuleName = localContainerRates[1].value as ChargeName;
          const charge = localContainerRates[2];
          const deserializedCharge = currencyFromString(charge.value as string);


          if (typeof deserializedCharge === 'string') return [false, false];
          if (deserializedCharge.currency !== charge.currencyType) return [false, false];

          const mandatory = localContainerRates[3].value as Mandatory;
          const containerType: ContainerType = localContainerRates[4].value as ContainerType;

          return [
            localContainerRuleName,
            {
              charge: {
                amount: deserializedCharge.amount as string,
                currency: deserializedCharge.currency,
                mandatory: mandatory as Mandatory,
              } as CurrencyCharge,
              container: containerType as ContainerType,
            },
          ];
        },
      );


    if (chargeMapEntries.every(([chargeName, containerCharge]) => chargeName && containerCharge)) {

      const localContainerChargeMap = new Map(
        chargeMapEntries as [ChargeName, ContainerCharge][],
      );

      if (localContainerChargeMap !== undefined) {
        return localContainerChargeMap;
      }
    }
    return this.invalidChargeSetMessage();
  }

  fromString(serializedChargeTable: string): ChargeMapIterableType<ChargeName, ContainerCharge> | InvalidChargeSetMessage<LocalContainerChargeMapType> {
    try {
      const chargeObject = JSON.parse(serializedChargeTable);

      if (chargeObject as Pick<GridElement, keyof GridElement>[][] === undefined ||
        new Map(chargeObject) as LocalContainerCharges === undefined) {
        return this.invalidChargeSetMessage();
      }
      return typeof chargeObject[0][0] === 'object' ?
        this.getChargeMap(chargeObject) :
        new Map(chargeObject) as LocalContainerCharges;

    } catch (e) {
      return this.invalidChargeSetMessage();
    }
  }

  toString(): string {
    return typeof this.chargeMap === 'string' ?
      this.invalidChargeSetMessage() :
      JSON.stringify(Array.from(this.chargeMap.entries()));
  };

  invalidChargeSetMessage(): InvalidChargeSetMessage<LocalContainerChargeMapType> {
    return 'Invalid Locals By Container ChargeSet.';
  }

  calcMe(shipmentDetails: ShipmentDetails<'LocalContainerCharges', ContainerTypeRequest>):
    ApplyingCharge<'LocalContainerCharges', ChargeName, ContainerCharge, LocalContainerChargeMapType, CurrencyType, Mandatory, ContainerTypeRequest>[] |
    InvalidChargeSetMessage<LocalContainerChargeMapType> {

    const applicableCharges: ApplyingCharge<'LocalContainerCharges', ChargeName, ContainerCharge, LocalContainerChargeMapType, CurrencyType, Mandatory, ContainerTypeRequest>[] = [];

    const fixChargeMap = this.chargeMap;
    if (fixChargeMap === 'Invalid Locals By Container ChargeSet.') return this.invalidChargeSetMessage();

    const fixChargeIterator = fixChargeMap.entries();
    let currentCharge = fixChargeIterator.next();

    while (!currentCharge.done) {
      const [containerChargeName, containerCharge] = currentCharge.value;

      if (containerCharge !== undefined) {
        const containerDetailsIter = shipmentDetails.requestDetails.entries();
        let currentContainerSet = containerDetailsIter.next();

        while (!currentContainerSet.done) {
          const [name, container] = currentContainerSet.value;

          if (containerCharge.container === container.containerType) {

            const rateCharge: [string, ContainerCharge] = [containerChargeName, containerCharge];
            const applyingLocalContainerCharge = new ApplyingCharge<'LocalContainerCharges', ChargeName, ContainerCharge, LocalContainerChargeMapType, CurrencyType, Mandatory, ContainerTypeRequest>(
              'LocalContainerCharges',
              {
                currency: containerCharge.charge.currency,
                amount: containerCharge.charge.amount,
                mandatory: 'Y',
              },
              rateCharge,
              {
                name: 'Containers',
                requestDetails: [container],
                chargeParamObj: [new Container(container.containerType, container.weight, container.count)],
              },
            );

            applyingLocalContainerCharge.scaleCharge(container.count);
            applicableCharges.push(applyingLocalContainerCharge);
          }
          currentContainerSet = containerDetailsIter.next();
        }
      }

      currentCharge = fixChargeIterator.next();
    }
    return applicableCharges;
  }
}

