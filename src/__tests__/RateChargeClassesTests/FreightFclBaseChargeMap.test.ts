import { ContainerType, CurrencyType, Mandatory } from '../../Rates/rateTypes';
import { FreightFclBaseChargeMap } from '../../RateChargeClasses/BaseCharges/Fob/FreightFclBaseChargeMap';
import { RequestFobFcl } from '../../RFQ/requestTypes';
import { oceanFclTable } from '../../Mocks/fclMockObjects';

export const expectedValueContainerValue = (
  currency: CurrencyType,
  mandatory: Mandatory,
  totalSumValue: number,
  rateValue: number,
  containerCount: number,
  containerType: ContainerType,
  containerWeight: number,
) => [
  `\nFCL Freight Charge: [${currency} ${totalSumValue}, ${mandatory === 'Y' ? 'mandatory' : 'non-mandatory'}], per rate of ${currency} ${rateValue} / ${containerType},`,
  '\n\tCharge Input:',
  `\n\t${containerCount} X ${containerType}, Container Weight: ${containerWeight} ton`,
].join('');

test('FreightFclBaseChargeMap From Base Table. ',
  () => {

    const shipmentDetails: RequestFobFcl = {
      containers: [
        {
          containerType: 'DV20',
          count: '2',
          weight: { value: '25', unit: 'ton' },
        },
        {
          containerType: 'DV40',
          count: '5',
          weight: { value: '25', unit: 'ton' },
        },
      ],
    };

    const newFreightTransportChargesShenzhen = new FreightFclBaseChargeMap([oceanFclTable()[0]]);
    const newFreightTransportChargesShanghai = new FreightFclBaseChargeMap([oceanFclTable()[1]]);


    const actualShenzhen = newFreightTransportChargesShenzhen.calcMe({
      name: 'Containers',
      requestDetails: shipmentDetails.containers,
    });
    const actualShanghai = newFreightTransportChargesShanghai.calcMe({
      name: 'Containers',
      requestDetails: shipmentDetails.containers,
    });

/*
    console.log(actualShenzhen.toString());
    console.log(actualShanghai.toString());
*/


    /*'\nFCL Freight Charge: [NIS 400, mandatory], per rate of NIS 200 / DV20,',
      '\n\tCharge Input:',
      '\n\t2 X DV20, Container Weight: 25 ton',*/
    expect(JSON.stringify(actualShanghai[0].toString()))
      .toStrictEqual(
        JSON.stringify(
          expectedValueContainerValue(
            'NIS',
            'Y',
            440,
            220,
            2,
            'DV20',
            25,
          )),
      );
    /*'FCL Freight Charge: [NIS 1500, mandatory], per rate of NIS / DV40,'*/
    expect(JSON.stringify(actualShenzhen[1].toString()))
      .toStrictEqual(
        JSON.stringify(
          expectedValueContainerValue(
            'NIS',
            'Y',
            1500,
            300,
            5,
            'DV40',
            25,
          ),
        ),
      );

    /*'FCL Freight Charge: [NIS 440, mandatory], per rate of NIS / DV20,'*/
    expect(JSON.stringify(actualShanghai[1].toString()))
      .toStrictEqual(
        JSON.stringify(
          expectedValueContainerValue(
            'NIS',
            'Y',
            1601.6,
            320.32,
            5,
            'DV40',
            25,
          ),
        ),
      );
    /*
        /!*'FCL Freight Charge: [NIS 1601.6, mandatory], per rate of NIS / DV40,'*!/
        expect(actualShanghai[1].toString()).toStrictEqual(JSON.stringify(
          expectedValueContainerValue(
            'NIS',
            'Y',
            440,
            220,
            2,
            'DV20',
            25,
          )
        ));
    */

  },
);