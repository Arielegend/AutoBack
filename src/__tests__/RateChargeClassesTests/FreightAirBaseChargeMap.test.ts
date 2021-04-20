import { FreightAirBaseChargeMap } from '../../RateChargeClasses/BaseCharges/Fob/FreightAirBaseChargeMap';
import { processedAirTable, requestDetails } from '../../Mocks/airMockObjects';


test('AirFreightBase',
  () => {
    
    const actualFreightTransport = new FreightAirBaseChargeMap(processedAirTable())
      .calcMe({ name: 'Boxes', requestDetails: requestDetails().boxes });

    const airFreightCharge = actualFreightTransport.toString();
    expect(
      JSON.stringify(airFreightCharge),
    ).toStrictEqual(
      JSON.stringify(['\nAIR Freight Charge: [NIS 2505, mandatory], per rate of NIS 3 / Physical/Volume Weight (Volume Weight = 1 m3 * 167 kg),',
        '\n\tCharge Input:',
        '\n\t5 Boxes:',
        '\n\t~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
        '\n\tDimensions: 100 cm X 100 cm X 100 cm,',
        '\n\tCBM: 500 cm3',
        '\n\tWeight: 100 kg,',
        '\n\t~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
        '\n\tTotal Weight: 500 kg,',
        '\n\tTotal Volume Weight: 835 kg, ratio: 167,',
        '\n\tQuoted Weight: 835 kg.\n\t',
      ].join('')),
    );
  },
);