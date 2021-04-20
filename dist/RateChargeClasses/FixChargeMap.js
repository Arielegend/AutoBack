"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixChargeMap = void 0;
const ApplyingCharge_1 = require("../ApplyingCharges/ApplyingCharge");
const chargeUtils_1 = require("../ApplyingCharges/chargeUtils");
/**
 * Charge Parameters to be multiplying with the unit charge.
 * TODO: write full explanation.
 * */
class FixChargeMap {
    constructor(chargesTable) {
        this.chargeMapName = 'FixCharges';
        this.chargeMap = typeof chargesTable === 'string' ?
            this.fromString(chargesTable) :
            this.getChargeMap(chargesTable);
    }
    fromString(serializedChargeMap) {
        try {
            const chargeObject = JSON.parse(serializedChargeMap);
            const notATableOrAMap = chargeObject === undefined ||
                new Map(chargeObject) === undefined;
            if (notATableOrAMap)
                return this.invalidChargeSetMessage();
            return typeof chargeObject[0][0] === 'string' ?
                new Map(chargeObject) :
                this.getChargeMap(chargeObject);
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
    getChargeMap(chargeTable) {
        const fixCharges = chargeTable
            .map((fixCharge) => {
            const currencyString = chargeUtils_1.currencyFromString(fixCharge[2].value);
            if (typeof currencyString !== 'string') {
                return [
                    fixCharge[1].value,
                    {
                        charge: {
                            amount: currencyString.amount,
                            currency: fixCharge[2].currencyType,
                            mandatory: fixCharge[3].value,
                        },
                    },
                ];
            }
            else {
                return undefined;
            }
        });
        if (fixCharges.every(charge => charge !== undefined)) {
            return new Map(fixCharges);
        }
        return this.invalidChargeSetMessage();
    }
    invalidChargeSetMessage() {
        return 'Invalid Fix ChargeSet.';
    }
    calcMe() {
        const applicableCharges = [];
        if (this.chargeMap === this.invalidChargeSetMessage())
            return this.invalidChargeSetMessage();
        const chargesIterator = this.chargeMap.entries();
        let nextCharge = chargesIterator.next();
        while (!nextCharge.done) {
            const [chargeName, chargeObj] = nextCharge.value;
            applicableCharges.push(new ApplyingCharge_1.ApplyingCharge('FixCharges', chargeObj.charge, [chargeName, chargeObj]));
            nextCharge = chargesIterator.next();
        }
        return applicableCharges.length === 0 ? this.invalidChargeSetMessage() : applicableCharges;
    }
}
exports.FixChargeMap = FixChargeMap;
//# sourceMappingURL=FixChargeMap.js.map