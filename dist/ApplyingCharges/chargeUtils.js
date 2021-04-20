"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getZeroValueTotalObject = exports.totalApplyingInitialCharge = exports.reduceApplyingChargesArrayToTotal = exports.getPercentageCharge = exports.zeroCharge = exports.compareCharges = exports.isZeroCharge = exports.addCharges = exports.currencyFromString = exports.currencyStringMatch = exports.moneyFromString = exports.moneyToCurrencyCharge = exports.currencyChargeObject = void 0;
const bigint_money_1 = require("bigint-money");
const ApplyingCharge_1 = require("./ApplyingCharge");
const TotalCharge_1 = require("./TotalCharge");
/**
 * CurrencyCharge Wrappers for BigIntMoney object.
 * */
const currencyChargeObject = (charge) => {
    return new bigint_money_1.Money(charge.amount, charge.currency);
};
exports.currencyChargeObject = currencyChargeObject;
const moneyToCurrencyCharge = (moneyCharge) => {
    return {
        amount: moneyCharge.format(),
        currency: moneyCharge.currency,
    };
};
exports.moneyToCurrencyCharge = moneyToCurrencyCharge;
const moneyFromString = (currencyCharge) => {
    const matchCurrency = exports.currencyStringMatch(currencyCharge);
    if (matchCurrency) {
        return new bigint_money_1.Money(matchCurrency[2], matchCurrency[1]);
    }
    return ['Error: Conversion to BigInt Money Failure.'];
};
exports.moneyFromString = moneyFromString;
const currencyRegex = () => /^(NIS|USD|EUR)?\s*(\d+|((\d+)\.\d+))?$/;
const currencyStringMatch = (currencyCharge) => typeof currencyCharge === 'string' ?
    currencyCharge.match(currencyRegex()) :
    currencyCharge.amount.match(currencyRegex());
exports.currencyStringMatch = currencyStringMatch;
const currencyFromString = (currencyCharge) => {
    const matchCurrency = exports.currencyStringMatch(currencyCharge);
    if (matchCurrency) {
        return { currency: matchCurrency[1], amount: matchCurrency[2] };
    }
    return 'Error: Invalid Currency Construction.';
};
exports.currencyFromString = currencyFromString;
const addCharges = (chargeA, chargeB, mandatory) => {
    const validChargeA = exports.moneyFromString(chargeA);
    const validChargeB = exports.moneyFromString(chargeB);
    if (validChargeA instanceof bigint_money_1.Money && validChargeB instanceof bigint_money_1.Money) {
        const currency = exports.moneyToCurrencyCharge(exports.isZeroCharge(chargeA) ?
            validChargeB :
            exports.isZeroCharge(chargeB) ?
                validChargeB :
                validChargeA.add(validChargeB));
        return {
            mandatory: mandatory,
            ...currency,
        };
    }
    else
        return ['Error: Conversion to BigInt Money Failure.', 'Error: Add Currency Charges Failure.'];
};
exports.addCharges = addCharges;
const isZeroCharge = (charge) => charge.amount === '0';
exports.isZeroCharge = isZeroCharge;
const compareCharges = (chargeA, chargeB) => exports.currencyChargeObject(chargeA).compare(exports.currencyChargeObject(chargeB));
exports.compareCharges = compareCharges;
const zeroCharge = (currency, mandatory) => {
    return {
        amount: '0',
        currency: currency,
        mandatory: mandatory,
    };
};
exports.zeroCharge = zeroCharge;
const getPercentageCharge = (charge, percentage) => {
    return {
        ...exports.moneyToCurrencyCharge(exports.currencyChargeObject(charge).multiply(percentage).divide('100')),
        mandatory: charge.mandatory,
    };
};
exports.getPercentageCharge = getPercentageCharge;
const reduceApplyingChargesArrayToTotal = (applyingCharges) => {
    if (typeof applyingCharges !== 'string') {
        const mandatory = filterMandatory(applyingCharges);
        const nonMandatory = filterNonMandatory(applyingCharges);
        const totalMandatory = new TotalCharge_1.TotalCharge('Y', {
            totalChargesInNis: filterNisMandatoryTotal(mandatory),
            totalChargesInUsd: filterUsdMandatoryTotal(mandatory),
            totalChargesInEur: filterEurMandatoryTotal(mandatory),
        });
        const totalNonMandatory = new TotalCharge_1.TotalCharge('N', {
            totalChargesInNis: filterNisNonMandatoryTotal(nonMandatory),
            totalChargesInUsd: filterUsdNonMandatoryTotal(nonMandatory),
            totalChargesInEur: filterEurNonMandatoryTotal(nonMandatory),
        });
        return { mandatory: totalMandatory, nonMandatory: totalNonMandatory };
    }
    return undefined;
};
exports.reduceApplyingChargesArrayToTotal = reduceApplyingChargesArrayToTotal;
const filterMandatory = (mixedChargeArr) => {
    return mixedChargeArr.filter(charge => charge.getMandatory() === 'Y');
};
const filterNonMandatory = (mixedChargeArr) => {
    return mixedChargeArr.filter(charge => charge.getMandatory() === 'N');
};
const filterNisMandatoryTotal = (mixedChargeArr) => {
    return mixedChargeArr.filter(charge => charge.getCurrency() === 'NIS' && charge.getMandatory() === 'Y');
};
const filterNisNonMandatoryTotal = (mixedChargeArr) => {
    return mixedChargeArr.filter(charge => charge.getCurrency() === 'NIS' && charge.getMandatory() === 'N');
};
/** USD type narrowing */
const filterUsdMandatoryTotal = (mixedChargeArr) => {
    return mixedChargeArr.filter(charge => charge.getCurrency() === 'USD' && charge.getMandatory() === 'Y');
};
const filterUsdNonMandatoryTotal = (mixedChargeArr) => {
    return mixedChargeArr.filter(charge => charge.getCurrency() === 'USD' && charge.getMandatory() === 'N');
};
const filterEurMandatoryTotal = (mixedChargeArr) => {
    return mixedChargeArr.filter(charge => charge.getCurrency() === 'EUR' && charge.getMandatory() === 'Y');
};
const filterEurNonMandatoryTotal = (mixedChargeArr) => {
    return mixedChargeArr.filter(charge => charge.getCurrency() === 'EUR' && charge.getMandatory() === 'N');
};
function totalApplyingInitialCharge(currency, mandatory) {
    return [new ApplyingCharge_1.ApplyingCharge('ZeroCharge', exports.zeroCharge(currency, mandatory))];
}
exports.totalApplyingInitialCharge = totalApplyingInitialCharge;
const getZeroValueTotalObject = (mandatory) => {
    return new TotalCharge_1.TotalCharge(mandatory, {
        totalChargesInNis: totalApplyingInitialCharge('NIS', mandatory),
        totalChargesInUsd: totalApplyingInitialCharge('USD', mandatory),
        totalChargesInEur: totalApplyingInitialCharge('EUR', mandatory),
    });
};
exports.getZeroValueTotalObject = getZeroValueTotalObject;
//# sourceMappingURL=chargeUtils.js.map