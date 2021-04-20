import {
  ContainerType,
  PhysicalObjectSize,
  Volume,
  Weight,
  WeightUnit,
} from '../Rates/rateTypes';
import { Box } from './Box';
import { Container } from './Container';


export type CargoTypeAlias = 'Box' | 'Container';
type ContainerDimensions = { volume: ContainerType, weight: Weight<'ton'> };
type BoxDimension = { volume: Volume, weight: Weight, ratio: string };

export type DimensionsInput<CT extends CargoTypeAlias> =
  CT extends 'Container' ?
    ContainerDimensions :
    PhysicalObjectSize;

export type DimensionsOutput<CT extends CargoTypeAlias> =
  CT extends 'Container' ?
    ContainerDimensions :
    BoxDimension;


export type CargoItem<CT extends CargoTypeAlias> =
  CT extends 'Container' ?
    { cargoType: 'Container', cargo: Container } :
    { cargoType: 'Box', cargo: Box };



export interface CargoUnit<CT extends CargoTypeAlias, W extends WeightUnit> {
  name: CT;
  dimensions: DimensionsOutput<CT>;
  setDimensions: (size: DimensionsInput<CT>, weight: Weight<W>, count: string) => DimensionsOutput<CT>;
  getQuotingWeight: (units: WeightUnit) => Weight<WeightUnit>
  toString: () => string;
  getItemType: () => string;
  isWithinRateLimits: (limitSize: DimensionsInput<CT>, limitWeight: Weight<W>,) => boolean;
}

export type CargoWeight<CT extends CargoTypeAlias, C extends CargoItem<CT>> =
 C extends { cargoType: 'Container', cargo: Container } ?
   'ton':
    'kg'

