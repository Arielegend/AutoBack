"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quote = void 0;
/** Shared Map Classes.*/
const FixChargeMap_1 = require("../RateChargeClasses/FixChargeMap");
const LocalsByWeightChargeMap_1 = require("../RateChargeClasses/LocalsByWeightChargeMap");
/**
 *  Freight Transport Fob Lcl Base Charge Map Classes.
 *  */
const FreightLclBaseChargeMap_1 = require("../RateChargeClasses/BaseCharges/Fob/FreightLclBaseChargeMap");
/**
 *  Freight Transport Fob Air Base Charge Map Classes.
 *  */
const FreightAirBaseChargeMap_1 = require("../RateChargeClasses/BaseCharges/Fob/FreightAirBaseChargeMap");
const YataChargeMap_1 = require("../RateChargeClasses/YataChargeMap");
/**
 *  Freight Transport Fob Fcl Base Charge Map Classes.
 *  */
const FreightFclBaseChargeMap_1 = require("../RateChargeClasses/BaseCharges/Fob/FreightFclBaseChargeMap");
const HeavyWeightChargeMap_1 = require("../RateChargeClasses/HeavyWeightChargeMap");
/**
 * Freight Transport FobFcl Base Charge Map Classes.
 * */
const ThcChargeMap_1 = require("../RateChargeClasses/ThcChargeMap");
const LocalContainerChargeMap_1 = require("../RateChargeClasses/LocalContainerChargeMap");
/**
 *  Applying Charge Classes
 *  */
const ApplyingChargeSet_1 = require("../ApplyingCharges/ApplyingChargeSet");
const chargeUtils_1 = require("../ApplyingCharges/chargeUtils");
class Quote {
    constructor(rateLine, requestDetails) {
        this.rateLine = rateLine;
        this.quoteCharges = this.generateOffer(rateLine, requestDetails);
    }
    /** For each charge map present in a given RateLineParams,
     *  calculate total per request details charge.
     *
     *  RateLineSet Class will give you exactly what ChargeMap exists in any of the parts,
     *  (when you do JSON.parse), for each instantiate an appropriate new ChargeMap(chargeMapString)
     *  object, and do calcMe().
     *  NOTE: We will add the userDeltaUsd when iterating over all rate lines.
     * ADDITIONAL NOTE: type RequestDetails is not necessarily what need, change it if you need to.
     * */
    generateOffer(rateLine, requestDetails) {
        const { originCharges, freightTransportCharges, localCharges, ...otherRateLineParams } = rateLine;
        switch (rateLine.rateType) {
            case 'ImportFOBOCEANFCL':
                return this.fobFclOffer(freightTransportCharges, localCharges, requestDetails);
            case 'ImportFOBOCEANLCL':
                return this.fobLclOffer(freightTransportCharges, localCharges, requestDetails);
            case 'ImportFOBAIR':
                return this.fobAirOffer(freightTransportCharges, localCharges, requestDetails);
            default:
                return 'Shipment Details Are Invalid.';
        }
    }
    fobFclOffer(freightTransportCharges, localCharges, requestDetails) {
        const { fclCharges, oceanFclHeavyRates, oceanFclFreightFix } = JSON.parse(freightTransportCharges);
        const { localsOceanFclFixRates, localsOceanFclContainerRates, thcObject } = JSON.parse(localCharges);
        /** Calculating each of the freight transport charge sets. */
        const fclChargesApplied = new FreightFclBaseChargeMap_1.FreightFclBaseChargeMap(fclCharges).calcMe({ name: 'Containers', requestDetails: requestDetails.containers });
        const oceanFclHeavyRatesApplied = new HeavyWeightChargeMap_1.HeavyWeightChargesMap(oceanFclHeavyRates).calcMe({ name: 'Containers', requestDetails: requestDetails.containers });
        const oceanFclFreightFixApplied = new FixChargeMap_1.FixChargeMap(oceanFclFreightFix).calcMe();
        /** Calculating each of the local charge sets. */
        const localsOceanFclFixRatesApplied = new FixChargeMap_1.FixChargeMap(localsOceanFclFixRates).calcMe();
        const localsOceanFclContainerRatesApplied = new LocalContainerChargeMap_1.LocalContainerChargeMap(localsOceanFclContainerRates).calcMe({ name: 'Containers', requestDetails: requestDetails.containers });
        const thcChargesApplied = new ThcChargeMap_1.ThcChargeMap(thcObject).calcMe({ name: 'Containers', requestDetails: requestDetails.containers });
        /** If all return ApplyingChargeSet(localRateCharges, freightTransportCharges), */
        if (typeof fclChargesApplied !== 'string' &&
            typeof oceanFclHeavyRatesApplied !== 'string' &&
            typeof oceanFclFreightFixApplied !== 'string' &&
            typeof localsOceanFclFixRatesApplied !== 'string' &&
            typeof localsOceanFclContainerRatesApplied !== 'string' &&
            typeof thcChargesApplied !== 'string') {
            return new ApplyingChargeSet_1.ApplyingChargeSet([
                ...localsOceanFclFixRatesApplied,
                ...localsOceanFclContainerRatesApplied,
                ...thcChargesApplied,
            ], [
                ...fclChargesApplied,
                ...oceanFclHeavyRatesApplied,
                ...oceanFclFreightFixApplied
            ]);
        }
        return 'Shipment Details Are Invalid.';
    }
    fobLclOffer(freightTransportCharges, localCharges, requestDetails) {
        const { lclCharges, limits } = JSON.parse(freightTransportCharges);
        const { oceanLclLocalFix, oceanLclLocalWeight } = JSON.parse(localCharges);
        const freightLclBaseCharge = JSON.stringify(lclCharges);
        /** Calculate each part. */
        const lclChargesApplied = new FreightLclBaseChargeMap_1.FreightLclBaseChargeMap(freightLclBaseCharge).calcMe({ name: 'Boxes', requestDetails: requestDetails.boxes });
        const oceanLclLocalFixApplied = new FixChargeMap_1.FixChargeMap(oceanLclLocalFix).calcMe();
        const oceanLclLocalWeightApplied = new LocalsByWeightChargeMap_1.LocalsByWeightChargeMap(oceanLclLocalWeight).calcMe({ name: 'Boxes', requestDetails: requestDetails.boxes });
        /** If all charges in ApplyingCharges[] list are all valid, */
        if (typeof oceanLclLocalFixApplied !== 'string' &&
            typeof oceanLclLocalWeightApplied !== 'string' &&
            typeof lclChargesApplied !== 'string') {
            /** If all return ApplyingChargeSet(localRateCharges, freightTransportCharges), */
            return new ApplyingChargeSet_1.ApplyingChargeSet([
                ...oceanLclLocalWeightApplied,
                ...oceanLclLocalFixApplied,
            ], lclChargesApplied);
        }
        /** Otherwise, return the details are invalid.
         * TODO handle error managment.
         * */
        return 'Shipment Details Are Invalid.';
    }
    fobAirOffer(freightTransportCharges, localCharges, requestDetails) {
        const { airFobCharges, limits } = JSON.parse(freightTransportCharges);
        const { airLocalsFix, airLocalsByWeight, yata } = JSON.parse(localCharges);
        const freightAirBaseChargeMap = new FreightAirBaseChargeMap_1.FreightAirBaseChargeMap(airFobCharges);
        const airFreightChargesApplied = freightAirBaseChargeMap.calcMe({ name: 'Boxes', requestDetails: requestDetails.boxes });
        const fixChargeMap = new FixChargeMap_1.FixChargeMap(airLocalsFix);
        const airLocalFixApplied = fixChargeMap.calcMe();
        const localsByWeightChargeMap = new LocalsByWeightChargeMap_1.LocalsByWeightChargeMap(airLocalsByWeight);
        const airLocalWeightApplied = localsByWeightChargeMap.calcMe({ name: 'Boxes', requestDetails: requestDetails.boxes });
        if (typeof airFreightChargesApplied === 'string')
            return 'Shipment Details Are Invalid.';
        const freightPartCostAsTotalChargeSet = chargeUtils_1.reduceApplyingChargesArrayToTotal(airFreightChargesApplied);
        if (freightPartCostAsTotalChargeSet === undefined)
            return 'Shipment Details Are Invalid.';
        const yataChargeMap = new YataChargeMap_1.YataChargeMap(yata);
        const yataCharges = yataChargeMap.calcMe({ name: 'TotalChargeSet', requestDetails: freightPartCostAsTotalChargeSet });
        if (typeof yataCharges !== 'string' &&
            typeof airLocalFixApplied !== 'string' &&
            typeof airLocalWeightApplied !== 'string') {
            return new ApplyingChargeSet_1.ApplyingChargeSet([
                ...yataCharges,
                ...airLocalFixApplied,
            ], airFreightChargesApplied);
        }
        return 'Shipment Details Are Invalid.';
    }
}
exports.Quote = Quote;
//# sourceMappingURL=Quote.js.map