import { FreightLclBaseChargeMap } from '../../RateChargeClasses/BaseCharges/Fob/FreightLclBaseChargeMap';
import { GridElement } from '../../Rates/rateTypes';
import { BoxDetails } from '../../RFQ/requestTypes';

const oceanLCLTable = (): Pick<GridElement, keyof GridElement>[][] => [
  [
    {
      field: 'rowIndex',
      value: '1.',
    },
    {
      value: 'Shenzhen',
      field: 'portFrom',
    },
    {
      value: 'Ashdod',
      field: 'portTo',
    },
    {
      value: '30 d',
      field: 'transitTime',
      fieldType: 'day',
    },
    {
      value: '[\\"Direct\\"]',
      field: 'route',
    },
    {
      value: 'NIS 30',
      field: 'weightMeasure',
      fieldType: 'currency',
      currencyType: 'NIS',
    },


  ],
  [
    {
      field: 'rowIndex',
      value: '2.',
    },
    {
      value: 'Shanghai',
      field: 'portFrom',
    },
    {
      value: 'Ashdod',
      field: 'portTo',
    },
    {
      value: '30 d',
      field: 'transitTime',
      fieldType: 'day',
    },
    {
      value: '[\\"Direct\\"]',
      field: 'route',
    },
    {
      value: 'NIS 35',
      field: 'weightMeasure',
      fieldType: 'currency',
      currencyType: 'NIS',
    },

  ],
];
let requestDetails: BoxDetails[] =
  [
    {
      height: { value: '100', unit: 'cm' },
      width: { value: '100', unit: 'cm' },
      length: { value: '100', unit: 'cm' },
      weight: { value: '100', unit: 'kg' },
      count: '5',
    },
  ];

// 5 X 500kg = 2500 kg (2.5 tons) < 5 x 1000 kg = 5000 kg (5 tons) => NIS 30 * 5  = NIS 150


test('Fob Ocean Lcl RateLine Calc: 5 Boxes X 500kg = 2500 kg (2.5 tons) < 5 x 1000 kg = 5000 kg (5 tons) => NIS 30 * 5  = NIS 150', () => {
  const lclBaseChargeMap = new FreightLclBaseChargeMap(
    [oceanLCLTable()
      .map(
        charge => [
          {
            value: '1000',
            field: 'ratio',
          },
          ...charge.slice(5),
        ],
      )[0]],
  );
  const totalCharges = lclBaseChargeMap.calcMe({ name: 'Boxes', requestDetails: requestDetails }).toString();

  expect(JSON.stringify(totalCharges))
    .toStrictEqual(JSON.stringify([
      '\nLCL Freight Charge: [NIS 150, mandatory], per rate of NIS 30 for weight >= NIS 30 / Physical/Volume Weight (Volume Weight = 1 m3 * 1000 kg),',
      '\n\tCharge Input:',
      '\n\t5 Boxes:',
      '\n\t~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
      '\n\tDimensions: 100 cm X 100 cm X 100 cm,',
      '\n\tCBM: 500 cm3',
      '\n\tWeight: 100 kg,',
      '\n\t~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
      '\n\tTotal Weight: 500 kg,',
      '\n\tTotal Volume Weight: 5000 kg, ratio: 1000,',
      '\n\tQuoted Weight: 5000 kg.\n\t',
    ].join('')));
});
