import { ContainerDetails } from '../../../RFQ/requestTypes';
import {
  ChargeMap,
  ChargeMapIterableType,
  ChargeMapName,
  ContainerType,
  ContainerCharge,
  CurrencyCharge,
  CurrencyType,
  FclChargeMapType,
  GridElement,
  InvalidChargeSetMessage,
  Mandatory, ShipmentDetails, ContainerTypeRequest,
} from '../../../Rates/rateTypes';
import { ApplyingCharge } from '../../../ApplyingCharges/ApplyingCharge';
import { currencyFromString } from '../../../ApplyingCharges/chargeUtils';
import { Container } from '../../../CargoUnit/Container';


export class FreightFclBaseChargeMap implements ChargeMap<'FclCharge', ContainerType, ContainerCharge, FclChargeMapType, ContainerTypeRequest> {
  chargeMapName: ChargeMapName<FclChargeMapType> = 'FclCharge';
  chargeMap: ChargeMapIterableType<ContainerType, ContainerCharge> | InvalidChargeSetMessage<FclChargeMapType>;

  constructor(baseRate: Pick<GridElement, keyof GridElement>[][] | string) {

    this.chargeMap = typeof baseRate === 'string' ?
      this.fromString(baseRate) :
      this.getChargeMap(baseRate);
  }


  getChargeMap(chargeTable: Pick<GridElement, keyof GridElement>[][]):
    ChargeMapIterableType<ContainerType, ContainerCharge> | InvalidChargeSetMessage<FclChargeMapType> {

    const freightLclChargeMapEntries: ([false, false] | [ContainerType, { charge: CurrencyCharge }])[] = chargeTable[0]
      .slice(5)
      .map(
        (containerCharge: Pick<GridElement, keyof GridElement>) => {
          const deserializedCurrencyCharge = currencyFromString(containerCharge.value as string);

          if (typeof deserializedCurrencyCharge === 'string') return [false, false];
          if (deserializedCurrencyCharge.currency !== containerCharge.currencyType) return [false, false];

          return [
            containerCharge.field as ContainerType,
            {
              charge: {
                amount: deserializedCurrencyCharge.amount as string,
                currency: deserializedCurrencyCharge.currency as CurrencyType,
                mandatory: 'Y' as Mandatory,
              } as CurrencyCharge,
              container: containerCharge.field as ContainerType,
            },
          ];
        },
      );

    if (freightLclChargeMapEntries.every(([container, charge]) => {
      return container && charge;
    })) {

      const freightLclChargeMapEntries1 = freightLclChargeMapEntries as unknown as [ContainerType, ContainerCharge][];
      const validFreightFclMainCharge: Map<ContainerType, ContainerCharge> = new Map(freightLclChargeMapEntries1);

      if (validFreightFclMainCharge !== undefined || validFreightFclMainCharge as Map<undefined, any> !== undefined) {
        return validFreightFclMainCharge;
      }
    }
    return this.invalidChargeSetMessage();
  }

  invalidChargeSetMessage(): InvalidChargeSetMessage<FclChargeMapType> {
    return 'Invalid FCL ChargeSet.';
  }

  fromString(serializedChargeTable: string): ChargeMapIterableType<ContainerType, ContainerCharge> | InvalidChargeSetMessage<FclChargeMapType> {
    try {
      const chargeObject = JSON.parse(serializedChargeTable);

      if (chargeObject as Pick<GridElement, keyof GridElement>[][] === undefined ||
        new Map(chargeObject) as ChargeMapIterableType<ContainerType, ContainerCharge> === undefined) {
        return this.invalidChargeSetMessage();
      }
      return typeof chargeObject[0][0] === 'object' ?
        this.getChargeMap(chargeObject) :
        new Map(chargeObject) as ChargeMapIterableType<ContainerType, ContainerCharge>;

    } catch (e) {
      return this.invalidChargeSetMessage();
    }
  }

  toString(): string {
    return typeof this.chargeMap === 'string' ?
      this.invalidChargeSetMessage() :
      JSON.stringify(Array.from(this.chargeMap.entries()));
  };

  calcMe(shipmentDetails: ShipmentDetails<'FclCharge', ContainerTypeRequest>):
    ApplyingCharge<'FclCharge', ContainerType, ContainerCharge, FclChargeMapType, CurrencyType, Mandatory,ContainerTypeRequest>[] | InvalidChargeSetMessage<FclChargeMapType> {
    const applicableCharges: (ApplyingCharge<'FclCharge', ContainerType, ContainerCharge, FclChargeMapType, CurrencyType, Mandatory,ContainerTypeRequest> | false)[] = [];

    //we enter this if and calc only if all types are covered
    const chargeMap = this.chargeMap;
    if (this.rateCoversRequestedContainers(shipmentDetails.requestDetails) && chargeMap !== this.invalidChargeSetMessage()) {

      shipmentDetails.requestDetails.forEach(
        (container: ContainerDetails) => {
          const currentContainerCharge = chargeMap.get(container.containerType);

          if (currentContainerCharge !== undefined) {
            const containerCharge = new ApplyingCharge<'FclCharge', ContainerType, ContainerCharge, FclChargeMapType, CurrencyType, Mandatory,ContainerTypeRequest>(
              'FclCharge',
              currentContainerCharge.charge,
              [container.containerType, currentContainerCharge],
              {name: 'Containers', requestDetails: [container], chargeParamObj: [new Container(container.containerType, container.weight, container.count)]}
            );

            containerCharge.scaleCharge(container.count);

            applicableCharges.push(
              containerCharge.getCharge() === undefined ?
                false :
                containerCharge,
            );
          }
          return false;

        },
      );

      if (applicableCharges.every(charge => charge !== false)) this.invalidChargeSetMessage();

      return applicableCharges as ApplyingCharge<'FclCharge', ContainerType, ContainerCharge, FclChargeMapType, CurrencyType, Mandatory, ContainerTypeRequest>[];


    } else return this.invalidChargeSetMessage();
  }


  //in this function we make sure this rateLine actually has a valid rate for all the needed containers types
  rateCoversRequestedContainers(containers: ContainerDetails[]) {
    const chargeMap = this.chargeMap;
    if (chargeMap !== this.invalidChargeSetMessage()) {
      return containers
        .map(containerDetails => containerDetails.containerType)
        .every(container => chargeMap.get(container) !== undefined);
    }
    return false;
  }


}