"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.thcCharges = exports.localContainerCharges = exports.localFreightFix = exports.fclFreightFix = exports.oceanHeavyCharges = exports.fclBaseCharges = exports.inputFobOceanFclObject = exports.oceanFclFreightFix = exports.oceanFclHeavy = exports.localsByContainerTable = exports.oceanFclTable = exports.generalInfoInput = void 0;
/** Input Object Local Charges*/
const generalInfoInput = () => {
    return {
        carrierName: 'Carrier_1',
        freightForwarderName: 'FreightForwarder_1',
        rateID: '744932d2-584c-491f-b07c-4ad69b71375f',
        rateName: 'FreightForwarder_1',
        rateType: 'ImportFOBOCEANFCL',
        region: 'FarEast',
        validFrom: 'Today at 9:42',
        validTo: '2020-12-19',
    };
};
exports.generalInfoInput = generalInfoInput;
const oceanFclTable = () => [
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
exports.oceanFclTable = oceanFclTable;
const localsByContainerTable = () => {
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
exports.localsByContainerTable = localsByContainerTable;
const oceanFclHeavy = () => [
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
]; /* Input Object Freight Transport */
exports.oceanFclHeavy = oceanFclHeavy;
const oceanFclFreightFix = () => [
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
exports.oceanFclFreightFix = oceanFclFreightFix;
const freightTransportRatesObject = () => {
    return {
        oceanFCLTable: JSON.stringify(exports.oceanFclTable()),
        oceanFCLFreightFix: JSON.stringify(exports.oceanFclFreightFix()),
        oceanFCLHEAVY: JSON.stringify(exports.oceanFclHeavy()),
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
        LocalsOceanFCLByContainerTypeTable: JSON.stringify(exports.localsByContainerTable()),
        LocalsOceanFCLFixTable: JSON.stringify(localsOceanFCLFixTable()),
        thc20: 'NIS 20',
        thc40: 'NIS 30',
    };
};
const inputFobOceanFclObject = () => {
    return {
        ...exports.generalInfoInput(),
        freightTransportRatesObject: freightTransportRatesObject(),
        localRatesObject: localRatesObject(),
    };
};
exports.inputFobOceanFclObject = inputFobOceanFclObject;
/** Mock FCL Charges string generators. */
const fclBaseCharges = (props) => props
    .map(charge => {
    return `\n\t\t\t["${charge.containerType}",{"charge":{"amount":"${charge.amount}","currency":"${charge.currency}","mandatory":"${charge.mandatory}"},"container":"${charge.containerType}"}]`;
});
exports.fclBaseCharges = fclBaseCharges;
const oceanHeavyCharges = (props) => props
    .map(charge => `\n\t\t\t[{"value":"${charge.value}","unit":"ton"},{"charge":{"amount":"${charge.amount}","currency":"${charge.currency}","mandatory":"${charge.mandatory}"}}]`);
exports.oceanHeavyCharges = oceanHeavyCharges;
const fclFreightFix = (props) => props
    .map(charge => `\n\t\t\t["${charge.chargeName}",{"charge":{"amount":"${charge.amount}","currency":"${charge.currency}","mandatory":"${charge.mandatory}"}}]`);
exports.fclFreightFix = fclFreightFix;
const localFreightFix = (props) => props
    .map(charge => `\n\t\t\t["${charge.chargeName}",{"charge":{"amount":"${charge.amount}","currency":"${charge.currency}","mandatory":"${charge.mandatory}"}}]`);
exports.localFreightFix = localFreightFix;
const localContainerCharges = (props) => props
    .map(charge => `\n\t\t\t["${charge.chargeName}",{"charge":{"amount":"${charge.amount}","currency":"${charge.currency}","mandatory":"${charge.mandatory}"},"container":"${charge.containerType}"}]`);
exports.localContainerCharges = localContainerCharges;
const thcCharges = (props) => props
    .map(charge => `\n\t\t\t["${charge.containerType}",{"charge":{"currency":"${charge.currency}","amount":"${charge.amount}","mandatory":"${charge.mandatory}"},"container":"${charge.containerType}"}]`);
exports.thcCharges = thcCharges;
//# sourceMappingURL=fclMockObjects.js.map