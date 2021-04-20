"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FreightAirBaseChargeMap = void 0;
const rateUtils_1 = require("../../../Rates/rateUtils");
const ApplyingCharge_1 = require("../../../ApplyingCharges/ApplyingCharge");
const chargeUtils_1 = require("../../../ApplyingCharges/chargeUtils");
const Box_1 = require("../../../CargoUnit/Box");
/**
 * System subtypes.
 * */
class FreightAirBaseChargeMap {
    constructor(chargeTable) {
        this.chargeMapName = 'AirChargeMap';
        this.orderAirChargeByWeightKeys = () => {
            const airFreightChargeMap = this.chargeMap;
            if (airFreightChargeMap === this.invalidChargeSetMessage())
                return this.invalidChargeSetMessage();
            return Array.from(airFreightChargeMap)
                .sort(([weightA, weightRatioRuleA], [weightB, weightRatioRuleB]) => rateUtils_1.compareWeights(weightA, weightB));
        };
        this.parseWeightField = (weightLimitField) => {
            const weightValueFromField = weightLimitField.match(/^(from)?\s*(\d+(\.\d+)?)\s*kg/);
            if (!weightValueFromField)
                return this.invalidChargeSetMessage();
            return { value: weightValueFromField[2], unit: 'kg' };
        };
        this.chargeMap = typeof chargeTable === 'string' ?
            this.fromString(chargeTable) :
            this.getChargeMap(chargeTable);
    }
    getChargeMap(baseRate) {
        const ratioScalar = this.parseWeightField(baseRate[0][0].value);
        const processedBaseRate = baseRate[0]
            .slice(1)
            .map(weightCharge => {
            const weightThreshold = this.parseWeightField(weightCharge.field);
            const charge = chargeUtils_1.currencyFromString(weightCharge.value);
            if (typeof charge !== 'string' && typeof ratioScalar !== 'string') {
                const airFreightChargeMap = [
                    weightThreshold,
                    { ratio: ratioScalar.value, charge: { ...charge, mandatory: 'Y' } },
                ];
                if (airFreightChargeMap !== undefined)
                    return airFreightChargeMap;
            }
            return [this.invalidChargeSetMessage(), {}];
        });
        const validatedDeserializedRateCharge = processedBaseRate;
        const validProcessedRate = new Map(validatedDeserializedRateCharge);
        return validProcessedRate === undefined ? this.invalidChargeSetMessage() : validProcessedRate;
    }
    invalidChargeSetMessage() {
        return 'Invalid Air Freight Charge';
    }
    fromString(serializedChargeTable) {
        try {
            const chargeObject = JSON.parse(serializedChargeTable);
            const chargeMap = new Map(chargeObject);
            if (chargeMap === undefined)
                return this.invalidChargeSetMessage();
            return chargeMap;
        }
        catch (e) {
            return this.invalidChargeSetMessage();
        }
    }
    toString() {
        return typeof this.chargeMap === 'string' ?
            this.invalidChargeSetMessage() :
            JSON.stringify(Array.from(this.chargeMap.entries()));
    }
    ;
    calcMe(shipmentDetails) {
        const applicableCharges = [];
        const airFreightChargeMap = this.chargeMap;
        if (airFreightChargeMap === this.invalidChargeSetMessage())
            return this.invalidChargeSetMessage();
        const orderedCharges = this.orderAirChargeByWeightKeys();
        if (typeof orderedCharges === 'string')
            return this.invalidChargeSetMessage();
        const orderedCharge = orderedCharges[0];
        let [boxes, airRateWeight, airCharge] = this.getQuotedRateTotal(shipmentDetails.requestDetails, orderedCharge);
        /**
         *  Looking through the sorted array,
         * and returning the LAST charge in row where the weight is SMALLER or EQUAL TO than the weight rate.
         * */
        const applicableAirFreightCharge = orderedCharges
            .reduce((previousWeightCharge, currentWeightCharge) => {
            /** If only one charge, that's the one we use. (Base Case)*/
            const onlyOneCharge = orderedCharges.length === 1;
            if (onlyOneCharge)
                return previousWeightCharge;
            /** Else check if weight is larger than the requested details by max(volumeWeight, physicalWeight), */
            [boxes, airRateWeight, airCharge] =
                this.getQuotedRateTotal(shipmentDetails.requestDetails, currentWeightCharge);
            const airChargeLarger = rateUtils_1.compareWeights(currentWeightCharge[0], { value: airRateWeight.value.toString(), unit: 'kg' }) > 0;
            /** If charge weight is larger, return the previous rate. Else keep going. */
            if (airChargeLarger)
                return previousWeightCharge;
            return currentWeightCharge;
        });
        const finalAirFreightCharge = new ApplyingCharge_1.ApplyingCharge('AirChargeMap', applicableAirFreightCharge[1].charge, airCharge, { name: 'Boxes', requestDetails: shipmentDetails.requestDetails, chargeParamObj: boxes });
        if (finalAirFreightCharge === undefined)
            return this.invalidChargeSetMessage();
        finalAirFreightCharge.scaleCharge(airRateWeight.value.toString());
        applicableCharges.push(finalAirFreightCharge);
        return applicableCharges;
    }
    getQuotedRateTotal(shipmentDetails, airCharge) {
        let boxes = shipmentDetails.map(box => new Box_1.Box({
            length: box.length,
            height: box.height,
            width: box.width,
        }, box.weight, airCharge[1].ratio, box.count));
        return [
            boxes,
            boxes.map(box => rateUtils_1.massInKg(box.getQuotingWeight('kg'))).reduce((massA, massB) => massA.plus(massB)),
            airCharge,
        ];
    }
}
exports.FreightAirBaseChargeMap = FreightAirBaseChargeMap;
//# sourceMappingURL=FreightAirBaseChargeMap.js.map