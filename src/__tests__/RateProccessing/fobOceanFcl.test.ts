/** FCL Input Constants*/
/** Air  Input Constants*/
import { RateLineSet } from '../../Rates/Rate';
 import { inputFobOceanFclObject } from '../../Mocks/fclMockObjects';
import { rateLineMock, RateLineChargeProps } from '../../Mocks/rateLineMockObjects';




const rateLineParamsShenzhen: () => RateLineChargeProps = () => {
  return {
    generalInfoParams: {
      carrierName: 'Carrier_1',
      freightForwarderName: 'FreightForwarder_1',
      rateId: '744932d2-584c-491f-b07c-4ad69b71375f',
      rateName: 'FreightForwarder_1',
      rateType: 'ImportFOBOCEANFCL',
      region: 'FarEast',
      validFrom: 'Today at 9:42',
      validTo: '2020-12-19',
      pointOfOrigin: 'Ashdod',
      pointOfDestination: 'Shenzhen',
      transitTime: '30 day',
      route: '[\\"Direct\\"]',
    },
    fclBaseChargeParams: [
      { containerType: 'DV20', amount: '200', currency: 'NIS', mandatory: 'Y' },
      { containerType: 'DV40', amount: '300', currency: 'NIS', mandatory: 'Y' },
      { containerType: 'HQ40', amount: '400', currency: 'NIS', mandatory: 'Y' },

    ],
    heavyChargeParams: [
      { value: '23', amount: '40', currency: 'NIS', mandatory: 'Y' },
      { value: '25', amount: '80', currency: 'NIS', mandatory: 'Y' },
    ],
    oceanFclFreightFix: [
      { chargeName: 'a', mandatory: 'Y', currency: 'NIS', amount: '20' },
    ],
    localContainerParams: [
      { chargeName: 'a', containerType: 'DV20', mandatory: 'Y', currency: 'NIS', amount: '200' },
      { chargeName: 'b', containerType: 'DV40', mandatory: 'Y', currency: 'EUR', amount: '100' },
    ],
    localsOceanFclFixRates: [
      { chargeName: 'a', mandatory: 'Y', currency: 'NIS', amount: '200' },
    ],
    thcObject: [
      { containerType: 'DV20', currency: 'NIS', amount: '20', mandatory: 'Y' },
      { containerType: 'DV40', currency: 'NIS', amount: '30', mandatory: 'Y' },
    ],
  };
};

const rateLineParamsShanghai: RateLineChargeProps = {
  generalInfoParams: {
    carrierName: 'Carrier_1',
    freightForwarderName: 'FreightForwarder_1',
    rateId: '744932d2-584c-491f-b07c-4ad69b71375f',
    rateName: 'FreightForwarder_1',
    rateType: 'ImportFOBOCEANFCL',
    region: 'FarEast',
    validFrom: 'Today at 9:42',
    validTo: '2020-12-19',
    pointOfOrigin: 'Ashdod',
    pointOfDestination: 'Shanghai',
    transitTime: '30 day',
    route: '[\\"Direct\\"]',
  },
  fclBaseChargeParams: [
    { containerType: 'DV20', amount: '220', currency: 'NIS', mandatory: 'Y' },
    { containerType: 'DV40', amount: '320.32', currency: 'NIS', mandatory: 'Y' },
    { containerType: 'HQ40', amount: '420', currency: 'NIS', mandatory: 'Y' },

  ],
  heavyChargeParams: [
    { value: '23', amount: '40', currency: 'NIS', mandatory: 'Y' },
    { value: '25', amount: '80', currency: 'NIS', mandatory: 'Y' },
  ],
  oceanFclFreightFix: [
    { chargeName: 'a', mandatory: 'Y', currency: 'NIS', amount: '20' },
  ],
  localContainerParams: [
    { chargeName: 'a', containerType: 'DV20', mandatory: 'Y', currency: 'NIS', amount: '200' },
    { chargeName: 'b', containerType: 'DV40', mandatory: 'Y', currency: 'EUR', amount: '100' },
  ],
  localsOceanFclFixRates: [
    { chargeName: 'a', mandatory: 'Y', currency: 'NIS', amount: '200' },
  ],
  thcObject: [
    { containerType: 'DV20', currency: 'NIS', amount: '20', mandatory: 'Y' },
    { containerType: 'DV40', currency: 'NIS', amount: '30', mandatory: 'Y' },
  ],
};

test('Fob Ocean Fcl Type',
  () => {
    const actual = new RateLineSet(inputFobOceanFclObject());


    const expectedRateLines = [
      ...rateLineMock(
        [
          rateLineParamsShenzhen(),
          rateLineParamsShanghai,
        ],
      ),
    ];

    const expected = `[${expectedRateLines.join('')}\n]`;
    console.log(expected);

    const actualString = actual.toString();
    console.log(actualString);

   /* expect(JSON.stringify(actualString)).toStrictEqual(JSON.stringify(expected));*/
  },
);
