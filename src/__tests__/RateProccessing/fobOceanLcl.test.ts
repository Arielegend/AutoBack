/** LCL Input Constants*/

import { RateLineSet } from '../../Rates/Rate';
import { RateType } from '../../Rates/rateTypes';


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
      value: '30',
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
      value: '30',
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
  return '1000';
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
      value: '200',
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
        value: '1000',
        field: 'scale',
      },
      {
        value: '5',
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

/** lCL Output Constants */
const rateLineGeneralInfoPortShenzhen = () => {
  return {
    ...generalInfo,
    pointOfOrigin: 'Shenzhen',
    pointOfDestination: 'Ashdod',
  };
};
const rateLineGeneralInfoPortShanghai = () => {
  return {
    ...generalInfo,
    pointOfOrigin: 'Shanghai',
    pointOfDestination: 'Ashdod',
  };
};

/* RateLine Freight Transport Charges Mock */
const rateLineLclChargesShenzhen = () => {
  return {
    amount: '30',
    currency: 'NIS',
    mandatory: 'Y',
  };
};

const rateLineFclChargesShanghai = () => {
  return {
    amount: '35',
    currency: 'NIS',
    mandatory: 'Y',
  };
};

const mockFreightTransportChargesShenzhen = () => {
  return {
    lclCharges: rateLineLclChargesShenzhen(),
    limits: lclLimits(),
    ratio: freightPartLclRatio(),
  };
};

const mockFreightTransportChargesShanghai = () => {
  return {
    lclCharges: rateLineFclChargesShanghai(),
    limits: lclLimits(),
    ratio: freightPartLclRatio(),
  };
};

/* RateLine Local Charges Mock */
const rateLineLocalsOceanLclFixRates = () => [
  ['a', { charge: { amount: '200', currency: 'NIS', mandatory: 'Y' } }],
];

const rateLineLocalsOceanLclByWeight = () => [
  [
    'a',
    {
      ratio: '1000',
      charge: { amount: '5', currency: 'NIS', mandatory: 'Y' },
    },
  ],
];

const rateLineLocalCharges = () => {
  return {
    oceanLclLocalFix: JSON.stringify(rateLineLocalsOceanLclFixRates()),
    oceanLclLocalWeight: JSON.stringify(rateLineLocalsOceanLclByWeight()),
  };
};

const inputFobOceanLclObject = () => {
  return {
    ...generalInfo,
    freightTransportRatesObject: freightTransportRatesObject(),
    localRatesObject: localRatesObject(),
  };
};

const outputFobOceanFclObject = () => {
  return [
    {
      ...rateLineGeneralInfoPortShenzhen(),
      freightTransportCharges: JSON.stringify(
        mockFreightTransportChargesShenzhen(),
      ),
      localCharges: JSON.stringify(rateLineLocalCharges()),
    },
    {
      ...rateLineGeneralInfoPortShanghai(),
      freightTransportCharges: JSON.stringify(
        mockFreightTransportChargesShanghai(),
      ),
      localCharges: JSON.stringify(rateLineLocalCharges()),
    },
  ];
};

test('Fob Ocean Lcl Type', () => {
  const lclRateLineSet = new RateLineSet(inputFobOceanLclObject());
  const lclRateLineStr = lclRateLineSet.toString();
 /* console.log(lclRateLineStr)*/

 /* expect(JSON.stringify(lclRateLineStr))
    .toStrictEqual(JSON.stringify(outputFobOceanFclObject()));
  */
  }
);