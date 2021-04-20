import { CargoUnit, DimensionsInput, DimensionsOutput } from './ShipmentCargo';
import { ContainerType, Weight, WeightUnit } from '../Rates/rateTypes';
export declare class Container implements CargoUnit<'Container', 'ton'> {
    name: 'Container';
    dimensions: DimensionsOutput<'Container'>;
    count: number;
    constructor(containerType: ContainerType, containerWeight: Weight<'ton'>, count: string);
    setDimensions(size: DimensionsInput<'Container'>, weight: Weight<'ton'>): DimensionsOutput<'Container'>;
    getQuotingWeight: (units: WeightUnit) => Weight<WeightUnit>;
    getItemType: () => string;
    weightString: (weight: Weight) => string;
    toString: () => string;
    compareWeights: (weightA: Weight, weightB: Weight) => number;
    weightGte: (weightA: Weight, weightB: Weight) => boolean;
    getMass: (weight: Weight) => import("safe-units").GenericMeasure<number, {
        mass: "1";
    }>;
    isWithinRateLimits(limitSize: DimensionsInput<"Container">, limitWeight: Weight<"ton">): boolean;
}
