"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplyingCharge = void 0;
const bigint_money_1 = require("bigint-money");
const chargeUtils_1 = require("./chargeUtils");
const rateUtils_1 = require("../Rates/rateUtils");
/** Class representing a single applyingCharge we apply in a rate, in any part, on any type.
 *
 * @ApplyingCharge<C extends CurrencyType, M extends Mandatory>{
 *   @applyingCharge: {
 *   @amount: string # value in decimal point.
 *   @currency: C # C is of CurrencyType = 'NIS' | 'USD' | 'EUR'.
 *   @mandatory: M # M is 'Y'| 'N', depending on if the rate applyingCharge is mandatory or not.
 *  }
 * */
class ApplyingCharge {
    constructor(chargeMapName, currencyCharge, rateCharge, shipmentRequest) {
        this.moneyToCurrencyChargeObject = (moneyCharge) => {
            return {
                amount: moneyCharge.format(),
                currency: moneyCharge.currency,
            };
        };
        this.weightChargeParameter = (applyingRateCharge, unit) => `${applyingRateCharge.charge.currency} ${applyingRateCharge.charge.amount} / Physical/Volume Weight (Volume Weight = 1 m3 * ${applyingRateCharge.ratio} ${unit})`;
        this.boxesRequest = (boxes) => `\n\t${boxes.map(box => box.toString().split('\n').join('\n\t'))}`;
        this.containerRequest = (containers) => `\n\t${containers.map(container => container.toString().split('\n').join('\n\t'))}`;
        /**TODO Switch to Total Request*/
        this.totalRequest = (sumTotal) => `${sumTotal.currency} ${sumTotal.amount}`;
        this.rateCharge = rateCharge;
        this.applyingCharge = currencyCharge;
        this.chargeMapName = chargeMapName;
        this.shipmentRequest = shipmentRequest;
    }
    ;
    getCharge() {
        if (this.applyingCharge !== undefined) {
            return {
                currency: this.applyingCharge.currency,
                amount: this.applyingCharge.amount,
                mandatory: this.applyingCharge.mandatory,
            };
        }
        return undefined;
    }
    getCurrency() {
        if (this.applyingCharge !== undefined) {
            return this.applyingCharge.currency;
        }
    }
    getMandatory() {
        if (this.applyingCharge !== undefined) {
            return this.applyingCharge.mandatory;
        }
    }
    currencyChargeFromStringValue(currency, mandatory) {
        const chargeFromString1 = chargeUtils_1.currencyFromString(currency);
        if (chargeFromString1 !== 'Error: Invalid Currency Construction.') {
            this.applyingCharge = { currency: chargeFromString1.currency, amount: chargeFromString1.amount, mandatory };
        }
        return this;
    }
    scaleCharge(scalar) {
        if (this.applyingCharge !== undefined) {
            this.applyingCharge = {
                ...this.moneyToCurrencyChargeObject(chargeUtils_1.currencyChargeObject(this.applyingCharge).multiply(scalar)),
                mandatory: this.applyingCharge.mandatory,
            };
        }
    }
    toMoney() {
        if (this.applyingCharge !== undefined) {
            return new bigint_money_1.Money(this.applyingCharge.amount, this.applyingCharge.currency);
        }
    }
    eq(otherCharge) {
        if (this.applyingCharge !== undefined && otherCharge.applyingCharge !== undefined) {
            if (this.getCurrency() === otherCharge.getCurrency()) {
                return chargeUtils_1.compareCharges(this.applyingCharge, otherCharge.applyingCharge) === 0;
            }
        }
    }
    gt(otherCharge) {
        if (this.applyingCharge !== undefined && otherCharge.applyingCharge !== undefined) {
            if (this.getCurrency() === otherCharge.getCurrency()) {
                return chargeUtils_1.compareCharges(this.applyingCharge, otherCharge.applyingCharge) === 1;
            }
        }
    }
    st(otherCharge) {
        if (this.applyingCharge !== undefined && otherCharge.applyingCharge !== undefined) {
            if (this.getCurrency() === otherCharge.getCurrency()) {
                return chargeUtils_1.compareCharges(this.applyingCharge, otherCharge.applyingCharge) === -1;
            }
        }
    }
    toString() {
        if (this.applyingCharge !== undefined && this.rateCharge !== undefined) {
            const mandatoryString = this.getMandatory() === 'Y' ? 'mandatory' : 'non-mandatory';
            const applyingCurrencyChargeString = `${this.applyingCharge.currency} ${this.applyingCharge.amount}`;
            const applyingRateKey = this.rateCharge[0];
            const applyingRateCharge = this.rateCharge[1];
            const shipmentRequestStr = this.shipmentRequest?.name === 'Boxes' ?
                this.boxesRequest(this.shipmentRequest?.chargeParamObj) :
                this.shipmentRequest?.name === 'Containers' ?
                    this.containerRequest(this.shipmentRequest?.chargeParamObj) :
                    this.shipmentRequest?.name === 'TotalChargeSet' ?
                        this.totalRequest(this.shipmentRequest?.chargeParamObj) :
                        '';
            const shipmentRequest = `\n\tCharge Input:${shipmentRequestStr}`;
            const { chargeName, chargeParameter } = this.chargeMapName === 'ThcCharge' ?
                {
                    chargeName: 'Thc Charge',
                    chargeParameter: ApplyingCharge.getContainerChargeParameter(applyingRateCharge),
                } :
                this.chargeMapName === 'LocalContainerCharges' ?
                    {
                        chargeName: 'Local Container Charge',
                        chargeParameter: ApplyingCharge.getContainerChargeParameter(applyingRateCharge),
                    } :
                    this.chargeMapName === 'HeavyWeightCharges' ?
                        {
                            chargeName: 'Heavy Weight Charge',
                            chargeParameter: `${applyingRateCharge.charge.currency} ${applyingRateCharge.charge.amount} for weight >= ${rateUtils_1.weightToString(applyingRateKey)}`,
                        } :
                        this.chargeMapName === 'WeightCharges' ?
                            {
                                chargeName: 'Weight Charge',
                                chargeParameter: rateUtils_1.weightToString(applyingRateKey),
                            } :
                            this.chargeMapName === 'WeightRulesCharges' ?
                                {
                                    chargeName: 'Weight Rules Charges',
                                    chargeParameter: this.weightChargeParameter(applyingRateCharge, 'kg'),
                                } :
                                this.chargeMapName === 'FixCharges' ?
                                    {
                                        chargeName: 'Fix Charge',
                                        chargeParameter: 'Fixed Charge',
                                    } :
                                    this.chargeMapName === 'YataCharge' ?
                                        {
                                            chargeName: 'YATA Charge',
                                            chargeParameter: `Total Air Freight`,
                                        } :
                                        this.chargeMapName === 'LclCharge' ?
                                            {
                                                chargeName: 'LCL Freight Charge',
                                                chargeParameter: `${applyingRateCharge.charge.currency} ${applyingRateCharge.charge.amount} for weight >= ${this.weightChargeParameter(applyingRateCharge, 'kg')}`,
                                            } :
                                            this.chargeMapName === 'AirChargeMap' ?
                                                {
                                                    chargeName: 'AIR Freight Charge',
                                                    chargeParameter: this.weightChargeParameter(applyingRateCharge, 'kg'),
                                                } :
                                                {
                                                    chargeName: 'FCL Freight Charge',
                                                    chargeParameter: ApplyingCharge.getContainerChargeParameter(applyingRateCharge),
                                                };
            const perChargeParam = `per rate of ${chargeParameter}`;
            const finalApplyingChargeWithParamString = `\n${chargeName}: [${applyingCurrencyChargeString}, ${mandatoryString}], ${perChargeParam},${shipmentRequest}`;
            const finalApplyingChargeWithoutParamString = `\n${chargeName}: [${applyingCurrencyChargeString}, ${mandatoryString}].`;
            return shipmentRequestStr === '' ? finalApplyingChargeWithoutParamString : finalApplyingChargeWithParamString;
        }
        return '';
    }
}
exports.ApplyingCharge = ApplyingCharge;
ApplyingCharge.getContainerChargeParameter = (applyingRateCharge) => `${applyingRateCharge.charge.currency} ${applyingRateCharge.charge.amount} / ${applyingRateCharge.container}`;
//# sourceMappingURL=ApplyingCharge.js.map