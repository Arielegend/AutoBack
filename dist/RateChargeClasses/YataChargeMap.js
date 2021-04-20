"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YataChargeMap = void 0;
class YataChargeMap {
    constructor(chargesTable) {
        this.chargeMapName = 'YataCharge';
        this.chargeMap = typeof chargesTable === 'string' ?
            this.fromString(chargesTable) :
            this.getChargeMap(chargesTable);
    }
    getChargeMap(chargeTable) {
        if (typeof chargeTable === 'string')
            return JSON.parse(chargeTable);
        return new Map([
            ['percent', { percentage: chargeTable[0][0].value }],
        ]);
    }
    calcMe(shipmentDetails) {
        const applicableCharges = [];
        const yataChargeInPercent = this.getUnwrappedYataCharge();
        if (yataChargeInPercent === this.invalidChargeSetMessage())
            return this.invalidChargeSetMessage();
        const chargeParamObj = shipmentDetails.requestDetails.mandatory.getTotalCharge().totalChargesInNis.sumTotal;
        const totalPercentage = shipmentDetails
            .requestDetails
            .mandatory
            .calculatePercentCharge('YataCharge', 'Y', yataChargeInPercent, { ...shipmentDetails, chargeParamObj: chargeParamObj });
        applicableCharges.push(totalPercentage.totalChargesInNis);
        return applicableCharges;
    }
    fromString(serializedChargeMap) {
        try {
            const chargeObject = JSON.parse(serializedChargeMap);
            if (chargeObject === undefined)
                return this.invalidChargeSetMessage();
            return chargeObject;
        }
        catch (e) {
            return this.invalidChargeSetMessage();
        }
    }
    toString() {
        return typeof this.chargeMap === 'string' ?
            this.invalidChargeSetMessage() :
            JSON.stringify(Array.from(this.chargeMap));
    }
    ;
    invalidChargeSetMessage() {
        return 'Invalid Yata';
    }
    getUnwrappedYataCharge() {
        return this.chargeMap === this.invalidChargeSetMessage() ?
            this.invalidChargeSetMessage() : Array.from(this.chargeMap)[0][1].percentage;
    }
}
exports.YataChargeMap = YataChargeMap;
//# sourceMappingURL=YataChargeMap.js.map