"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThcChargeMap = void 0;
const ApplyingCharge_1 = require("../ApplyingCharges/ApplyingCharge");
const chargeUtils_1 = require("../ApplyingCharges/chargeUtils");
const Container_1 = require("../CargoUnit/Container");
class ThcChargeMap {
    constructor(chargeTable) {
        this.chargeMapName = 'ThcCharge';
        this.chargeMap = typeof chargeTable === 'string' ?
            this.fromString(chargeTable) :
            this.getChargeMap(chargeTable);
    }
    fromString(serializedChargeMap) {
        try {
            const chargeObject = JSON.parse(serializedChargeMap);
            const undefinedAsTableOrMap = chargeObject === undefined ||
                new Map(chargeObject) === undefined;
            if (undefinedAsTableOrMap)
                return this.invalidChargeSetMessage();
            return chargeObject[0][0].field === 'DV20' ?
                this.getChargeMap(chargeObject) :
                new Map(chargeObject);
        }
        catch (e) {
            return this.invalidChargeSetMessage();
        }
    }
    getChargeMap(chargeTable) {
        const thc20FormInputValue = chargeTable[0][0].value;
        const thc20Charge = chargeUtils_1.currencyFromString(thc20FormInputValue);
        const thc40FormInputValue = chargeTable[1][0].value;
        const thc40Charge = chargeUtils_1.currencyFromString(thc40FormInputValue);
        if (typeof thc20Charge !== 'string' && typeof thc40Charge !== 'string') {
            return new Map([
                ['DV20', { charge: { ...thc20Charge, mandatory: 'Y' }, container: 'DV20' }],
                ['DV40', { charge: { ...thc40Charge, mandatory: 'Y' }, container: 'DV40' }],
            ]);
        }
        return this.invalidChargeSetMessage();
    }
    invalidChargeSetMessage() {
        return 'Invalid THC Charge.';
    }
    toString() {
        return typeof this.chargeMap === 'string' ?
            this.invalidChargeSetMessage() :
            JSON.stringify(Array.from(this.chargeMap.entries()));
    }
    ;
    calcMe(containers) {
        const applicableCharges = [];
        const chargeMap = this.chargeMap;
        if (chargeMap === this.invalidChargeSetMessage())
            return this.invalidChargeSetMessage();
        const thc20ChargeLine = Array.from(chargeMap.entries()).find(charge => charge[0] === 'DV20');
        const thc40ChargeLine = Array.from(chargeMap.entries()).find(charge => charge[0] === 'DV40');
        if (thc20ChargeLine === undefined || thc40ChargeLine === undefined)
            return this.invalidChargeSetMessage();
        else {
            containers.requestDetails.forEach((container) => {
                switch (container.containerType) {
                    case 'DV20':
                        const thc20ApplyingCharge = new ApplyingCharge_1.ApplyingCharge('ThcCharge', thc20ChargeLine[1].charge, thc20ChargeLine, { name: 'Containers', requestDetails: [container], chargeParamObj: [new Container_1.Container(container.containerType, container.weight, container.count)] });
                        thc20ApplyingCharge.scaleCharge(container.count);
                        applicableCharges.push(thc20ApplyingCharge);
                        break;
                    case 'DV40':
                        const thc40ApplyingCharge = new ApplyingCharge_1.ApplyingCharge('ThcCharge', thc20ChargeLine[1].charge, thc40ChargeLine, { name: 'Containers', requestDetails: [container], chargeParamObj: [new Container_1.Container(container.containerType, container.weight, container.count)] });
                        thc40ApplyingCharge.scaleCharge(container.count);
                        applicableCharges.push(thc40ApplyingCharge);
                        break;
                }
            });
            return applicableCharges;
        }
    }
}
exports.ThcChargeMap = ThcChargeMap;
//# sourceMappingURL=ThcChargeMap.js.map