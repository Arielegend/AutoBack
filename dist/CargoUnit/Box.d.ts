import { CargoUnit, DimensionsInput, DimensionsOutput } from './ShipmentCargo';
import { PhysicalObjectSize, Weight, WeightUnit } from '../Rates/rateTypes';
import { GenericMeasure } from 'safe-units';
export declare class Box implements CargoUnit<'Box', 'kg'> {
    name: 'Box';
    count: number;
    dimensions: DimensionsOutput<'Box'>;
    ratio: string;
    physicalWeight: Weight;
    volumeWeight: Weight;
    quotedWeight: Weight;
    readonly MetricTon: GenericMeasure<number, {
        mass: "1";
    }>;
    constructor(physicalObjectSize: PhysicalObjectSize, boxWeight: Weight, ratio: string, count: string, name?: 'Box');
    getQuotingWeight: (units: WeightUnit) => Weight<WeightUnit>;
    setDimensions(size: DimensionsInput<'Box'>, weight: Weight<'kg'>, count: string): DimensionsOutput<'Box'>;
    isWithinRateLimits: (limitSize: DimensionsInput<'Box'>, limitWeight: Weight<'kg'>) => boolean;
    toString: () => string;
    getItemType: () => string;
    private getLength;
    /** TODO up to (>=) or strictly smaller than length? */
    private lengthGte;
    /** Every calculation in safe-units is done in a base unit, we require our boxes to be in cm3,
     * so we scale the value by 100.
     * */
    private getVolumeValueAsCubicCentimeters;
    /** Total volume is accumulated with accVolume(volume, count), by summing over
     * @volume - @DimensionsInput<'Box'>, a system weight object.
     * @count - number of times
     * */
    private getVolumeInMetersSquared;
    /**
     * Recursively adds all weights.
     * Base Case: count === 1, we added this value in the previous step, returned it, and got the total.
     * Otherwise, add to count - 1.
     * */
    private accVolumes;
    private boxIsBellowSizeLimits;
    private volumeValueToString;
    private static getVolumeWeight;
    private getMass;
    private getMassInTons;
    private compareWeights;
    private weightGte;
    private getUnitLengthAsString;
    private weightString;
    private static getTotalWeight;
    getWeightMeasure: (props: {
        volumeWeight: Weight;
        physicalWeight: Weight;
    }) => Weight;
    boxIsBellowWeightLimits: (weight: Weight<'kg'>) => boolean;
}
