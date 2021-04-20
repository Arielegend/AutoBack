import { Container } from "../CargoUnit/Container";
import { Box } from "../CargoUnit/Box";
import { ContainerType, Weight } from "../Rates/rateTypes";
import { PhysicalObjectSize } from "../Rates/rateTypes";


const volume1Meter: PhysicalObjectSize = {
    height: { value: '100', unit: 'cm' },
    width: { value: '100', unit: 'cm' },
    length: { value: '100', unit: 'cm' },
};
 
export const getBoxesMocked1Meter = (ratio:string, count:string, weight: Weight) => {
    return new Box(volume1Meter, weight, ratio , count);
} 


export const getContainersMocked = (count:string, weight: Weight, containerType:ContainerType) => {
    return new Container(containerType, weight, count);
} 
    

export const boxString = (
    count: number,
    length: number,
    height: number,
    width: number,
    cbm: number,
    weight: number,
    totalWeight: number,
    volumeWeight: number,
    ratio: number,
    quotedWeight: number): string => {
    return [
      `${count} Boxes:\n`,
      '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n',
      `Dimensions: ${length} cm X ${height} cm X ${width} cm,\n`,
      `CBM: ${cbm} cm3\n`,
      `Weight: ${weight} kg,\n`,
      `~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n`,
      `Total Weight: ${totalWeight} kg,\n`,
      `Total Volume Weight: ${volumeWeight} kg, ratio: ${ratio},\n`,
      `Quoted Weight: ${quotedWeight} kg.\n`,
    ].join('');
};