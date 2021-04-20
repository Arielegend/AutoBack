"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalContainerChargeMap = void 0;
const ApplyingCharge_1 = require("../ApplyingCharges/ApplyingCharge");
const chargeUtils_1 = require("../ApplyingCharges/chargeUtils");
const Container_1 = require("../CargoUnit/Container");
class LocalContainerChargeMap {
    constructor(chargeTable) {
        this.chargeMapName = 'LocalContainerCharges';
        this.chargeMap = typeof chargeTable === 'string' ?
            this.fromString(chargeTable) :
            this.getChargeMap(chargeTable);
    }
    getChargeMap(chargeTable) {
        const chargeMapEntries = chargeTable
            .map((localContainerRates) => {
            const localContainerRuleName = localContainerRates[1].value;
            const charge = localContainerRates[2];
            const deserializedCharge = chargeUtils_1.currencyFromString(charge.value);
            if (typeof deserializedCharge === 'string')
                return [false, false];
            if (deserializedCharge.currency !== charge.currencyType)
                return [false, false];
            const mandatory = localContainerRates[3].value;
            const containerType = localContainerRates[4].value;
            return [
                localContainerRuleName,
                {
                    charge: {
                        amount: deserializedCharge.amount,
                        currency: deserializedCharge.currency,
                        mandatory: mandatory,
                    },
                    container: containerType,
                },
            ];
        });
        if (chargeMapEntries.every(([chargeName, containerCharge]) => chargeName && containerCharge)) {
            const localContainerChargeMap = new Map(chargeMapEntries);
            if (localContainerChargeMap !== undefined) {
                return localContainerChargeMap;
            }
        }
        return this.invalidChargeSetMessage();
    }
    fromString(serializedChargeTable) {
        try {
            const chargeObject = JSON.parse(serializedChargeTable);
            if (chargeObject === undefined ||
                new Map(chargeObject) === undefined) {
                return this.invalidChargeSetMessage();
            }
            return typeof chargeObject[0][0] === 'object' ?
                this.getChargeMap(chargeObject) :
                new Map(chargeObject);
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
    invalidChargeSetMessage() {
        return 'Invalid Locals By Container ChargeSet.';
    }
    calcMe(shipmentDetails) {
        const applicableCharges = [];
        const fixChargeMap = this.chargeMap;
        if (fixChargeMap === 'Invalid Locals By Container ChargeSet.')
            return this.invalidChargeSetMessage();
        const fixChargeIterator = fixChargeMap.entries();
        let currentCharge = fixChargeIterator.next();
        while (!currentCharge.done) {
            const [containerChargeName, containerCharge] = currentCharge.value;
            if (containerCharge !== undefined) {
                const containerDetailsIter = shipmentDetails.requestDetails.entries();
                let currentContainerSet = containerDetailsIter.next();
                while (!currentContainerSet.done) {
                    const [name, container] = currentContainerSet.value;
                    if (containerCharge.container === container.containerType) {
                        const rateCharge = [containerChargeName, containerCharge];
                        const applyingLocalContainerCharge = new ApplyingCharge_1.ApplyingCharge('LocalContainerCharges', {
                            currency: containerCharge.charge.currency,
                            amount: containerCharge.charge.amount,
                            mandatory: 'Y',
                        }, rateCharge, {
                            name: 'Containers',
                            requestDetails: [container],
                            chargeParamObj: [new Container_1.Container(container.containerType, container.weight, container.count)],
                        });
                        applyingLocalContainerCharge.scaleCharge(container.count);
                        applicableCharges.push(applyingLocalContainerCharge);
                    }
                    currentContainerSet = containerDetailsIter.next();
                }
            }
            currentCharge = fixChargeIterator.next();
        }
        return applicableCharges;
    }
}
exports.LocalContainerChargeMap = LocalContainerChargeMap;
//# sourceMappingURL=LocalContainerChargeMap.js.map