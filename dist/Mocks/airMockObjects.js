"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.totalAirFreight = exports.requestDetails = exports.processedAirTable = exports.yataChargeSet = exports.inputAirLocalsObject = exports.yata = exports.localsAirFixTable = exports.localsAirByWeightTable = exports.inputFreightTransportRatesObject = exports.airLimits = exports.airRatio = exports.airTable = void 0;
const FreightAirBaseChargeMap_1 = require("../RateChargeClasses/BaseCharges/Fob/FreightAirBaseChargeMap");
const chargeUtils_1 = require("../ApplyingCharges/chargeUtils");
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
exports.airTable = airTable;
const airRatio = () => {
    return '167 kg';
};
exports.airRatio = airRatio;
const airLimits = () => {
    return {
        limitHeightShipment: '200 cm',
        limitWeightShipment: '30000 kg',
        limitWeightBox: '300 kg',
    };
};
exports.airLimits = airLimits;
const inputFreightTransportRatesObject = () => {
    return {
        airTable: JSON.stringify(exports.airTable()),
        airLimits: JSON.stringify(exports.airLimits()),
        airRatio: exports.airRatio(),
    };
};
exports.inputFreightTransportRatesObject = inputFreightTransportRatesObject;
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
exports.localsAirByWeightTable = localsAirByWeightTable;
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
exports.localsAirFixTable = localsAirFixTable;
const yata = () => '10';
exports.yata = yata;
const inputAirLocalsObject = () => {
    return {
        LocalsAirByWeightTable: JSON.stringify(exports.localsAirByWeightTable()),
        LocalsAirFixTable: JSON.stringify(exports.localsAirFixTable()),
        yata: exports.yata(),
    };
};
exports.inputAirLocalsObject = inputAirLocalsObject;
const yataChargeSet = () => [[{ field: 'percent', value: '10' }]];
exports.yataChargeSet = yataChargeSet;
const processedAirTable = () => exports.airTable()
    .map(row => [
    {
        field: 'ratio',
        value: exports.airRatio(),
    }, ...row.slice(4),
]);
exports.processedAirTable = processedAirTable;
const requestDetails = () => {
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
exports.requestDetails = requestDetails;
const totalAirFreight = () => chargeUtils_1.reduceApplyingChargesArrayToTotal(new FreightAirBaseChargeMap_1.FreightAirBaseChargeMap(exports.processedAirTable())
    .calcMe({ name: 'Boxes', requestDetails: exports.requestDetails().boxes }));
exports.totalAirFreight = totalAirFreight;
//# sourceMappingURL=airMockObjects.js.map