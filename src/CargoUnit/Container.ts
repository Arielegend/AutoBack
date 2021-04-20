import { CargoItem, CargoUnit, CargoWeight, DimensionsInput, DimensionsOutput } from './ShipmentCargo';
import { ContainerType, Weight, WeightUnit } from '../Rates/rateTypes';
import { breakLine } from '../Rates/rateUtils';
import { kilograms, Measure } from 'safe-units';


export class Container implements CargoUnit<'Container', 'ton'> {
  name: 'Container' = 'Container';
  dimensions: DimensionsOutput<'Container'>;
  count: number;

  constructor(containerType: ContainerType, containerWeight: Weight<'ton'>, count: string) {
    this.dimensions = this.setDimensions({ volume: containerType, weight: containerWeight}, containerWeight);
    this.count = Number(count);
  }

  setDimensions(size: DimensionsInput<'Container'>, weight: Weight<'ton'>,): DimensionsOutput<'Container'> {
    return { volume: size.volume, weight: weight};
  }

  getQuotingWeight = (units: WeightUnit): Weight<WeightUnit> => {
    const weightValue = Measure.of(Number(this.dimensions.weight.value), kilograms, 'ton');
    return { value: weightValue.value.toString(), unit: units };
  }

  getItemType = () => 'Box';

  weightString = (weight: Weight) => {
    if(weight.value.includes("ton") || weight.value.includes("kg")) return `${weight.value}`
    return `${weight.value} ${weight.unit}`;
  }

  toString = () => `${this.count} X ${this.dimensions.volume}, Container Weight: ${this.weightString(this.dimensions.weight)}`

  compareWeights = (weightA: Weight, weightB: Weight) =>
    this.getMass(weightA).compare(this.getMass(weightB));

  weightGte = (weightA: Weight, weightB: Weight) =>
    this.compareWeights(weightA, weightB) >= 0;

  getMass = (weight: Weight) => Measure.of(Number(weight.value), Measure.dimension('mass', 'kg'));

  isWithinRateLimits(limitSize: DimensionsInput<"Container">, limitWeight: Weight<"ton">): boolean {
    return this.weightGte(limitWeight, this.dimensions.weight);
  }
}