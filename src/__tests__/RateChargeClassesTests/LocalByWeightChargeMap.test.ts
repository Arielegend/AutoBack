import { LocalsByWeightChargeMap } from '../../RateChargeClasses/LocalsByWeightChargeMap';
import { BoxDetails } from '../../RFQ/requestTypes';

const localsAirByWeightTable = () => {
  return [
    [
      {
        field: 'rowIndex',
        value: '1.',
      },
      {
        value: 'a',
        field: 'ByWeightRuleName',
      },
      {
        value: '1000',
        field: 'ratio',
      },
      {
        value: 'NIS 1',
        field: 'amount',
        fieldType: 'currency',
        currencyType: 'NIS',
      },
      {
        value: 'Y',
        field: 'mandatory',
      },
    ],
  ];
};


const boxes: BoxDetails[] = [
  {
    height: { value: '100', unit: 'cm' },
    width: { value: '100', unit: 'cm' },
    length: { value: '100', unit: 'cm' },
    weight: { value: '100', unit: 'kg' },
    count: '5',
  },
];


// let inputKg = Measure.dimensionless(200)
// let inputCbm = Measure.dimensionless(5)
// Applicable Charges Total: NIS 5000


test(
  'Locals Air By Weight Charge.',
  () => {
    const actualLocalsByWeightChargeMap = new LocalsByWeightChargeMap(JSON.stringify(localsAirByWeightTable()));

    const actual = actualLocalsByWeightChargeMap.calcMe({ name: 'Boxes', requestDetails: boxes });


    const actualString = actual[0].toString();

    expect(JSON.stringify(actualString))
      .toStrictEqual(
        JSON.stringify([
          '\nWeight Rules Charges: [NIS 5000, mandatory], per rate of NIS 1 / Physical/Volume Weight (Volume Weight = 1 m3 * 1000 kg),',
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
        ].join('')),
      );
  },
);
