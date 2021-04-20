import { HeavyWeightChargesMap } from '../../RateChargeClasses/HeavyWeightChargeMap';
import { ContainerDetails } from '../../RFQ/requestTypes';
import { ContainerType, CurrencyType, WeightUnit } from '../../Rates/rateTypes';
import { oceanFclHeavy } from '../../Mocks/fclMockObjects';

const containers: ContainerDetails[] = [
  {
    containerType: 'DV40',
    count: '2',
    weight: { value: '26', unit: 'ton' as WeightUnit },
  },
  {
    containerType: 'DV20',
    count: '3',
    weight: { value: '24', unit: 'ton' as WeightUnit },
  },
];
//3 * 40 + 2 * 80 = 120 + 160 = 280

const dv40Charge = {};


test(
  'Heavy containers ',
  () => {

    const heavyWeightChargesMap = new HeavyWeightChargesMap(oceanFclHeavy());
    const appliedCharges = heavyWeightChargesMap.calcMe({ name: 'Containers', requestDetails: containers });

    const actual20 = appliedCharges[1].toString();


    const expectedContainerCharge = (currency: CurrencyType, containerCharge: number, chargeRate: number, tonThreshold: number, containerCount: number,containerType: ContainerType, containerWeight: number) => [
      `\nHeavy Weight Charge: [${currency} ${containerCharge}, mandatory], per rate of NIS ${chargeRate} for weight >= ${tonThreshold} ton,\n`,
      '\tCharge Input:\n', `\t${containerCount} X ${containerType}, Container Weight: ${containerWeight} ton`,
    ].join('');

    expect(JSON.stringify(actual20))
      .toStrictEqual(JSON.stringify(expectedContainerCharge('NIS', 120, 40,23, 3, 'DV20', 24)));
    const actual40 = appliedCharges[0].toString();

    expect(JSON.stringify(actual40))
      .toStrictEqual(
        JSON.stringify(expectedContainerCharge('NIS',160, 80, 25, 2, 'DV40', 26)));
  },
);