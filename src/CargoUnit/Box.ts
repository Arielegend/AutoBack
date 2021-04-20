import { CargoUnit, DimensionsInput, DimensionsOutput } from './ShipmentCargo';
import { Length, PhysicalObjectSize, Weight, WeightUnit } from '../Rates/rateTypes';
import { centi, GenericMeasure, kilograms, Measure, meters } from 'safe-units';
import { breakLine } from '../Rates/rateUtils';


export class Box implements CargoUnit<'Box', 'kg'> {
  name: 'Box';
  count: number;
  dimensions: DimensionsOutput<'Box'>;
  ratio: string;
  physicalWeight: Weight;
  volumeWeight: Weight;
  quotedWeight: Weight;
  readonly MetricTon = Measure.of(0.001, Measure.dimension('mass', 'ton'), 'kg');

  constructor(physicalObjectSize: PhysicalObjectSize, boxWeight: Weight, ratio: string, count: string, name: 'Box' = 'Box') {
    this.ratio = ratio;
    this.name = name;
    this.count = Number(count);

    const dimensions = this.setDimensions(physicalObjectSize, boxWeight, count);

    const physicalWeight = Box.getTotalWeight(Number(count), dimensions);
    const totalVolume = dimensions.volume.volume;
     const volumeWeight = Box.getVolumeWeight(totalVolume, ratio);

    const quotedWeight = this.getWeightMeasure(
      {
        volumeWeight: volumeWeight,
        physicalWeight: physicalWeight,
      },
    );

    this.dimensions = dimensions;
    this.physicalWeight = physicalWeight;
    this.volumeWeight = volumeWeight;
    this.quotedWeight = quotedWeight;

  }

  getQuotingWeight = (units: WeightUnit): Weight<WeightUnit> =>
    units === 'ton' ?
      this.getMassInTons(this.quotedWeight) :
      this.quotedWeight;

  /* Public methods - to be used outside of this class. */
  setDimensions(size: DimensionsInput<'Box'>, weight: Weight<'kg'>, count: string): DimensionsOutput<'Box'> {
    return {
      volume: {
        length: size.length,
        height: size.height,
        width: size.width,
        volume: this.getVolumeValueAsCubicCentimeters(size, count),
        unit: 'cm3',
      },
      // tslint:disable-next-line: object-literal-shorthand
      weight: weight,
      ratio: this.ratio,
    };
  }


  isWithinRateLimits = (limitSize: DimensionsInput<'Box'>, limitWeight: Weight<'kg'>): boolean =>
    this.boxIsBellowWeightLimits(limitWeight) && this.boxIsBellowSizeLimits(limitSize);

  toString = (): string => {
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

    const formattingBreakLine = breakLine(dimensionsString.length);
    return (
      `${this.count} Boxes:\n${formattingBreakLine}\n${unitDimensions}\n${formattingBreakLine}\n${totalDimensions}.\n`
    );
  };

  getItemType = () => 'Box';


  /* Private Methods - concerning Length and Weight
  TODO refactor a portion of these methods to a Measure class,
    at the point of adding more types of cargo.
    */


  /* Length Methods */
  private getLength = (length: Length) =>
    Measure.of(
      Number(length.value),
      Measure.of(0.01, meters, 'm'),
      'cm',
    );


  /** TODO up to (>=) or strictly smaller than length? */
  private lengthGte = (lengthA: Length, lengthB: Length) =>
    this.getLength(lengthA).gte(this.getLength(lengthB));


  /** Every calculation in safe-units is done in a base unit, we require our boxes to be in cm3,
   * so we scale the value by 100.
   * */
  private getVolumeValueAsCubicCentimeters = (
    size: DimensionsInput<'Box'>, count: string,
  ): GenericMeasure<number, { length: '3' }> =>
    this.getVolumeInMetersSquared(size, count);


  /** Total volume is accumulated with accVolume(volume, count), by summing over
   * @volume - @DimensionsInput<'Box'>, a system weight object.
   * @count - number of times
   * */
  private getVolumeInMetersSquared = (
    size: DimensionsInput<'Box'>,
    count: string,
  ): GenericMeasure<number, { length: '3' }> =>
    this.accVolumes(
      this.getLength(size.height)
        .times(this.getLength(size.length))
        .times(this.getLength(size.width)), Number(count),
    );


  /**
   * Recursively adds all weights.
   * Base Case: count === 1, we added this value in the previous step, returned it, and got the total.
   * Otherwise, add to count - 1.
   * */
  private accVolumes = (
    volume: GenericMeasure<number, { length: '3' }>,
    count: number,
  ): GenericMeasure<number, { length: '3' }> =>
    count === 1 ?
      volume :
      this.accVolumes(volume, count - 1).plus(volume);


  private boxIsBellowSizeLimits = (size: DimensionsInput<'Box'>) =>
    this.lengthGte(size.length, this.dimensions.volume.length) &&
    this.lengthGte(size.width, this.dimensions.volume.width) &&
    this.lengthGte(size.height, this.dimensions.volume.height);


  /* Mass Methods */


  private volumeValueToString = (volume: GenericMeasure<number, { length: '3' }>) =>
    volume
      .scale(100)
      .toString(
      {
        formatValue: value => value.toString(),
        formatUnit: unit => '',
      },
    );

  private static getVolumeWeight(totalVolume: GenericMeasure<number, { length: '3' }>, ratio: string): Weight {

    const massValue = totalVolume.scale(parseInt(ratio));

      return { value: massValue.value.toString(), unit: 'kg' };
  }


  private getMass = (weight: Weight) => Measure.of(Number(weight.value), Measure.dimension('mass', 'kg'));

  private getMassInTons = (weight: Weight<'ton'>): Weight<'ton'> => {
    const mass = Measure.of(Number(weight.value), this.MetricTon);

    return { value: mass.value.toString(), unit: 'ton' };
  };

  private compareWeights = (weightA: Weight, weightB: Weight) =>
    this.getMass(weightA).compare(this.getMass(weightB));

  private weightGte = (weightA: Weight, weightB: Weight) =>
    this.compareWeights(weightA, weightB) >= 0;

  private getUnitLengthAsString = (length: Length) => `${length.value} ${length.unit}`;

  private weightString = (weight: Weight) => `${weight.value} ${weight.unit}`;

  private static getTotalWeight = (scalar: number, dimensions: DimensionsOutput<'Box'>): Weight => {
    const weightValue = Measure.of(Number(dimensions.weight.value), kilograms, 'kg').scale(scalar).value;
    return { value: weightValue.toString(), unit: 'kg' };
  };


  getWeightMeasure = (props: { volumeWeight: Weight, physicalWeight: Weight }): Weight =>
    this.weightGte(props.volumeWeight, props.physicalWeight) ? props.volumeWeight : props.physicalWeight;


  boxIsBellowWeightLimits = (weight: Weight<'kg'>) => this.weightGte(weight, this.dimensions.weight);


}
