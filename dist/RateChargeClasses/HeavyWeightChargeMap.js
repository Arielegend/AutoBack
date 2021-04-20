"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeavyWeightChargesMap = void 0;
const rateUtils_1 = require("../Rates/rateUtils");
const ApplyingCharge_1 = require("../ApplyingCharges/ApplyingCharge");
const chargeUtils_1 = require("../ApplyingCharges/chargeUtils");
const Container_1 = require("../CargoUnit/Container");
/**
 * System subtypes.
 * */
class HeavyWeightChargesMap {
    constructor(chargeTable) {
        this.chargeMapName = 'HeavyWeightCharges';
        this.chargeMap = typeof chargeTable === 'string' ?
            this.fromString(chargeTable) :
            this.getChargeMap(chargeTable);
    }
    getChargeMap(freightTransportRateObject) {
        const chargeMapEntries = freightTransportRateObject
            .map((heavyWeightCharge) => {
            const weight = heavyWeightCharge[1];
            const tableInputCharge = heavyWeightCharge[2];
            const charge = chargeUtils_1.currencyFromString(tableInputCharge.value);
            if (typeof charge === 'string')
                return [false, false];
            if (charge.currency !== tableInputCharge.currencyType)
                return [false, false];
            const weightValue = weight.value.replace(/ ton/, '');
            return [
                { value: weightValue, unit: 'ton' },
                {
                    charge: {
                        amount: charge.amount,
                        currency: charge.currency,
                        mandatory: 'Y',
                    },
                },
            ];
        });
        if (chargeMapEntries.every(([weight, charge]) => weight && charge)) {
            const heavyWeightChargeMap = new Map(chargeMapEntries);
            if (heavyWeightChargeMap !== undefined) {
                return heavyWeightChargeMap;
            }
        }
        return this.invalidChargeSetMessage();
    }
    fromString(serializedChargeMap) {
        try {
            const chargeObject = JSON.parse(serializedChargeMap);
            const undefinedAsTableOrMap = chargeObject === undefined ||
                new Map(chargeObject) === undefined;
            if (undefinedAsTableOrMap)
                return this.invalidChargeSetMessage();
            return typeof chargeObject[0][0].unit === 'string' ?
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
    invalidChargeSetMessage() {
        return 'Invalid Heavy Weight ChargeSet.';
    }
    calcMe(containers) {
        const chargeMap = this.chargeMap;
        if (typeof chargeMap !== 'string') {
            return containers.requestDetails
                // for each container we iterate for the chargemap set, exctracting its charge value...
                .map(container => this.getChargeForContainer(container, chargeMap))
                .map((charge) => {
                const containerChargesToApply = [];
                const applyingHeavyContainerCharge = new ApplyingCharge_1.ApplyingCharge('HeavyWeightCharges', charge.applyingCharge, charge.containerCharge, {
                    name: 'Containers',
                    requestDetails: [charge.container],
                    chargeParamObj: [new Container_1.Container(charge.container.containerType, charge.container.weight, charge.container.count)],
                });
                applyingHeavyContainerCharge.scaleCharge(charge.container.count);
                containerChargesToApply.push(applyingHeavyContainerCharge);
                return containerChargesToApply;
            }).flat();
        }
        return this.invalidChargeSetMessage();
    }
    getChargeForContainer(container, chargeMap) {
        const chargesIterator = chargeMap.entries();
        let nextCharge = chargesIterator.next();
        let applyingCharge = nextCharge.value[1];
        let rateCharge = nextCharge.value;
        while (!nextCharge.done && rateUtils_1.weightBge(container.weight, nextCharge.value[0])) {
            applyingCharge = nextCharge.value[1];
            rateCharge = nextCharge.value;
            nextCharge = chargesIterator.next();
        }
        return {
            applyingCharge: {
                currency: applyingCharge.charge.currency,
                amount: applyingCharge.charge.amount,
                mandatory: 'Y',
            },
            containerCharge: rateCharge,
            container: container,
        };
    }
}
exports.HeavyWeightChargesMap = HeavyWeightChargesMap;
//# sourceMappingURL=HeavyWeightChargeMap.js.map