"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FreightFclBaseChargeMap = void 0;
const ApplyingCharge_1 = require("../../../ApplyingCharges/ApplyingCharge");
const chargeUtils_1 = require("../../../ApplyingCharges/chargeUtils");
const Container_1 = require("../../../CargoUnit/Container");
class FreightFclBaseChargeMap {
    constructor(baseRate) {
        this.chargeMapName = 'FclCharge';
        this.chargeMap = typeof baseRate === 'string' ?
            this.fromString(baseRate) :
            this.getChargeMap(baseRate);
    }
    getChargeMap(chargeTable) {
        const freightLclChargeMapEntries = chargeTable[0]
            .slice(5)
            .map((containerCharge) => {
            const deserializedCurrencyCharge = chargeUtils_1.currencyFromString(containerCharge.value);
            if (typeof deserializedCurrencyCharge === 'string')
                return [false, false];
            if (deserializedCurrencyCharge.currency !== containerCharge.currencyType)
                return [false, false];
            return [
                containerCharge.field,
                {
                    charge: {
                        amount: deserializedCurrencyCharge.amount,
                        currency: deserializedCurrencyCharge.currency,
                        mandatory: 'Y',
                    },
                    container: containerCharge.field,
                },
            ];
        });
        if (freightLclChargeMapEntries.every(([container, charge]) => {
            return container && charge;
        })) {
            const freightLclChargeMapEntries1 = freightLclChargeMapEntries;
            const validFreightFclMainCharge = new Map(freightLclChargeMapEntries1);
            if (validFreightFclMainCharge !== undefined || validFreightFclMainCharge !== undefined) {
                return validFreightFclMainCharge;
            }
        }
        return this.invalidChargeSetMessage();
    }
    invalidChargeSetMessage() {
        return 'Invalid FCL ChargeSet.';
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
    calcMe(shipmentDetails) {
        const applicableCharges = [];
        //we enter this if and calc only if all types are covered
        const chargeMap = this.chargeMap;
        if (this.rateCoversRequestedContainers(shipmentDetails.requestDetails) && chargeMap !== this.invalidChargeSetMessage()) {
            shipmentDetails.requestDetails.forEach((container) => {
                const currentContainerCharge = chargeMap.get(container.containerType);
                if (currentContainerCharge !== undefined) {
                    const containerCharge = new ApplyingCharge_1.ApplyingCharge('FclCharge', currentContainerCharge.charge, [container.containerType, currentContainerCharge], { name: 'Containers', requestDetails: [container], chargeParamObj: [new Container_1.Container(container.containerType, container.weight, container.count)] });
                    containerCharge.scaleCharge(container.count);
                    applicableCharges.push(containerCharge.getCharge() === undefined ?
                        false :
                        containerCharge);
                }
                return false;
            });
            if (applicableCharges.every(charge => charge !== false))
                this.invalidChargeSetMessage();
            return applicableCharges;
        }
        else
            return this.invalidChargeSetMessage();
    }
    //in this function we make sure this rateLine actually has a valid rate for all the needed containers types
    rateCoversRequestedContainers(containers) {
        const chargeMap = this.chargeMap;
        if (chargeMap !== this.invalidChargeSetMessage()) {
            return containers
                .map(containerDetails => containerDetails.containerType)
                .every(container => chargeMap.get(container) !== undefined);
        }
        return false;
    }
}
exports.FreightFclBaseChargeMap = FreightFclBaseChargeMap;
//# sourceMappingURL=FreightFclBaseChargeMap.js.map