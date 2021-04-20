"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Container = void 0;
const safe_units_1 = require("safe-units");
class Container {
    constructor(containerType, containerWeight, count) {
        this.name = 'Container';
        this.getQuotingWeight = (units) => {
            const weightValue = safe_units_1.Measure.of(Number(this.dimensions.weight.value), safe_units_1.kilograms, 'ton');
            return { value: weightValue.value.toString(), unit: units };
        };
        this.getItemType = () => 'Box';
        this.weightString = (weight) => `${weight.value} ${weight.unit}`;
        this.toString = () => `${this.count} X ${this.dimensions.volume}, Container Weight: ${this.weightString(this.dimensions.weight)}`;
        this.compareWeights = (weightA, weightB) => this.getMass(weightA).compare(this.getMass(weightB));
        this.weightGte = (weightA, weightB) => this.compareWeights(weightA, weightB) >= 0;
        this.getMass = (weight) => safe_units_1.Measure.of(Number(weight.value), safe_units_1.Measure.dimension('mass', 'kg'));
        this.dimensions = this.setDimensions({ volume: containerType, weight: containerWeight }, containerWeight);
        this.count = Number(count);
    }
    setDimensions(size, weight) {
        return { volume: size.volume, weight: weight };
    }
    isWithinRateLimits(limitSize, limitWeight) {
        return this.weightGte(limitWeight, this.dimensions.weight);
    }
}
exports.Container = Container;
//# sourceMappingURL=Container.js.map