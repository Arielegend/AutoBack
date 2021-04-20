"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TotalCharge = void 0;
const ApplyingCharge_1 = require("./ApplyingCharge");
const chargeUtils_1 = require("./chargeUtils");
const rateUtils_1 = require("../Rates/rateUtils");
const bigint_money_1 = require("bigint-money");
class TotalCharge {
    constructor(mandatory, total) {
        this.mandatory = mandatory;
        this.totalChargesInNis = {
            sumTotal: chargeUtils_1.zeroCharge('NIS', mandatory),
            charges: this.setZeroChargeIfEmpty('NIS', total.totalChargesInNis),
        };
        this.totalChargesInUsd = {
            sumTotal: chargeUtils_1.zeroCharge('USD', mandatory),
            charges: this.setZeroChargeIfEmpty('USD', total.totalChargesInUsd),
        };
        this.totalChargesInEur = {
            sumTotal: chargeUtils_1.zeroCharge('EUR', mandatory),
            charges: this.setZeroChargeIfEmpty('EUR', total.totalChargesInEur),
        };
    }
    getTotalCharge() {
        return {
            totalChargesInNis: this.totalChargesInNis,
            totalChargesInUsd: this.totalChargesInUsd,
            totalChargesInEur: this.totalChargesInEur,
        };
    }
    setZeroChargeIfEmpty(currency, applyingCharge) {
        return applyingCharge.length === 0 ? chargeUtils_1.totalApplyingInitialCharge(currency, this.getMandatory()) : applyingCharge;
    }
    calculatePercentCharge(percentageChargeName, mandatory, percentage, shipmentDetails) {
        const totalCharge = this.calculateTotalCharge();
        const percentageOfNis = this.applyingCurrencyChargeToMoney(totalCharge.totalChargesInNis.sumTotal)
            .multiply(percentage).divide(100);
        /*
            const percentageOfEuro = this.applyingCurrencyChargeToMoney(totalCharge.totalChargesInEur.sumTotal)
              .multiply(percentage).divide(100);
        
            const percentageOfUsd = this.applyingCurrencyChargeToMoney(totalCharge.totalChargesInUsd.sumTotal)
              .multiply(percentage).divide(100);
        */
        return {
            totalChargesInNis: new ApplyingCharge_1.ApplyingCharge(percentageChargeName, { amount: percentageOfNis.format(), currency: 'NIS', mandatory: mandatory }, ['percent', { percentage: percentage }], { ...shipmentDetails, chargeParamObj: { ...totalCharge.totalChargesInNis.sumTotal, mandatory: 'Y' } }),
        };
    }
    getTotalSum() {
        const totalSum = this.calculateTotalCharge();
        const totalAmountInNis = totalSum.totalChargesInNis;
        const totalAmountInEur = totalSum.totalChargesInEur;
        const totalAmountInUsd = totalSum.totalChargesInUsd;
        return `Total Sum Charges:\n${rateUtils_1.breakLine('Total Sum Charges:'.length)}\n\tNIS: ${totalAmountInNis}\tUSD: ${totalAmountInUsd}\tEUR: ${totalAmountInEur}\n`;
    }
    calculateTotalCharge() {
        return {
            totalChargesInNis: this.reduceChargeSum('NIS', this.mandatory, this.totalChargesInNis.charges),
            totalChargesInEur: this.reduceChargeSum('EUR', this.mandatory, this.totalChargesInEur.charges),
            totalChargesInUsd: this.reduceChargeSum('USD', this.mandatory, this.totalChargesInUsd.charges),
        };
    }
    getMandatory() {
        return this.mandatory;
    }
    toString() {
        const nisCharges = { name: 'NIS', charges: this.totalChargesInNis.charges };
        const usdCharges = { name: 'USD', charges: this.totalChargesInUsd.charges };
        const eurCharges = { name: 'EUR', charges: this.totalChargesInEur.charges };
        const charges = [nisCharges, usdCharges, eurCharges].map(charge => {
            switch (charge.name) {
                case 'NIS':
                    return charge.charges.length === 0 ? '' : `Charges In NIS:\n\t${rateUtils_1.breakLine('Charges In NIS:'.length, '-')}${charge.charges.join('').split('\n').join('\n\t')}`;
                case 'USD':
                    return charge.charges.length === 0 ? '' : `Charges In USD:\n\t${rateUtils_1.breakLine('Charges In USD:'.length, '-')}${charge.charges.join('').split('\n').join('\n\t')}`;
                case 'EUR':
                    return charge.charges.length === 0 ? '' : `Charges In EUR:\n\t${rateUtils_1.breakLine('Charges In EUR:'.length, '-')}${charge.charges.join('').split('\n').join('\n\t')}`;
            }
        });
        return `\n\t${charges.join('\n\t')}`;
    }
    applyingCurrencyChargeToMoney(charge) {
        return new bigint_money_1.Money(charge.amount, charge.currency);
    }
    addCharges(sumTotal, chargeB) {
        const thisChargeSum = this.applyingCurrencyChargeToMoney(sumTotal);
        const otherChargeInCurrency = chargeB.toMoney();
        if (thisChargeSum !== undefined && otherChargeInCurrency !== undefined) {
            const money = thisChargeSum.add(otherChargeInCurrency);
            return { amount: money.format(), currency: sumTotal.currency, mandatory: sumTotal.mandatory };
        }
    }
    reduceChargeSum(currency, mandatory, charges) {
        return {
            sumTotal: {
                amount: this.getSumTotalForSpecificCurrency(charges),
                currency: currency,
                mandatory: mandatory,
            },
            charges: charges,
        };
    }
    getSumTotalForSpecificCurrency(charges) {
        return chargeUtils_1.moneyToCurrencyCharge(charges
            .map(charge => this.applyingCurrencyChargeToMoney(charge.getCharge()))
            .reduce((previousCurrencyCharge, thisCurrencyCharge) => previousCurrencyCharge.add(thisCurrencyCharge))).amount;
    }
}
exports.TotalCharge = TotalCharge;
//# sourceMappingURL=TotalCharge.js.map