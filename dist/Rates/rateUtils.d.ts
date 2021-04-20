import { GenericMeasure } from 'safe-units';
import { BoxDetails } from '../RFQ/requestTypes';
import { Length, Weight, WeightUnit } from './rateTypes';
export declare type InvalidWeightString = 'Invalid Weight string.';
export declare const weightToString: <T extends WeightUnit>(weight: Weight<T>) => string;
export declare const massAsWeight: <T extends WeightUnit>(weight: GenericMeasure<number, {
    mass: '1';
}>) => Weight<T>;
export declare const massInTon: (weightValue: Weight<'ton'>) => GenericMeasure<number, {
    mass: "1";
}>;
export declare const massInKg: (weightValue: Weight) => GenericMeasure<number, {
    mass: "1";
}>;
export declare const getWeight: (weightValue: Weight) => GenericMeasure<number, {
    mass: "1";
}>;
export declare const parseWeight: (weightString: string) => Weight | InvalidWeightString;
export declare const compareWeights: <T extends WeightUnit>(weightA: Weight<T>, weightB: Weight<T>) => number;
export declare const weightBge: <T extends WeightUnit>(weightValueA: Weight<T>, weightValueB: Weight<T>) => boolean;
export declare const weightScalar: (count: string, weight: Weight) => GenericMeasure<number, {
    mass: "1";
}>;
export declare const getLength: (length: Length) => GenericMeasure<number, {
    length: "1";
}>;
export declare const getBoxesVolumeInCm: (boxDetails: BoxDetails) => GenericMeasure<number, {
    length: "3";
}>;
export declare const getCbmOfBoxes: (boxes: BoxDetails[]) => GenericMeasure<number, {
    length: "3";
}>;
export declare const calcWeight: (boxes: BoxDetails[]) => GenericMeasure<number, {
    mass: "1";
}>;
export declare const breakLine: (length: number, breakCharacter?: '=' | '~' | '-') => string;
