import { GenericMeasure } from 'safe-units';
import { Weight } from '../Rates/rateTypes';


export type MasterWeightType = 'PHYSICAL' | 'VOLUME';


export type MasterWeight = {
  ratio: string,
  totalKg: GenericMeasure<number, { mass: '1' }>,
  totalCbm: GenericMeasure<number, { length: '3' }>,
  weightForRate: Weight,
  masterWeightType: MasterWeightType
}


