import { centi, GenericMeasure, kilograms, Measure, meters, Volume } from 'safe-units';
import { BoxDetails } from '../RFQ/requestTypes';
import { Length, Weight, WeightUnit } from './rateTypes';
import { MasterWeight, MasterWeightType } from '../RFQ/quoteTypes';


export type InvalidWeightString = 'Invalid Weight string.';

export const weightToString = <T extends WeightUnit>(weight: Weight<T>) =>
  `${weight.value} ${weight.unit}`;

export const massAsWeight = <T extends WeightUnit>(weight: GenericMeasure<number, { mass: '1' }>): Weight<T> => {
  return { value: weight.value.toString(), unit: weight.unit as WeightUnit };
};

export const massInTon = (weightValue: Weight<'ton'>) => Measure.of(Number(weightValue.value), kilograms, 'ton').scale(0.0001);

export const massInKg = (weightValue: Weight) => Measure.of(Number(weightValue.value), kilograms, 'kg');

export const getWeight = (weightValue: Weight) => weightValue.unit === 'ton' ? massInTon(weightValue) : massInKg(weightValue);

export const parseWeight = (weightString: string): Weight | InvalidWeightString => {
  const weightMatch = weightString.match(/(\d+(\.\d+)?)\s*(kg)/);
  if (weightMatch) {
    const weightValue = weightMatch[1];
    const weightUnit = weightMatch[3];
    return { value: weightValue, unit: weightUnit as WeightUnit };
  }
  return 'Invalid Weight string.';
};

export const compareWeights = <T extends WeightUnit>(weightA: Weight<T>, weightB: Weight<T>) => {
  return getWeight(weightA).compare(getWeight(weightB));
};

export const weightBge = <T extends WeightUnit>(weightValueA: Weight<T>, weightValueB: Weight<T>) =>
  getWeight(weightValueA).gte(getWeight(weightValueB));

export const weightScalar = (count: string, weight: Weight) => getWeight(weight).scale(Number(count));

export const getLength = (length: Length) =>
  Measure.of(
    Number(length.value),
    centi(meters),
  );


export const getBoxesVolumeInCm = (boxDetails: BoxDetails): Volume =>
  getLength(boxDetails.height)
    .times(getLength(boxDetails.length))
    .times(getLength(boxDetails.width))
    .scale(Number(boxDetails.count));


//return total of CBM
export const getCbmOfBoxes = (boxes: BoxDetails[]) =>
  boxes
    .map(
      (box: BoxDetails) =>
        getBoxesVolumeInCm(box),
    )
    .reduce(
      (previousValue: Volume, nextValue: Volume) =>
        previousValue.plus(nextValue),
    );

const totalWeightForEachBoxTypeSpecified = (box: BoxDetails) => weightScalar(box.count, box.weight);


//return total of kg
export const calcWeight = (boxes: BoxDetails[]) =>
  boxes
    .map(totalWeightForEachBoxTypeSpecified)
    .reduce(
      (previousValue, currentValue) =>
        previousValue.plus(currentValue),
    );

/*
    Main difference between Air and Ocean
    is that at Air we compare total kg to cbm*ratio
    where as in lcl we compare total cbm to total Ton
*/

/*

export function getMasterObjectPerRatio<W extends WeightUnit>(unit: W, ratio: string, boxes: BoxDetails[]): MasterWeight {

  /!** Get physical weight. *!/
  const physicalWeight = calcWeight(boxes);

  /!** Volume Weight Calculation. *!/
  const totalCbm = getCbmOfBoxes(boxes);

  /!** Scale Volume by ratio. *!/
  const volumeScaledByRatio = totalCbm.scale(Number(ratio));

  /!** Volume as a mass. *!/
  const volumeWeight = Measure.of(volumeScaledByRatio.value, Measure.dimension('mass', 'kg'));


  /!** Mark the cargo weight as physical or weight. *!/
  const volumeOrWeight =
    physicalWeight.gt(volumeWeight) ?
      'PHYSICAL' :
      'VOLUME';

  const weightToBeApplied =
    volumeOrWeight === 'PHYSICAL' ?
      physicalWeight :
      volumeWeight;


  /!** If the weight threshold in the rate is decided as a ton, we convert to ton. *!/

  const weightInUnitsForRate =
    unit === 'ton' ?
      Measure.of(weightToBeApplied.value, MetricTon) :
      weightToBeApplied;


  return {
    ratio: ratio,
    totalKg: physicalWeight,
    totalCbm: totalCbm,
    masterWeightType: volumeOrWeight as MasterWeightType,
    weightForRate: { value: JSON.stringify(weightInUnitsForRate.value), unit: physicalWeight.symbol as WeightUnit },
  };

}
*/


export const breakLine = (length: number, breakCharacter: '=' | '~' | '-' = '~') => {
  let breakLineStr = '';
  for (let i = 0; i < length; i++) {
    breakLineStr += breakCharacter;
  }
  return breakLineStr;
};