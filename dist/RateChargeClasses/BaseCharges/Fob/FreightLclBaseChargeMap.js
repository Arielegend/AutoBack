"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FreightLclBaseChargeMap = void 0;
const ApplyingCharge_1 = require("../../../ApplyingCharges/ApplyingCharge");
const chargeUtils_1 = require("../../../ApplyingCharges/chargeUtils");
const Box_1 = require("../../../CargoUnit/Box");
const rateUtils_1 = require("../../../Rates/rateUtils");
class FreightLclBaseChargeMap {
    constructor(chargeRow) {
        this.chargeMapName = 'LclCharge';
        this.chargeMap = typeof (chargeRow) === 'string' ?
            this.fromString(chargeRow) :
            this.getChargeMap(chargeRow);
    }
    getChargeMap(chargeTable) {
        const deserializedCurrencyCharge = chargeUtils_1.currencyFromString(chargeTable[0][1].value);
        if (typeof deserializedCurrencyCharge === 'string')
            return this.invalidChargeSetMessage();
        if (deserializedCurrencyCharge.currency !== chargeTable[0][1].currencyType)
            return this.invalidChargeSetMessage();
        return new Map([
            ['perTon', {
                    charge: {
                        amount: deserializedCurrencyCharge.amount,
                        currency: chargeTable[0][1].currencyType,
                        mandatory: 'Y',
                    },
                    ratio: chargeTable[0][0].value,
                }],
        ]);
    }
    fromString(charge) {
        const chargeObject = JSON.parse(charge);
        const parsedObject = JSON.parse(chargeObject);
        return new Map(parsedObject);
    }
    invalidChargeSetMessage() {
        return 'Invalid LCL Base Charge';
    }
    toString() {
        return typeof this.chargeMap === 'string' ?
            this.invalidChargeSetMessage() :
            JSON.stringify(Array.from(this.chargeMap.entries()));
    }
    ;
    calcMe(shipmentDetails) {
        if (shipmentDetails !== undefined) {
            const applicableCharges = [];
            const lclChargeMap = this.chargeMap;
            if (this.invalidChargeSetMessage() === lclChargeMap)
                return this.invalidChargeSetMessage();
            const applyingRateCharge = Array.from(lclChargeMap.entries())[0][1];
            const ratio = applyingRateCharge.ratio;
            const boxes = shipmentDetails
                .requestDetails
                .map(box => new Box_1.Box({
                length: box.length,
                height: box.height,
                width: box.width,
            }, box.weight, ratio, box.count));
            // const areWithinLimits = boxes.map(box => box.isWithinRateLimits(limitSize, limitWeight));
            const scalarInTons = boxes.map(box => rateUtils_1.massInKg(box.getQuotingWeight('ton'))).reduce((massA, massB) => massA.plus(massB)).value
                .toString();
            const charge = applyingRateCharge.charge;
            const lclCharge = new ApplyingCharge_1.ApplyingCharge('LclCharge', charge, ['perTon', applyingRateCharge], { ...shipmentDetails, chargeParamObj: boxes });
            lclCharge.scaleCharge(scalarInTons);
            const applyingCharge = lclCharge;
            if (applyingCharge === undefined)
                return this.invalidChargeSetMessage();
            applicableCharges.push(applyingCharge);
            return applicableCharges;
        }
        return this.invalidChargeSetMessage();
    }
}
exports.FreightLclBaseChargeMap = FreightLclBaseChargeMap;
//# sourceMappingURL=FreightLclBaseChargeMap.js.map