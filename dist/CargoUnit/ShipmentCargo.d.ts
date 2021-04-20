import { ContainerType, PhysicalObjectSize, Volume, Weight, WeightUnit } from '../Rates/rateTypes';
import { Box } from './Box';
import { Container } from './Container';
export declare type CargoTypeAlias = 'Box' | 'Container';
declare type ContainerDimensions = {
    volume: ContainerType;
    weight: Weight<'ton'>;
};
declare type BoxDimension = {
    volume: Volume;
    weight: Weight;
    ratio: string;
};
export declare type DimensionsInput<CT extends CargoTypeAlias> = CT extends 'Container' ? ContainerDimensions : PhysicalObjectSize;
export declare type DimensionsOutput<CT extends CargoTypeAlias> = CT extends 'Container' ? ContainerDimensions : BoxDimension;
export declare type CargoItem<CT extends CargoTypeAlias> = CT extends 'Container' ? {
    cargoType: 'Container';
    cargo: Container;
} : {
    cargoType: 'Box';
    cargo: Box;
};
export interface CargoUnit<CT extends CargoTypeAlias, W extends WeightUnit> {
    name: CT;
    dimensions: DimensionsOutput<CT>;
    setDimensions: (size: DimensionsInput<CT>, weight: Weight<W>, count: string) => DimensionsOutput<CT>;
    getQuotingWeight: (units: WeightUnit) => Weight<WeightUnit>;
    toString: () => string;
    getItemType: () => string;
    isWithinRateLimits: (limitSize: DimensionsInput<CT>, limitWeight: Weight<W>) => boolean;
}
export declare type CargoWeight<CT extends CargoTypeAlias, C extends CargoItem<CT>> = C extends {
    cargoType: 'Container';
    cargo: Container;
} ? 'ton' : 'kg';
export {};
