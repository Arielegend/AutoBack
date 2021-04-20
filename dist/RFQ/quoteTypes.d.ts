import { GenericMeasure } from 'safe-units';
import { Weight } from '../Rates/rateTypes';
export declare type MasterWeightType = 'PHYSICAL' | 'VOLUME';
export declare type MasterWeight = {
    ratio: string;
    totalKg: GenericMeasure<number, {
        mass: '1';
    }>;
    totalCbm: GenericMeasure<number, {
        length: '3';
    }>;
    weightForRate: Weight;
    masterWeightType: MasterWeightType;
};
