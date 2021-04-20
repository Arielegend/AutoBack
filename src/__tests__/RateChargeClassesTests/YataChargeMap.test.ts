import { YataChargeMap } from '../../RateChargeClasses/YataChargeMap';
import { totalAirFreight, yataChargeSet } from '../../Mocks/airMockObjects';
/*
Note, 
  yataChargeSet()  => [[{ field: 'percent', value: '10' }]];

*/
test(
  'YataChargeMap test',
  () => {
    const actual = new YataChargeMap(yataChargeSet()).calcMe({
      name: 'TotalChargeSet',
      requestDetails: totalAirFreight(),
    });
    expect(JSON.stringify(actual.toString())).toStrictEqual(JSON.stringify(['\nYATA Charge: [NIS 250.5, mandatory], per rate of Total Air Freight,','\n\tCharge Input:NIS 2505'].join('')));
  },
);