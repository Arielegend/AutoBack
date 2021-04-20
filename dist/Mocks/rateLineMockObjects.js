"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLineMock = exports.generalInfo = void 0;
const fclMockObjects_1 = require("./fclMockObjects");
const generalInfo = (carrierName, freightForwarderName, rateId, rateName, rateType, region, validFrom, validTo, pointOfOrigin, pointOfDestination, transitTime, route) => [
    `\n\n\t\tcarrierName: ${carrierName}`,
    `\n\t\tfreightForwarderName: ${freightForwarderName}`,
    `\n\t\trateID: ${rateId}`,
    `\n\t\trateName: ${rateName}`,
    `\n\t\trateType: ${rateType}`,
    `\n\t\tregion: ${region}`,
    `\n\t\tvalidFrom: ${validFrom}`,
    `\n\t\tvalidTo: ${validTo}`,
    `\n\t\tpointOfOrigin: ${pointOfOrigin}`,
    `\n\t\tpointOfDestination: ${pointOfDestination}`,
    `\n\t\ttransitTime: ${transitTime}`,
    `\n\t\troute: ${route}`,
];
exports.generalInfo = generalInfo;
const rateLineMock = (props) => props
    .map((rateLine, index) => {
    const { carrierName, freightForwarderName, rateId, rateName, rateType, region, validFrom, validTo, pointOfOrigin, pointOfDestination, route, transitTime, } = rateLine.generalInfoParams;
    return [
        `\n\t{`,
        ...exports.generalInfo(carrierName, freightForwarderName, rateId, rateName, rateType, region, validFrom, validTo, pointOfDestination, pointOfOrigin, transitTime, route),
        `\n\n\t\tfclCharges: `,
        ...fclMockObjects_1.fclBaseCharges(rateLine.fclBaseChargeParams),
        `\n\t\toceanFclHeavyRates: `,
        ...fclMockObjects_1.oceanHeavyCharges(rateLine.heavyChargeParams),
        `\n\t\toceanFclFreightFix: `,
        ...fclMockObjects_1.fclFreightFix(rateLine.oceanFclFreightFix),
        `\n\t\tlocalsOceanFclFixRates: `,
        ...fclMockObjects_1.localFreightFix(rateLine.localsOceanFclFixRates),
        `\n\t\tlocalsOceanFclContainerRates: `,
        ...fclMockObjects_1.localContainerCharges(rateLine.localContainerParams),
        `\n\t\tthcObject: `,
        ...fclMockObjects_1.thcCharges(rateLine.thcObject),
        '\n\t}',
        ...[index === props.length - 1 ? '' : ','],
    ].join('');
});
exports.rateLineMock = rateLineMock;
//# sourceMappingURL=rateLineMockObjects.js.map