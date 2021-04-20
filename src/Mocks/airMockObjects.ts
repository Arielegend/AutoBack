/* Input Const Freight Transport */
import { GridElement } from '../Rates/rateTypes';
import { TotalCharge } from '../ApplyingCharges/TotalCharge';
import { FreightAirBaseChargeMap } from '../RateChargeClasses/BaseCharges/Fob/FreightAirBaseChargeMap';
import { RequestFobAir } from '../RFQ/requestTypes';
import { reduceApplyingChargesArrayToTotal } from '../ApplyingCharges/chargeUtils';
import { TotalChargeSet } from '../ApplyingCharges/chargeTypes';

export const airTable = () => {
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
        value: '23',
        field: 'transitTime',
        fieldType: 'day',
      },
      {
        field: 'from 23 kg',
        value: 'NIS 3',
        fieldType: 'currency',
        currencyType: 'NIS',
      },
    ],
  ];
};
export const airRatio = () => {
  return '167 kg';
};
export const airLimits = () => {
  return {
    limitHeightShipment: '200 cm',
    limitWeightShipment: '30000 kg',
    limitWeightBox: '300 kg',
  };
};
export const inputFreightTransportRatesObject = () => {
  return {
    airTable: JSON.stringify(airTable()),
    airLimits: JSON.stringify(airLimits()),
    airRatio: airRatio(),
  };
};

/* Input Const Local Charges*/
export const localsAirByWeightTable = () => {
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
        value: '167',
        field: 'scale',
      },
      {
        value: 'NIS 2',
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
export const localsAirFixTable = () => [
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
      value: 'NIS 23',
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
export const yata = () => '10';
export const inputAirLocalsObject = () => {
  return {
    LocalsAirByWeightTable: JSON.stringify(localsAirByWeightTable()),
    LocalsAirFixTable: JSON.stringify(localsAirFixTable()),
    yata: yata(),
  };
};

export const yataChargeSet = (): Pick<GridElement, keyof GridElement>[][] => [[{ field: 'percent', value: '10' }]];


export const processedAirTable = () : Pick<GridElement, keyof GridElement>[][] =>
  airTable()
    .map(
      row => [
        {
          field: 'ratio',
          value: airRatio(),
        }, ...row.slice(4),
      ] as Pick<GridElement, keyof GridElement>[],
    );
export const requestDetails: () => RequestFobAir = () => {
  return {
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
};

export const totalAirFreight = (): TotalChargeSet =>
  reduceApplyingChargesArrayToTotal(
    new FreightAirBaseChargeMap(processedAirTable())
      .calcMe({ name: 'Boxes', requestDetails: requestDetails().boxes }),
  ) as TotalChargeSet;
