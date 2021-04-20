"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Box = void 0;
const safe_units_1 = require("safe-units");
const rateUtils_1 = require("../Rates/rateUtils");
class Box {
    constructor(physicalObjectSize, boxWeight, ratio, count, name = 'Box') {
        this.MetricTon = safe_units_1.Measure.of(0.001, safe_units_1.Measure.dimension('mass', 'ton'), 'kg');
        this.getQuotingWeight = (units) => units === 'ton' ?
            this.getMassInTons(this.quotedWeight) :
            this.quotedWeight;
        this.isWithinRateLimits = (limitSize, limitWeight) => this.boxIsBellowWeightLimits(limitWeight) && this.boxIsBellowSizeLimits(limitSize);
        this.toString = () => {
            const length = this.getUnitLengthAsString(this.dimensions.volume.length);
            const height = this.getUnitLengthAsString(this.dimensions.volume.height);
            const width = this.getUnitLengthAsString(this.dimensions.volume.width);
            const dimensionsString = `Dimensions: ${length} X ${height} X ${width}`;
            const volumeString = `CBM: ${this.volumeValueToString(this.dimensions.volume.volume)} ${this.dimensions.volume.unit}`;
            const weight = this.dimensions.weight;
            const weightString = `Weight: ${this.weightString(weight)}`;
            const totalWeightString = `Total Weight: ${this.weightString(this.physicalWeight)}`;
            const totalVolumeWeightString = `Total Volume Weight: ${this.weightString(this.volumeWeight)}, ratio: ${this.ratio}`;
            const quotedWeight = `Quoted Weight: ${this.weightString(this.quotedWeight)}`;
            const unitDimensions = `${dimensionsString},\n${volumeString}\n${weightString},`;
            const totalDimensions = `${totalWeightString},\n${totalVolumeWeightString},\n${quotedWeight}`;
            const formattingBreakLine = rateUtils_1.breakLine(dimensionsString.length);
            return (`${this.count} Boxes:\n${formattingBreakLine}\n${unitDimensions}\n${formattingBreakLine}\n${totalDimensions}.\n`);
        };
        this.getItemType = () => 'Box';
        /* Private Methods - concerning Length and Weight
        TODO refactor a portion of these methods to a Measure class,
          at the point of adding more types of cargo.
          */
        /* Length Methods */
        this.getLength = (length) => safe_units_1.Measure.of(Number(length.value), safe_units_1.Measure.of(0.01, safe_units_1.meters, 'm'), 'cm');
        /** TODO up to (>=) or strictly smaller than length? */
        this.lengthGte = (lengthA, lengthB) => this.getLength(lengthA).gte(this.getLength(lengthB));
        /** Every calculation in safe-units is done in a base unit, we require our boxes to be in cm3,
         * so we scale the value by 100.
         * */
        this.getVolumeValueAsCubicCentimeters = (size, count) => this.getVolumeInMetersSquared(size, count);
        /** Total volume is accumulated with accVolume(volume, count), by summing over
         * @volume - @DimensionsInput<'Box'>, a system weight object.
         * @count - number of times
         * */
        this.getVolumeInMetersSquared = (size, count) => this.accVolumes(this.getLength(size.height)
            .times(this.getLength(size.length))
            .times(this.getLength(size.width)), Number(count));
        /**
         * Recursively adds all weights.
         * Base Case: count === 1, we added this value in the previous step, returned it, and got the total.
         * Otherwise, add to count - 1.
         * */
        this.accVolumes = (volume, count) => count === 1 ?
            volume :
            this.accVolumes(volume, count - 1).plus(volume);
        this.boxIsBellowSizeLimits = (size) => this.lengthGte(size.length, this.dimensions.volume.length) &&
            this.lengthGte(size.width, this.dimensions.volume.width) &&
            this.lengthGte(size.height, this.dimensions.volume.height);
        /* Mass Methods */
        this.volumeValueToString = (volume) => volume
            .scale(100)
            .toString({
            formatValue: value => value.toString(),
            formatUnit: unit => '',
        });
        this.getMass = (weight) => safe_units_1.Measure.of(Number(weight.value), safe_units_1.Measure.dimension('mass', 'kg'));
        this.getMassInTons = (weight) => {
            const mass = safe_units_1.Measure.of(Number(weight.value), this.MetricTon);
            return { value: mass.value.toString(), unit: 'ton' };
        };
        this.compareWeights = (weightA, weightB) => this.getMass(weightA).compare(this.getMass(weightB));
        this.weightGte = (weightA, weightB) => this.compareWeights(weightA, weightB) >= 0;
        this.getUnitLengthAsString = (length) => `${length.value} ${length.unit}`;
        this.weightString = (weight) => `${weight.value} ${weight.unit}`;
        this.getWeightMeasure = (props) => this.weightGte(props.volumeWeight, props.physicalWeight) ? props.volumeWeight : props.physicalWeight;
        this.boxIsBellowWeightLimits = (weight) => this.weightGte(weight, this.dimensions.weight);
        this.ratio = ratio;
        this.name = name;
        this.count = Number(count);
        const dimensions = this.setDimensions(physicalObjectSize, boxWeight, count);
        const physicalWeight = Box.getTotalWeight(Number(count), dimensions);
        const totalVolume = dimensions.volume.volume;
        const volumeWeight = Box.getVolumeWeight(totalVolume, ratio);
        const quotedWeight = this.getWeightMeasure({
            volumeWeight: volumeWeight,
            physicalWeight: physicalWeight,
        });
        this.dimensions = dimensions;
        this.physicalWeight = physicalWeight;
        this.volumeWeight = volumeWeight;
        this.quotedWeight = quotedWeight;
    }
    /* Public methods - to be used outside of this class. */
    setDimensions(size, weight, count) {
        return {
            volume: {
                length: size.length,
                height: size.height,
                width: size.width,
                volume: this.getVolumeValueAsCubicCentimeters(size, count),
                unit: 'cm3',
            },
            weight: weight,
            ratio: this.ratio,
        };
    }
    static getVolumeWeight(totalVolume, ratio) {
        const massValue = totalVolume.scale(parseInt(ratio));
        return { value: massValue.value.toString(), unit: 'kg' };
    }
}
exports.Box = Box;
Box.getTotalWeight = (scalar, dimensions) => {
    const weightValue = safe_units_1.Measure.of(Number(dimensions.weight.value), safe_units_1.kilograms, 'kg').scale(scalar).value;
    return { value: weightValue.toString(), unit: 'kg' };
};
//# sourceMappingURL=Box.js.map