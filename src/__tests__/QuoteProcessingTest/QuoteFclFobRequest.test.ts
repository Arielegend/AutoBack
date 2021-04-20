import { RequestFobFcl } from '../../RFQ/requestTypes';
import { RateLineParams, RateType } from '../../Rates/rateTypes';
import { RateLineSet } from '../../Rates/Rate';
import { Quote } from '../../RFQ/Quote';


/** FCL Input Constants*/

const generalInfo = {
  carrierName: 'Carrier_1',
  freightForwarderName: 'FreightForwarder_1',
  rateID: '744932d2-584c-491f-b07c-4ad69b71375f',
  rateName: 'FreightForwarder_1',
  rateType: 'ImportFOBOCEANFCL' as RateType,
  region: 'FarEast',
  validFrom: 'Today at 9:42',
  validTo: '2020-12-19',
};

/* Input Object Freight Transport */
const oceanFCLTable = () => [
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
      value: 'NIS 30',
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
      value: 'NIS 320',
      field: 'DV40',
      fieldType: 'currency',
      currencyType: 'NIS',
    },
    { value: 'NIS 420', field: 'HQ40', fieldType: 'currency', currencyType: 'NIS' },
  ],
];
const oceanFCLFreightFix = () => [
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
      value: 'USD 200',
      field: 'amount',
      fieldType: 'currency',
      currencyType: 'USD',
    },
    {
      value: 'Y',
      field: 'mandatory',
    },
  ],
];
const oceanFCLHEAVY = () => [
  [
    { field: 'rowIndex', value: '1.' },
    {
      value: '23 ton',
      field: 'fromWeightTons',
      fieldType: 'ton',
    },
    {
      value: 'EUR 40',
      field: 'amount',
      fieldType: 'currency',
      currencyType: 'EUR',
    },
  ],
];

/* Input Freight Transport Object Charges. */
const freightTransportRatesObject = () => {
  return {
    oceanFCLTable: JSON.stringify(oceanFCLTable()),
    oceanFCLFreightFix: JSON.stringify(oceanFCLFreightFix()),
    oceanFCLHEAVY: JSON.stringify(oceanFCLHEAVY()),
    portDefaultDestinationIsrael: 'Ashdod',
  };
};

/* Input Object Local Charges. */
const localsOceanFCLFixTable = () => [
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
const localsOceanFCLByContainerTypeTable = () => [
  [
    {
      field: 'rowIndex',
      value: '1.',
    },
    {
      value: 'b',
      field: 'ruleName',
    },
    {
      value: 'NIS 200',
      field: 'amount',
      fieldType: 'currency',
      currencyType: 'NIS',
    },
    {
      value: 'N',
      field: 'mandatory',
    },
    {
      value: 'DV20',
      field: 'containerType',
    },
  ],
];
const localRatesObject = () => {
  return {
    LocalsOceanFCLByContainerTypeTable: JSON.stringify(
      localsOceanFCLByContainerTypeTable(),
    ),
    LocalsOceanFCLFixTable: JSON.stringify(localsOceanFCLFixTable()),
    thc20: 'NIS 20',
    thc40: 'NIS 30',
  };
};


const inputFobOceanFclObject = () => {
  return {
    ...generalInfo,
    freightTransportRatesObject: freightTransportRatesObject(),
    localRatesObject: localRatesObject(),
  };
};

const rateLine: RateLineParams = new RateLineSet(inputFobOceanFclObject()).rateChargesPerPointOfOrigin[0] as RateLineParams;

const requestDetails: RequestFobFcl = {
  containers: [
    {
      containerType: 'DV20',
      count: '2',
      weight: { value: '25', unit: 'ton' },
    },

  ],
};


test(
  'Fob Ocean Fcl RateLine Calc',
  () => {
    const fclCharges = new Quote(rateLine, requestDetails).quoteCharges;

    console.log(fclCharges.toString());
  },
);


