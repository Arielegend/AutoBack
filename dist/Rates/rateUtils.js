"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.breakLine = exports.calcWeight = exports.getCbmOfBoxes = exports.getBoxesVolumeInCm = exports.getLength = exports.weightScalar = exports.weightBge = exports.compareWeights = exports.parseWeight = exports.getWeight = exports.massInKg = exports.massInTon = exports.massAsWeight = exports.weightToString = void 0;
const safe_units_1 = require("safe-units");
const weightToString = (weight) => `${weight.value} ${weight.unit}`;
exports.weightToString = weightToString;
const massAsWeight = (weight) => {
    return { value: weight.value.toString(), unit: weight.unit };
};
exports.massAsWeight = massAsWeight;
const massInTon = (weightValue) => safe_units_1.Measure.of(Number(weightValue.value), safe_units_1.kilograms, 'ton').scale(0.0001);
exports.massInTon = massInTon;
const massInKg = (weightValue) => safe_units_1.Measure.of(Number(weightValue.value), safe_units_1.kilograms, 'kg');
exports.massInKg = massInKg;
const getWeight = (weightValue) => weightValue.unit === 'ton' ? exports.massInTon(weightValue) : exports.massInKg(weightValue);
exports.getWeight = getWeight;
const parseWeight = (weightString) => {
    const weightMatch = weightString.match(/(\d+(\.\d+)?)\s*(kg)/);
    if (weightMatch) {
        const weightValue = weightMatch[1];
        const weightUnit = weightMatch[3];
        return { value: weightValue, unit: weightUnit };
    }
    return 'Invalid Weight string.';
};
exports.parseWeight = parseWeight;
const compareWeights = (weightA, weightB) => {
    return exports.getWeight(weightA).compare(exports.getWeight(weightB));
};
exports.compareWeights = compareWeights;
const weightBge = (weightValueA, weightValueB) => exports.getWeight(weightValueA).gte(exports.getWeight(weightValueB));
exports.weightBge = weightBge;
const weightScalar = (count, weight) => exports.getWeight(weight).scale(Number(count));
exports.weightScalar = weightScalar;
const getLength = (length) => safe_units_1.Measure.of(Number(length.value), safe_units_1.centi(safe_units_1.meters));
exports.getLength = getLength;
const getBoxesVolumeInCm = (boxDetails) => exports.getLength(boxDetails.height)
    .times(exports.getLength(boxDetails.length))
    .times(exports.getLength(boxDetails.width))
    .scale(Number(boxDetails.count));
exports.getBoxesVolumeInCm = getBoxesVolumeInCm;
//return total of CBM
const getCbmOfBoxes = (boxes) => boxes
    .map((box) => exports.getBoxesVolumeInCm(box))
    .reduce((previousValue, nextValue) => previousValue.plus(nextValue));
exports.getCbmOfBoxes = getCbmOfBoxes;
const totalWeightForEachBoxTypeSpecified = (box) => exports.weightScalar(box.count, box.weight);
//return total of kg
const calcWeight = (boxes) => boxes
    .map(totalWeightForEachBoxTypeSpecified)
    .reduce((previousValue, currentValue) => previousValue.plus(currentValue));
exports.calcWeight = calcWeight;
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
const breakLine = (length, breakCharacter = '~') => {
    let breakLineStr = '';
    for (let i = 0; i < length; i++) {
        breakLineStr += breakCharacter;
    }
    return breakLineStr;
};
exports.breakLine = breakLine;
//# sourceMappingURL=rateUtils.js.map