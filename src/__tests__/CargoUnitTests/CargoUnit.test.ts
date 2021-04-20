import { ContainerType, PhysicalObjectSize, Weight } from '../../Rates/rateTypes';
import { Container } from '../../CargoUnit/Container';
import {boxString, getBoxesMocked1Meter, getContainersMocked} from '../../Mocks/cargoUnitsMocking'



const containerString = (count: number, container: ContainerType, weight: number): string => `${count} X ${container}, Container Weight: ${weight} ton`;


test('Box Test',
  () => {

    const boxVolumeLimit: PhysicalObjectSize = {
      height: { value: '101', unit: 'cm' },
      width: { value: '101', unit: 'cm' },
      length: { value: '101', unit: 'cm' },
    };
 
    const ratio = '167'
    const amount = '4'
    const weight: Weight = { value: '100', unit: 'kg' }
    const boxes = getBoxesMocked1Meter(ratio, amount, weight)

    const actualBoxString = boxes.toString();
    const expectedBoxString: string = boxString(
      4,
      100,
      100,
      100,
      400,
      100,
      400,
      704,
      176,
      704,
    );


    expect(
      JSON.stringify(actualBoxString),
    )
      .toStrictEqual(
        JSON.stringify(expectedBoxString),
      );

    expect(boxes.isWithinRateLimits(boxVolumeLimit, { value: '200', unit: 'kg' })).toBe(true);
  },
);
test('Container Test',
  () => {

    const count = '4'
    const weight: Weight = { value: '20', unit: 'ton' }

    const container = getContainersMocked(count, weight, 'DV20'  )

    const containerIsUnderLimits =
      container
        .isWithinRateLimits(
          { volume: 'DV20', weight: { value: '30', unit: 'ton' } },
          { value: '30', unit: 'ton' },
        );

    const actualContainerString = container.toString();


    const expectedContainerString = containerString(4, 'DV20', 20);
    expect(
      JSON.stringify(actualContainerString),
    )
      .toStrictEqual(
        JSON.stringify(expectedContainerString),
      );

    expect(containerIsUnderLimits)
      .toBe(true);
  },
);
