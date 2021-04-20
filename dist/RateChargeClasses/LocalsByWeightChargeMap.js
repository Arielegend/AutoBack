"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalsByWeightChargeMap = void 0;
const rateUtils_1 = require("../Rates/rateUtils");
const ApplyingCharge_1 = require("../ApplyingCharges/ApplyingCharge");
const chargeUtils_1 = require("../ApplyingCharges/chargeUtils");
const Box_1 = require("../CargoUnit/Box");
class LocalsByWeightChargeMap {
    constructor(chargeTable) {
        this.chargeMapName = 'WeightRulesCharges';
        this.chargeMap = typeof chargeTable === 'string' ?
            this.fromString(chargeTable) :
            this.getChargeMap(chargeTable);
    }
    fromString(serializedChargeTable) {
        try {
            const chargeObject = JSON.parse(serializedChargeTable);
            return typeof chargeObject[0][0] === 'string' ?
                new Map(chargeObject) :
                this.getChargeMap(chargeObject);
        }
        catch (e) {
            return this.invalidChargeSetMessage();
        }
    }
    getChargeMap(chargeMap) {
        const chargeMapEntries = chargeMap.map((localWeightCharge) => {
            const deserializedChargeAmount = chargeUtils_1.currencyFromString(localWeightCharge[3].value);
            if (typeof deserializedChargeAmount === 'string')
                return [false, false];
            return [
                localWeightCharge[1].value,
                {
                    ratio: localWeightCharge[2].value,
                    charge: {
                        amount: deserializedChargeAmount.amount,
                        currency: localWeightCharge[3].currencyType,
                        mandatory: localWeightCharge[4].value,
                    },
                },
            ];
        });
        if (chargeMapEntries.every(([chargeName, weightRatioRule]) => chargeName && weightRatioRule)) {
            const localsByWeightCharges = new Map(chargeMapEntries);
            if (localsByWeightCharges !== undefined) {
                return localsByWeightCharges;
            }
        }
        return this.invalidChargeSetMessage();
    }
    invalidChargeSetMessage() {
        return 'Invalid Locals By Weight ChargeSet.';
    }
    toString() {
        return typeof this.chargeMap === 'string' ?
            this.invalidChargeSetMessage() :
            JSON.stringify(Array.from(this.chargeMap.entries()));
    }
    calcMe(shipmentDetails) {
        const applicableCharges = [];
        if (typeof this.chargeMap === 'string')
            return this.invalidChargeSetMessage();
        const localsByWeightCharges = this.chargeMap.entries();
        let nextLocalWeightCharge = localsByWeightCharges.next();
        while (!nextLocalWeightCharge.done) {
            const [chargeName, localWeightChargeObj] = nextLocalWeightCharge.value;
            const boxes = shipmentDetails.requestDetails
                .map(box => new Box_1.Box({
                length: box.length,
                height: box.height,
                width: box.width,
            }, box.weight, localWeightChargeObj.ratio, box.count));
            const weightValueToScale = boxes.map(box => rateUtils_1.massInKg(box.getQuotingWeight('kg'))).reduce((massA, massB) => massA.plus(massB)).value
                .toString();
            /** Getting the weight to be used in the calculations. */
            /** Applying the weight to the local charge per weight. */
            const applicableCharge = new ApplyingCharge_1.ApplyingCharge('WeightRulesCharges', localWeightChargeObj.charge, [chargeName, localWeightChargeObj], { name: 'Boxes', requestDetails: shipmentDetails.requestDetails, chargeParamObj: boxes });
            applicableCharge.scaleCharge(weightValueToScale);
            /** Returning the charge to be used. */
            const charge = applicableCharge;
            /** If charge is undefined return error message. */
            if (charge === undefined)
                return this.invalidChargeSetMessage();
            /** Otherwise, push the charge into the array. */
            applicableCharges.push(charge);
            /** Move rate iterator to next charge. */
            nextLocalWeightCharge = localsByWeightCharges.next();
        }
        return applicableCharges;
    }
}
exports.LocalsByWeightChargeMap = LocalsByWeightChargeMap;
//# sourceMappingURL=LocalsByWeightChargeMap.js.map