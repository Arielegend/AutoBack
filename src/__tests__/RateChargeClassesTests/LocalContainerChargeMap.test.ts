import { LocalContainerChargeMap } from '../../RateChargeClasses/LocalContainerChargeMap';
import { ContainerDetails } from '../../RFQ/requestTypes';
import {
  ApplyingCurrencyCharge,
  BoxesTypeRequest,
  ChargeName,
  ContainerCharge,
  CurrencyType,
  LocalContainerChargeMapType,
  LocalContainerCharges,
  Mandatory,
} from '../../Rates/rateTypes';
import { ApplyingCharge } from '../../ApplyingCharges/ApplyingCharge';
import { localsByContainerTable } from '../../Mocks/fclMockObjects';

const containers: ContainerDetails[] = [
  {
    containerType: 'DV40',
    count: '2',
    weight: { value: '16', unit: 'ton' },

  },
  //'16'
  {
    containerType: 'DV20',
    count: '3',
    weight: { value: '20', unit: 'ton' },
  },
];
// NIS 600,
// EUR 200


const localContainerChargeMap = new LocalContainerChargeMap(localsByContainerTable());

const localContainerCharge = localContainerChargeMap.calcMe({ name: 'Containers', requestDetails: containers });

const expectedOutputDV20 = { currency: 'NIS', amount: '200', mandatory: 'Y' } as ApplyingCurrencyCharge<'NIS', 'Y'>;
const expectedOutputDV40 = { currency: 'EUR', amount: '100', mandatory: 'Y' } as ApplyingCurrencyCharge<'EUR', 'Y'>;

const expectedOutput: ApplyingCharge<'LocalContainerCharges', ChargeName, ContainerCharge, LocalContainerChargeMapType, CurrencyType, Mandatory, BoxesTypeRequest>[] = [];

const applyingChargeDv20 = new ApplyingCharge<'LocalContainerCharges', ChargeName, ContainerCharge, LocalContainerChargeMapType, CurrencyType, 'Y', BoxesTypeRequest>('LocalContainerCharges', expectedOutputDV20);
applyingChargeDv20.scaleCharge('4');

expectedOutput.push(applyingChargeDv20);

const applyingChargeDv40 = new ApplyingCharge<'LocalContainerCharges', ChargeName, ContainerCharge, LocalContainerChargeMapType, CurrencyType, 'Y', BoxesTypeRequest>('LocalContainerCharges', expectedOutputDV40);
applyingChargeDv40.scaleCharge('2');

expectedOutput.push(applyingChargeDv40);


test(
  'By container Charge. ',
  () => {
    const actualDv20 = localContainerCharge[0].toString();
    const actualDv40 = localContainerCharge[1].toString();

    expect(actualDv20)
      .toStrictEqual('\nLocal Container Charge: [NIS 600, mandatory], per rate of NIS 200 / DV20,\n\tCharge Input:\n\t3 X DV20, Container Weight: 20 ton');

    expect(actualDv40)
      .toStrictEqual('\nLocal Container Charge: [EUR 200, mandatory], per rate of EUR 100 / DV40,\n\tCharge Input:\n\t2 X DV40, Container Weight: 16 ton');

  },
);