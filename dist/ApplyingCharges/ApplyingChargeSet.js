"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplyingChargeSet = void 0;
const chargeUtils_1 = require("./chargeUtils");
const rateUtils_1 = require("../Rates/rateUtils");
class ApplyingChargeSet {
    constructor(localRateCharges, freightTransportCharges, originCharges) {
        this.getApplyingCurrency = (charge) => `${charge.currency} ${charge.amount}`;
        this.getTotalChargePerArray = (applyingCharges) => chargeUtils_1.reduceApplyingChargesArrayToTotal(applyingCharges);
        const local = this.getTotalChargePerArray(localRateCharges);
        this.local = local === undefined ? 'Invalid Local Charges' : local;
        if (local !== undefined) {
            if (freightTransportCharges !== undefined) {
                this.freightTransport = this.getTotalChargePerArray(freightTransportCharges);
            }
            if (originCharges !== undefined) {
                this.origin = this.getTotalChargePerArray(originCharges);
            }
        }
    }
    getTotalCharge() {
        let originCost, freightTransportCost, localCost;
        if (typeof this.local !== 'string') {
            const localMandatory = this.calculateCostPerPart(this.local.mandatory);
            const localNonMandatory = this.calculateCostPerPart(this.local.nonMandatory);
            if (localMandatory === undefined || localNonMandatory === undefined)
                return undefined;
            localCost = {
                mandatory: localMandatory,
                nonMandatory: localNonMandatory,
            };
            if (this.freightTransport !== undefined) {
                const freightTransportMandatory = this.calculateCostPerPart(this.freightTransport.mandatory);
                const freightTransportNonMandatory = this.calculateCostPerPart(this.freightTransport.nonMandatory);
                if (freightTransportMandatory === undefined || freightTransportNonMandatory === undefined)
                    return undefined;
                freightTransportCost = {
                    mandatory: freightTransportMandatory,
                    nonMandatory: freightTransportNonMandatory,
                };
            }
            if (this.origin !== undefined) {
                const originMandatory = this.calculateCostPerPart(this.origin.mandatory);
                const originNonMandatory = this.calculateCostPerPart(this.origin.nonMandatory);
                if (originMandatory === undefined || originNonMandatory === undefined)
                    return undefined;
                originCost = {
                    mandatory: originMandatory,
                    nonMandatory: originNonMandatory,
                };
            }
            return {
                freightTransportCost: freightTransportCost,
                originCost: originCost,
                localCost: localCost,
            };
        }
    }
    calculateCostPerPart(part) {
        const totalCost = part.calculateTotalCharge();
        if (totalCost === undefined)
            return undefined;
        return totalCost;
    }
    toString() {
        const totalCostPerPart = this.getTotalCharge();
        if (totalCostPerPart === undefined)
            return '';
        const { localCost, originCost, freightTransportCost } = totalCostPerPart;
        const local = { name: 'Local', charges: this.local, total: localCost };
        const origin = originCost === undefined ?
            undefined :
            { name: 'Origin', charges: this.origin, total: originCost };
        const freight = freightTransportCost === undefined ?
            undefined :
            { name: 'Freight Transport', charges: this.freightTransport, total: freightTransportCost };
        const filterUndefinedParts = [origin, freight, local].filter(part => part !== undefined);
        return filterUndefinedParts
            .map((part, index) => {
            const mandatory = part.charges.mandatory.toString();
            const nonMandatory = part.charges.nonMandatory.toString();
            const partBreakLine = index === filterUndefinedParts.length - 1 ? '' : rateUtils_1.breakLine(part.name.length) + rateUtils_1.breakLine(part.name.length);
            const mandatoryCharges = part.total.mandatory;
            const totalMandatoryCostNis = mandatoryCharges.totalChargesInNis === undefined ? '' : this.getApplyingCurrency(mandatoryCharges.totalChargesInNis.sumTotal);
            const totalMandatoryCostEur = mandatoryCharges.totalChargesInEur === undefined ? '' : this.getApplyingCurrency(mandatoryCharges.totalChargesInEur.sumTotal);
            const totalMandatoryCostUsd = mandatoryCharges.totalChargesInUsd === undefined ? '' : this.getApplyingCurrency(mandatoryCharges.totalChargesInUsd.sumTotal);
            const nonMandatoryCharges = part.total.nonMandatory;
            const totalNonMandatoryCostNis = nonMandatoryCharges.totalChargesInNis === undefined ? '' : this.getApplyingCurrency(nonMandatoryCharges.totalChargesInNis.sumTotal);
            const totalNonMandatoryCostEur = nonMandatoryCharges.totalChargesInEur === undefined ? '' : this.getApplyingCurrency(nonMandatoryCharges.totalChargesInEur.sumTotal);
            const totalNonMandatoryCostUsd = nonMandatoryCharges.totalChargesInUsd === undefined ? '' : this.getApplyingCurrency(nonMandatoryCharges.totalChargesInUsd.sumTotal);
            const mandatoryString = [totalMandatoryCostNis, totalMandatoryCostUsd, totalMandatoryCostEur].join(', ');
            const nonMandatoryString = [totalNonMandatoryCostNis, totalNonMandatoryCostEur, totalNonMandatoryCostUsd].join(', ');
            const totalCostBreakLine = rateUtils_1.breakLine(part.name.toUpperCase().length, '=');
            const totalCost = `\n${totalCostBreakLine}\nMandatory Total Cost: ${mandatoryString},\nNon Mandatory Total Cost: ${nonMandatoryString}.`;
            const mandatoryTitle = `Mandatory charges:`;
            const nonMandatoryTitle = `Non Mandatory charges:`;
            return `\n${part.name.toUpperCase()}:${totalCost}\n\n${mandatoryTitle}\n${rateUtils_1.breakLine(mandatoryTitle.length)}\n${mandatory}` +
                `\n\n${nonMandatoryTitle}\n${rateUtils_1.breakLine(nonMandatoryTitle.length)}\n${nonMandatory}\n`;
        }).join('');
    }
}
exports.ApplyingChargeSet = ApplyingChargeSet;
//# sourceMappingURL=ApplyingChargeSet.js.map