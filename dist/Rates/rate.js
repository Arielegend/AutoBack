"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLineSet = void 0;
const FixChargeMap_1 = require("../RateChargeClasses/FixChargeMap");
const HeavyWeightChargeMap_1 = require("../RateChargeClasses/HeavyWeightChargeMap");
const LocalContainerChargeMap_1 = require("../RateChargeClasses/LocalContainerChargeMap");
const LocalsByWeightChargeMap_1 = require("../RateChargeClasses/LocalsByWeightChargeMap");
const FreightFclBaseChargeMap_1 = require("../RateChargeClasses/BaseCharges/Fob/FreightFclBaseChargeMap");
const FreightLclBaseChargeMap_1 = require("../RateChargeClasses/BaseCharges/Fob/FreightLclBaseChargeMap");
const FreightAirBaseChargeMap_1 = require("../RateChargeClasses/BaseCharges/Fob/FreightAirBaseChargeMap");
const ThcChargeMap_1 = require("../RateChargeClasses/ThcChargeMap");
const chargeUtils_1 = require("../ApplyingCharges/chargeUtils");
const YataChargeMap_1 = require("../RateChargeClasses/YataChargeMap");
class RateLineSet {
    constructor(rateSubmission) {
        this.invalidChargeSetMessage = (chargeSet) => {
            return `Invalid ${chargeSet} ChargeSet.`;
        };
        this.rateProcessing = (rateSubmission) => {
            const { freightTransportRatesObject, localRatesObject, originRatesObject, ...generalInfo } = rateSubmission;
            /*const originRatesObject = originRates === undefined ? "" : JSON.parse(originRates);*/
            //
            switch (rateSubmission.rateType) {
                case 'ImportFOBOCEANFCL':
                    return this.fclChargesProcessing({
                        localRatesObject,
                        freightTransportRatesObject,
                        ...generalInfo,
                    });
                case 'ImportFOBOCEANLCL':
                    return this.lclChargesProcessing({
                        localRatesObject,
                        freightTransportRatesObject,
                        ...generalInfo,
                    });
                case 'ImportFOBAIR':
                    return this.airChargesProcessing({
                        localRatesObject,
                        freightTransportRatesObject,
                        ...generalInfo,
                    });
                case 'ImportEXWAIR':
                    return 'Invalid Rate Submission.';
                case 'ImportEXWOCEANFCL':
                    return 'Invalid Rate Submission.';
                case 'ImportEXWOCEANLCL':
                    return 'Invalid Rate Submission.';
                default:
                    return 'Invalid Rate Submission.';
            }
        };
        /** FCL Charges Processing */
        this.fclChargesProcessing = (fclFormSubmission) => {
            const { localRatesObject, freightTransportRatesObject, ...generalInfo } = fclFormSubmission;
            const oceanFclBaseRates = JSON.parse(freightTransportRatesObject.oceanFCLTable);
            const oceanFclHeavyRates = new HeavyWeightChargeMap_1.HeavyWeightChargesMap(freightTransportRatesObject.oceanFCLHEAVY);
            const oceanFclFreightFix = new FixChargeMap_1.FixChargeMap(freightTransportRatesObject.oceanFCLFreightFix);
            const localsOceanFclContainerRates = new LocalContainerChargeMap_1.LocalContainerChargeMap(localRatesObject.LocalsOceanFCLByContainerTypeTable);
            const thc20 = localRatesObject.thc20;
            const thc40 = localRatesObject.thc40;
            const localsOceanFclFixRates = new FixChargeMap_1.FixChargeMap(localRatesObject.LocalsOceanFCLFixTable);
            const fclCharges = this.getFclCharges({
                generalInfo,
                oceanFclBaseRates,
                oceanFclHeavyRates,
                oceanFclFreightFix,
                localsOceanFclFixRates,
                localsOceanFclContainerRates,
                thc20: thc20,
                thc40: thc40,
            });
            return fclCharges === undefined
                ? this.invalidChargeSetMessage('FCL')
                : fclCharges;
        };
        /** LCL Charges Processing*/
        this.lclChargesProcessing = (lclFormSubmission) => {
            const { localRatesObject, freightTransportRatesObject, ...generalInfo } = lclFormSubmission;
            /* freight transport part is rates, limits, ratio */
            const oceanLclBaseRates = JSON.parse(freightTransportRatesObject.oceanLCLTable);
            const limits = {
                limitHeightShipment: freightTransportRatesObject.limitHeightShipment,
                limitWeightShipment: freightTransportRatesObject.limitWeightShipment,
                limitWeightBox: freightTransportRatesObject.limitWeightBox,
            };
            const freightPartLclRatio = freightTransportRatesObject.oceanLCLRateRatio;
            // local part is FixTable, WeightTable
            const oceanLclLocalFix = new FixChargeMap_1.FixChargeMap(localRatesObject.FixedRules);
            const oceanLclLocalWeight = new LocalsByWeightChargeMap_1.LocalsByWeightChargeMap(localRatesObject.localsLclByWeightTable);
            const lclCharges = this.getLclCharges({
                generalInfo,
                oceanLclBaseRates,
                limits,
                freightPartLclRatio,
                oceanLclLocalFix,
                oceanLclLocalWeight,
            });
            return lclCharges === undefined
                ? this.invalidChargeSetMessage('LCL')
                : lclCharges;
        };
        /** Air Charges Processing*/
        this.airChargesProcessing = (rateSubmission) => {
            const { freightTransportRatesObject, localRatesObject, originRatesObject, ...generalInfo } = rateSubmission;
            const limits = {
                limitHeightShipment: JSON.parse(freightTransportRatesObject.airLimits).limitHeightShipment,
                limitWeightShipment: JSON.parse(freightTransportRatesObject.airLimits).limitWeightShipment,
                limitWeightBox: JSON.parse(freightTransportRatesObject.airLimits).limitWeightBox,
            };
            const freightPartAirRatio = freightTransportRatesObject.airRatio;
            const airLocalsFix = new FixChargeMap_1.FixChargeMap(localRatesObject.LocalsAirFixTable);
            const airLocalsByWeight = new LocalsByWeightChargeMap_1.LocalsByWeightChargeMap(localRatesObject.LocalsAirByWeightTable);
            const yata = {
                percentage: localRatesObject.yata,
            };
            const airBaseRates = JSON.parse(freightTransportRatesObject.airTable);
            const airChargesProcessed = this.getAirCharges({
                generalInfo,
                airBaseRates,
                limits,
                freightPartAirRatio,
                airLocalsFix,
                airLocalsByWeight,
                yata,
            });
            if (typeof airChargesProcessed === 'string') {
                return this.invalidChargeSetMessage('Air');
            }
            return airChargesProcessed === undefined
                ? this.invalidChargeSetMessage('Air')
                : airChargesProcessed;
        };
        this.getAirCharges = (cleanedUpFOBAirFormSubmission) => {
            const { airBaseRates, limits, freightPartAirRatio, airLocalsFix, airLocalsByWeight, yata, ...generalInfo } = cleanedUpFOBAirFormSubmission;
            const airBaseCharges = airBaseRates
                .map((baseRate) => {
                const portFrom = baseRate[1].value;
                const portTo = 'TLV';
                const route = baseRate[2].value;
                const transitTime = (baseRate[3].value + ` ${baseRate[3].fieldType}`);
                /*const minWeight = baseRate[4].value as string;*/
                const slicedAtCharges = baseRate.slice(4);
                const airFobCharges = new FreightAirBaseChargeMap_1.FreightAirBaseChargeMap([
                    [{ field: 'ratio', value: freightPartAirRatio }, ...slicedAtCharges],
                ]);
                const yataChargeMap = new YataChargeMap_1.YataChargeMap([[{ field: 'yata', value: yata.percentage }]]).toString();
                return {
                    ...generalInfo.generalInfo,
                    pointOfOrigin: portFrom,
                    pointOfDestination: portTo,
                    transitTime,
                    route,
                    freightTransportCharges: JSON.stringify({
                        airFobCharges: airFobCharges.toString(),
                        limits: limits,
                    }),
                    localCharges: JSON.stringify({
                        airLocalsFix: airLocalsFix.toString(),
                        airLocalsByWeight: airLocalsByWeight.toString(),
                        yata: yataChargeMap,
                    }),
                    originCharges: '',
                };
            });
            return airBaseCharges === undefined ?
                this.invalidChargeSetMessage('Air') :
                airBaseCharges;
        };
        this.rateChargesPerPointOfOrigin = this.rateProcessing(rateSubmission);
    }
    static getThcAsPickGridElement(thc20, thc40) {
        let thc20Charge = chargeUtils_1.currencyFromString(thc20);
        let thc40Charge = chargeUtils_1.currencyFromString(thc40);
        const invalidThcCharges = thc20Charge === 'Error: Invalid Currency Construction.' && thc40Charge === 'Error: Invalid Currency Construction.';
        return invalidThcCharges ?
            'Error: Invalid Currency Construction.' : [
            [{ field: 'thc20', value: thc20 }],
            [{ field: 'thc40', value: thc40 }],
        ];
    }
    getFclCharges(cleanedUpFcLFormSubmissions) {
        const { generalInfo, oceanFclBaseRates, oceanFclHeavyRates, oceanFclFreightFix, localsOceanFclFixRates, localsOceanFclContainerRates, thc20, thc40, } = cleanedUpFcLFormSubmissions;
        return oceanFclBaseRates.map((baseRate) => {
            const fclChargesObject = new FreightFclBaseChargeMap_1.FreightFclBaseChargeMap([baseRate]);
            const portFrom = baseRate[1].value;
            const portTo = baseRate[2].value;
            const transitTime = (baseRate[3].value +
                ` ${baseRate[3].fieldType}`);
            const route = baseRate[4].value;
            const thc = RateLineSet.getThcAsPickGridElement(thc20, thc40);
            const thcObject = new ThcChargeMap_1.ThcChargeMap(thc);
            return {
                ...generalInfo,
                originCharges: '',
                pointOfOrigin: portFrom,
                pointOfDestination: portTo,
                transitTime,
                route,
                freightTransportCharges: JSON.stringify({
                    fclCharges: fclChargesObject.toString(),
                    oceanFclHeavyRates: oceanFclHeavyRates.toString(),
                    oceanFclFreightFix: oceanFclFreightFix.toString(),
                }),
                localCharges: JSON.stringify({
                    localsOceanFclFixRates: localsOceanFclFixRates.toString(),
                    localsOceanFclContainerRates: localsOceanFclContainerRates.toString(),
                    thcObject: thcObject.toString(),
                }),
            };
        });
    }
    getLclCharges(cleanedUpLcLFormSubmissions) {
        const { generalInfo, oceanLclBaseRates, limits, freightPartLclRatio, oceanLclLocalFix, oceanLclLocalWeight, } = cleanedUpLcLFormSubmissions;
        return oceanLclBaseRates.map((baseRate) => {
            const mainFobPart = new FreightLclBaseChargeMap_1.FreightLclBaseChargeMap([
                [{ field: 'ratio', value: freightPartLclRatio }, ...baseRate.slice(5)],
            ]);
            const portFrom = baseRate[1].value;
            const portTo = baseRate[2].value;
            const transitTime = baseRate[3].value;
            const route = baseRate[4].value;
            return {
                ...generalInfo,
                originCharges: '',
                pointOfOrigin: portFrom,
                pointOfDestination: portTo,
                transitTime,
                route,
                freightTransportCharges: JSON.stringify({
                    lclCharges: mainFobPart.toString(),
                    limits: limits,
                }),
                localCharges: JSON.stringify({
                    oceanLclLocalFix: oceanLclLocalFix.toString(),
                    oceanLclLocalWeight: oceanLclLocalWeight.toString(),
                }),
            };
        });
    }
    toString() {
        if (typeof this.rateChargesPerPointOfOrigin !== 'string') {
            const rateLineStrArray = this.rateChargesPerPointOfOrigin
                .map(rateLine => {
                const { originCharges, freightTransportCharges, localCharges, ...generalInfo } = rateLine;
                const generalInfoStr = Object.entries(generalInfo)
                    .map(([key, value]) => {
                    return `\n\t\t${key}: ${value}`;
                }).join('');
                const chargeStrArr = [freightTransportCharges, localCharges]
                    .map(chargePart => {
                    const chargeObj = JSON.parse(chargePart);
                    const chargeObjectEntries = Object.entries(chargeObj);
                    const chargeStr = chargeObjectEntries
                        .map(([key, chargeClassStr]) => {
                        if (typeof chargeClassStr === 'string') {
                            const chargeObjEntries = JSON.parse(chargeClassStr);
                            return `\n\t\t${key}: ${chargeObjEntries
                                .map(this.keyValueString()).join('')}`;
                        }
                        if (typeof chargeClassStr === 'object' && chargeClassStr !== null) {
                            return `\n\t\t${key}: ${Object.entries(chargeClassStr)
                                .map(this.keyValueString()).join('')}`;
                        }
                    });
                    return chargeStr.join('');
                }).join('');
                return `\n\t\{\n${generalInfoStr}\n${chargeStrArr}\n\t\}`;
            });
            return `[${rateLineStrArray.join(',')}\n]`;
        }
        return this.rateChargesPerPointOfOrigin;
    }
    keyValueString() {
        return ([key, value]) => `\n\t\t\t[${JSON.stringify(key)},${JSON.stringify(value)}]`;
    }
}
exports.RateLineSet = RateLineSet;
//# sourceMappingURL=Rate.js.map