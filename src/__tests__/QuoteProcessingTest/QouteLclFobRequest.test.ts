 import { RequestFobLcl } from '../../RFQ/requestTypes';
import { Quote } from '../../RFQ/Quote';
 import { RateLineParams, RateType } from '../../Rates/rateTypes';
 import {RateLineSet} from '../../Rates/Rate';

/** LCL Input Constants*/

const generalInfo = {
  carrierName: 'Carrier_1',
  freightForwarderName: 'FreightForwarder_1',
  rateID: '744932d2-584c-491f-b07c-4ad69b71375f',
  rateName: 'FreightForwarder_1',
  rateType: 'ImportFOBOCEANLCL' as RateType,
  region: 'FarEast',
  validFrom: 'Today at 9:42',
  validTo: '2020-12-19',
};

/* Input Object Freight Transport */
const oceanLCLTable = () => [
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
const lclLimits = () => {
  return {
    limitHeightShipment: '200 cm',
    limitWeightShipment: '30000 kg',
    limitWeightBox: '300 kg',
  };
};
const freightPartLclRatio = () => {
  return '1000 kg';
};
const freightTransportRatesObject = () => {
  return {
    oceanLCLTable: JSON.stringify(oceanLCLTable()),
    oceanLCLRateRatio: freightPartLclRatio(),
    ...lclLimits(),
  };
};


/* Input Object Local Charges*/
const localsOceanLCLFixTable = () => [
  [
    { field: 'rowIndex', value: '1.' },
    { value: 'a', field: 'FixRuleName' },
    {
      value: 'NIS 200',
      field: 'amount',
      fieldType: 'currency',
      currencyType: 'NIS',
    },
    { value: 'Y', field: 'mandatory' },
  ],
];

const localsLclByWeightTable = () => {
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
        value: '200',
        field: 'scale',
      },
      {
        value: 'NIS 5',
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


const localRatesObject = () => {
  return {
    localsLclByWeightTable: JSON.stringify(
      localsLclByWeightTable(),
    ),
    FixedRules: JSON.stringify(localsOceanLCLFixTable()),

  };
};


const inputFobOceanFclObject = () => {
  return {
    ...generalInfo,
    freightTransportRatesObject: freightTransportRatesObject(),
    localRatesObject: localRatesObject(),
  };
};


let rateLine: RateLineParams = new RateLineSet(inputFobOceanFclObject()).rateChargesPerPointOfOrigin[0] as RateLineParams;


let requestDetails: RequestFobLcl = {
  boxes: [
    {
      height: { value: '100', unit: 'cm' },
      width: { value: '100', unit: 'cm' },
      length: { value: '100', unit: 'cm' },
      weight: { value: '100', unit: 'kg' },
      count: '5',
    },

  ],
};
/*
let freightTransportChargeSet = (): TotalChargeSet => {
  return {
    mandatory: new TotalCharge<'Y'>(
      'Y',
      {
      totalChargesInEur: [new ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType,'EUR', 'Y'>({ currency: 'EUR', amount: '0', mandatory: 'Y' })],
      totalChargesInNis: [new ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType,'NIS', 'Y'>({ currency: 'NIS', amount: '150', mandatory: 'Y' })],
      totalChargesInUsd: [new ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType,'USD', 'Y'>({ currency: 'USD', amount: '0', mandatory: 'Y' })],
    }),
    nonMandatory: new TotalCharge<'N'>(
      'N',
      {
      totalChargesInEur: [new ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType,'EUR', 'N'>({ currency: 'EUR', amount: '0', mandatory: 'N' })],
      totalChargesInNis: [new ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType,'NIS', 'N'>({ currency: 'NIS', amount: '0', mandatory: 'N' })],
      totalChargesInUsd: [new ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType,'USD', 'N'>({ currency: 'USD', amount: '0', mandatory: 'N' })],
    }),
  };
};

let localChargeSet = (): TotalChargeSet => {
  return {
    mandatory: new TotalCharge<'Y'>(
      'Y',
      {
        totalChargesInEur: [new ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType,'EUR', 'Y'>({ currency: 'EUR', amount: '0', mandatory: 'Y' })],
        totalChargesInNis: [new ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType,'NIS', 'Y'>({ currency: 'NIS', amount: '205', mandatory: 'Y' })],
        totalChargesInUsd: [new ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType,'USD', 'Y'>({ currency: 'USD', amount: '0', mandatory: 'Y' })],
      }),
    nonMandatory: new TotalCharge<'N'>(
      'N',
      {
        totalChargesInEur: [new ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType,'EUR', 'N'>({ currency: 'EUR', amount: '0', mandatory: 'N' })],
        totalChargesInNis: [new ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType,'NIS', 'N'>({ currency: 'NIS', amount: '0', mandatory: 'N' })],
        totalChargesInUsd: [new ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType,'USD', 'N'>({ currency: 'USD', amount: '0', mandatory: 'N' })],
      }),
  };
};
*/

test('Fob Ocean Lcl RateLine Calc', () => {

  const charges = new Quote(rateLine, requestDetails).quoteCharges;
/*

  console.log(charges.toString());
*/

  /*  expect(new Quote(rateLine, requestDetails).quoteCharges)
    .toMatchObject(freightTransportChargeSet);*/
});

