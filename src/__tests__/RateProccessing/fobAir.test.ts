/** Air  Input Constants*/
import { RateLineSet } from '../../Rates/Rate';
import { RateType } from '../../Rates/rateTypes';

const generalInfo = {
  rateType: 'ImportFOBAIR' as RateType,
  rateID: 'e5f1828f-b177-4bd6-955d-7d4dfaa53bdf',
  carrierName: 'd',
  freightForwarderName: 'b',
  rateName: 'b',
  region: 'Europe',
  validFrom: 'Today at 14:33',
  validTo: '2020-12-17',
};

/* Input Const Freight Transport */
const airTable = () => {
  return [
    [
      {
        field: 'rowIndex',
        value: '1.',
      },
      {
        value: 'a',
        field: 'portFrom',
      },
      {
        value: '[\\"Direct\\"]',
        field: 'route',
      },
      {
        value: '23 d',
        field: 'transitTime',
        fieldType: 'day',
      },
      {
        value: '23 kg',
        field: 'minimumWeight',
        fieldType: 'kg',
      },

      {
        field: 'from 23 kg',
        value: 'NIS 3',
        fieldType: 'currency',
        currencyType: 'NIS',
      },
      {
        field: 'from 26 kg',
        value: 'NIS 15',
        fieldType: 'currency',
        currencyType: 'NIS',
      },
      {
        field: 'from 33 kg',
        value: 'NIS 24',
        fieldType: 'currency',
        currencyType: 'NIS',
      },
      {
        field: 'from 40 kg',
        value: 'NIS 30.3',
        fieldType: 'currency',
        currencyType: 'NIS',
      },
    ],
  ];
};
const airRatio = () => {
  return '167 kg';
};
const airLimits = () => {
  return {
    limitHeightShipment: '200 cm',
    limitWeightShipment: '30000 kg',
    limitWeightBox: '300 kg',
  };
};

const inputFreightTransportRatesObject = () => {
  return {
    airTable: JSON.stringify(airTable()),
    airLimits: JSON.stringify(airLimits()),
    airRatio: airRatio(),
  };
};

/* Input Const Local Charges*/
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
        value: '23',
        field: 'scale',
      },
      {
        value: '2323',
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
const localsAirFixTable = () => [
  [
    {
      field: 'rowIndex',
      value: '1.',
    },
    {
      value: 'a',
      field: 'FixRuleName',
    },
    {
      value: '23',
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
const yata = () => '10';

const inputAirLocalsObject = () => {
  return {
    LocalsAirByWeightTable: JSON.stringify(localsAirByWeightTable()),
    LocalsAirFixTable: JSON.stringify(localsAirFixTable()),
    yata: yata(),
  };
};


/** Air Output Constants */
const rateLineGeneralInfoPointOfOrigin = () => {
  return {
    ...generalInfo,
    pointOfOrigin: 'a',
    pointOfDestination: 'TLV',
  };
};

const outputFobAirCharges = () => [
  [{ value: 'minimumWeight', unit: 'kg' },
    {
      charge: {
        amount: '23 kg',
        unit: undefined,
      },
      ratio: airRatio(),
    },

  ],
  [{ value: '23', unit: 'kg' }, {
    charge: {
      amount: '3',
      unit: 'NIS',
    },
    ratio: airRatio(),
  },
  ],
];


const outputAirFreightTransportRatesObject = () => {
  return {
    airFobCharges: JSON.stringify(outputFobAirCharges()),
    limits: airLimits(),
    minWeight: '23 kg',
  };
};

function outputAirLocalFix() {
  return [['a', { charge: { amount: '23', unit: 'NIS', mandatory: 'Y' } }]];
}

const outputAirLocalByWeight = () =>
  [
    ['a',
      {
        ratio: '23',
        charge:
          {
            amount: '2323',
            unit: 'NIS',
            mandatory: 'Y',
          },
      },
    ],
  ];

const getLocalRatesObject = () => {
  return {
    airLocalsFix: JSON.stringify(outputAirLocalFix()),
    airLocalsByWeight: JSON.stringify(outputAirLocalByWeight()),
    yata: ['percentage', { percentage: '10' }],
  };
};


const inputAirObject = () => {
  return {
    ...generalInfo,
    freightTransportRatesObject: inputFreightTransportRatesObject(),
    localRatesObject: inputAirLocalsObject(),
  };
};


const outputFobAir = () => [
  {
    ...rateLineGeneralInfoPointOfOrigin(),
    freightTransportCharges: JSON.stringify(outputAirFreightTransportRatesObject()),
    localCharges: JSON.stringify(getLocalRatesObject()),
  },
];

/* RateLine Freight Transport Charges Mock */

/* RateLine Local Charges Mock */
test('Fob Air Type',
  () => {
    const airRateLineSet = new RateLineSet(inputAirObject());
    const actual = airRateLineSet.toString();
    /*console.log(actual)*/
    /* expect(actual)
       .toMatchObject(outputFobAir());*/
  },
);

