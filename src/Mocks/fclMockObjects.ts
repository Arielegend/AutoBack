import { ContainerType, CurrencyType, GridElement, Mandatory, RateType } from '../Rates/rateTypes';

/** Input Object Local Charges*/

export const generalInfoInput = () => {
  return {
    carrierName: 'Carrier_1',
    freightForwarderName: 'FreightForwarder_1',
    rateID: '744932d2-584c-491f-b07c-4ad69b71375f',
    rateName: 'FreightForwarder_1',
    rateType: 'ImportFOBOCEANFCL' as RateType,
    region: 'FarEast',
    validFrom: 'Today at 9:42',
    validTo: '2020-12-19',
  };
};
export const oceanFclTable = (): Pick<GridElement, keyof GridElement>[][] => [
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
      value: 'NIS 200',
      field: 'DV20',
      fieldType: 'currency',
      currencyType: 'NIS',
    },
    {
      value: 'NIS 300',
      field: 'DV40',
      fieldType: 'currency',
      currencyType: 'NIS',
    },
    {
      value: 'NIS 400',
      field: 'HQ40',
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
      value: 'NIS 220',
      field: 'DV20',
      fieldType: 'currency',
      currencyType: 'NIS',
    },
    {
      value: 'NIS 320.32',
      field: 'DV40',
      fieldType: 'currency',
      currencyType: 'NIS',
    },
    { value: 'NIS 420', field: 'HQ40', fieldType: 'currency', currencyType: 'NIS' },
  ],
];

export const localsByContainerTable = (): Pick<GridElement, keyof GridElement>[][] => {
  return [
    [
      {
        field: 'rowIndex',
        value: '1.',
      },
      {
        value: 'a',
        field: 'ruleName',
      },
      {
        value: 'NIS 200',
        field: 'amount',
        fieldType: 'currency',
        currencyType: 'NIS',
      },
      {
        value: 'Y',
        field: 'mandatory',
      },
      {
        value: 'DV20',
        field: 'containerType',
      },
    ],
    [
      {
        field: 'rowIndex',
        value: '2.',
      },
      {
        value: 'b',
        field: 'ruleName',
      },
      {
        value: 'EUR 100',
        field: 'amount',
        fieldType: 'currency',
        currencyType: 'EUR',
      },
      {
        value: 'Y',
        field: 'mandatory',
      },
      {
        value: 'DV40',
        field: 'containerType',
      },
    ],
  ];
};
export const oceanFclHeavy: () => Pick<GridElement, keyof GridElement>[][] = () => [
  [
    { field: 'rowIndex', value: '1.' },
    {
      value: '23 ton',
      field: 'fromWeightTons',
      fieldType: 'ton',
    },
    {
      value: 'NIS 40',
      field: 'amount',
      fieldType: 'currency',
      currencyType: 'NIS',
    },
  ],
  [
    { field: 'rowIndex', value: '2.' },
    {
      value: '25 ton',
      field: 'fromWeightTons',
      fieldType: 'ton',
    },
    {
      value: 'NIS 80',
      field: 'amount',
      fieldType: 'currency',
      currencyType: 'NIS',
    },
  ],
];/* Input Object Freight Transport */
export const oceanFclFreightFix = () => [
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
      value: '20',
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

const freightTransportRatesObject = () => {
  return {
    oceanFCLTable: JSON.stringify(oceanFclTable()),
    oceanFCLFreightFix: JSON.stringify(oceanFclFreightFix()),
    oceanFCLHEAVY: JSON.stringify(oceanFclHeavy()),
    portDefaultDestinationIsrael: 'Ashdod',
  };
};
const localsOceanFCLFixTable = () => [
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
const localRatesObject = () => {
  return {
    LocalsOceanFCLByContainerTypeTable: JSON.stringify(
      localsByContainerTable(),
    ),
    LocalsOceanFCLFixTable: JSON.stringify(localsOceanFCLFixTable()),
    thc20: 'NIS 20',
    thc40: 'NIS 30',
  };
};
export const inputFobOceanFclObject = () => {
  return {
    ...generalInfoInput(),
    freightTransportRatesObject: freightTransportRatesObject(),
    localRatesObject: localRatesObject(),
  };
};


/** Mock Types FCL Charges */

export interface FclBaseCharges {
  containerType: ContainerType;
  amount: string;
  currency: CurrencyType;
  mandatory: Mandatory;
}


export interface HeavyContainerCharges {
  value: string;
  amount: string;
  currency: CurrencyType;
  mandatory: Mandatory;
}

export interface FixChargeProps {
  chargeName: string;
  amount: string;
  currency: CurrencyType;
  mandatory: Mandatory;
}

export type LocalContainerChargeProps = { chargeName: string, containerType: ContainerType, currency: CurrencyType, amount: string, mandatory: Mandatory };

export interface ThcChargeProps {
  containerType: ContainerType;
  currency: CurrencyType;
  amount: string;
  mandatory: Mandatory;
}

/** Mock FCL Charges string generators. */

export const fclBaseCharges = (props: FclBaseCharges[]) =>
  props
    .map(
      charge =>
      {
        return `\n\t\t\t["${charge.containerType}",{"charge":{"amount":"${charge.amount}","currency":"${charge.currency}","mandatory":"${charge.mandatory}"},"container":"${charge.containerType}"}]`},
    );

export const oceanHeavyCharges = (props: HeavyContainerCharges[]) =>
  props
    .map(
      charge =>
        `\n\t\t\t[{"value":"${charge.value}","unit":"ton"},{"charge":{"amount":"${charge.amount}","currency":"${charge.currency}","mandatory":"${charge.mandatory}"}}]`,
    );

export const fclFreightFix = (props: FixChargeProps[]) =>
  props
    .map(
      charge =>
        `\n\t\t\t["${charge.chargeName}",{"charge":{"amount":"${charge.amount}","currency":"${charge.currency}","mandatory":"${charge.mandatory}"}}]`,
    );

export const localFreightFix = (props: FixChargeProps[]) =>
  props
    .map(charge => `\n\t\t\t["${charge.chargeName}",{"charge":{"amount":"${charge.amount}","currency":"${charge.currency}","mandatory":"${charge.mandatory}"}}]`);

export const localContainerCharges = (props: LocalContainerChargeProps[]) =>
  props
    .map(
      charge =>
        `\n\t\t\t["${charge.chargeName}",{"charge":{"amount":"${charge.amount}","currency":"${charge.currency}","mandatory":"${charge.mandatory}"},"container":"${charge.containerType}"}]`,
    );

export const thcCharges = (props: ThcChargeProps[]) =>
  props
    .map(
      charge =>
        `\n\t\t\t["${charge.containerType}",{"charge":{"currency":"${charge.currency}","amount":"${charge.amount}","mandatory":"${charge.mandatory}"},"container":"${charge.containerType}"}]`,
    );