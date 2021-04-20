import {
  ChargeMap,
  ChargeMapIterableType, ChargeMapName,
  ContainerType,
  ContainerCharge,
  CurrencyType,
  GridElement,
  InvalidChargeSetMessage,
  Mandatory,
  ThcCharge,
  ThcChargeMapType,
  WeightCharges, YataChargeMapType, ShipmentDetails, ContainerTypeRequest,
} from '../Rates/rateTypes';
import { ContainerDetails } from '../RFQ/requestTypes';
import { ApplyingCharge } from '../ApplyingCharges/ApplyingCharge';
import { currencyFromString } from '../ApplyingCharges/chargeUtils';
import { Container } from '../CargoUnit/Container';


export class ThcChargeMap implements ChargeMap<'ThcCharge',
  ContainerType,
  ContainerCharge,
  ThcChargeMapType,
  ContainerTypeRequest> {

  chargeMapName:ChargeMapName<ThcChargeMapType>= 'ThcCharge';
  chargeMap: ChargeMapIterableType<ContainerType, ContainerCharge> | InvalidChargeSetMessage<ThcChargeMapType>;


  constructor(chargeTable: GridElement[][] | string) {
    this.chargeMap = typeof chargeTable === 'string' ?
      this.fromString(chargeTable) :
      this.getChargeMap(chargeTable);
  }

  fromString(serializedChargeMap: string): ChargeMapIterableType<ContainerType, ContainerCharge> | InvalidChargeSetMessage<ThcChargeMapType> {
    try {
      const chargeObject = JSON.parse(serializedChargeMap);
      const undefinedAsTableOrMap = chargeObject as Pick<GridElement, keyof GridElement>[][] === undefined ||
        new Map(chargeObject) as WeightCharges === undefined;

      if (undefinedAsTableOrMap) return this.invalidChargeSetMessage();

      return chargeObject[0][0].field === 'DV20' ?
        this.getChargeMap(chargeObject) :
        new Map(chargeObject);

    } catch (e) {
      return this.invalidChargeSetMessage();
    }
  }

  getChargeMap(chargeTable: Pick<GridElement, keyof GridElement>[][]): ChargeMapIterableType<ContainerType, ContainerCharge> | InvalidChargeSetMessage<ThcChargeMapType> {
    const thc20FormInputValue = chargeTable[0][0].value;
    const thc20Charge = currencyFromString(thc20FormInputValue as string);

    const thc40FormInputValue = chargeTable[1][0].value;
    const thc40Charge = currencyFromString(thc40FormInputValue as string);

    if (typeof thc20Charge !== 'string' && typeof thc40Charge !== 'string') {
      return new Map(
        [
          ['DV20', { charge: { ...thc20Charge, mandatory: 'Y' }, container: 'DV20' }],
          ['DV40', { charge: { ...thc40Charge, mandatory: 'Y' }, container: 'DV40' }],
        ],
      );
    }
    return this.invalidChargeSetMessage();

  }

  invalidChargeSetMessage(): InvalidChargeSetMessage<ThcChargeMapType> {
    return 'Invalid THC Charge.';
  }

  toString(): string {
    return typeof this.chargeMap === 'string' ?
      this.invalidChargeSetMessage() :
      JSON.stringify(Array.from(this.chargeMap.entries()));
  };

  calcMe(containers: ShipmentDetails<'ThcCharge', ContainerTypeRequest>):
    ApplyingCharge<'ThcCharge', ContainerType, ContainerCharge, ThcChargeMapType, CurrencyType, Mandatory,ContainerTypeRequest>[] |
    InvalidChargeSetMessage<ThcChargeMapType> {

    const applicableCharges: ApplyingCharge<'ThcCharge', ContainerType, ContainerCharge, ThcChargeMapType, CurrencyType, Mandatory,ContainerTypeRequest>[] = [];

    const chargeMap = this.chargeMap;

    if (chargeMap === this.invalidChargeSetMessage()) return this.invalidChargeSetMessage();

    const thc20ChargeLine = Array.from(chargeMap.entries()).find(charge => charge[0] === 'DV20');
    const thc40ChargeLine = Array.from(chargeMap.entries()).find(charge => charge[0] === 'DV40');
    if (thc20ChargeLine === undefined || thc40ChargeLine === undefined) return this.invalidChargeSetMessage();
    else {


      containers.requestDetails.forEach(
        (container: ContainerDetails) => {
          switch (container.containerType) {
            case 'DV20':
              const thc20ApplyingCharge =
                new ApplyingCharge<'ThcCharge', ContainerType, ContainerCharge, ThcChargeMapType, CurrencyType, Mandatory,ContainerTypeRequest>(
                  'ThcCharge',
                  thc20ChargeLine[1].charge,
                  thc20ChargeLine,
                  { name: 'Containers', requestDetails: [container], chargeParamObj: [new Container(container.containerType, container.weight, container.count)] }
                );
              thc20ApplyingCharge.scaleCharge(container.count);
              applicableCharges.push(thc20ApplyingCharge);
              break;

            case 'DV40':
              const thc40ApplyingCharge = new ApplyingCharge<'ThcCharge', ContainerType, ContainerCharge, ThcChargeMapType, CurrencyType, Mandatory,ContainerTypeRequest>(
                'ThcCharge',
                thc20ChargeLine[1].charge,
                thc40ChargeLine,
                { name: 'Containers', requestDetails: [container], chargeParamObj: [new Container(container.containerType, container.weight, container.count)] }
              );
              thc40ApplyingCharge.scaleCharge(container.count);
              applicableCharges.push(thc40ApplyingCharge);
              break;
          }
        },
      );
      return applicableCharges;
    }
  }
}  