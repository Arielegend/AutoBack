import { RequestFobAir } from '../../RFQ/requestTypes';
import { GridElement, RateLineParams, RateType } from '../../Rates/rateTypes';
import {RateLineSet} from '../../Rates/Rate';
import { LocalsByWeightChargeMap } from '../../RateChargeClasses/LocalsByWeightChargeMap';
import { reduceApplyingChargesArrayToTotal } from '../../ApplyingCharges/chargeUtils';
import { FreightAirBaseChargeMap } from '../../RateChargeClasses/BaseCharges/Fob/FreightAirBaseChargeMap';
import { Quote } from '../../RFQ/Quote';
import {
  inputAirLocalsObject,
  inputFreightTransportRatesObject,
  localsAirByWeightTable,
  processedAirTable,
} from '../../Mocks/airMockObjects';

/** Air  Input Constants*/
const generalInfo = {
  rateType: 'ImportFOBAIR' as RateType,
  rateID: 'e5f1828f-b177-4bd6-955d-7d4dfaa53bdf',
  carrierName: 'd',
  freightForwarderName: 'b',
  rateName: 'b',
  region: 'Europe',
  validFrom: 'Today at 14:33',
  validTo: '2020-12-17',
};

export const inputAirObject = () => {
  return {
    ...generalInfo,
    freightTransportRatesObject: inputFreightTransportRatesObject(),
    localRatesObject: inputAirLocalsObject(),
  };
};

const rateLine: RateLineParams = new RateLineSet(inputAirObject()).rateChargesPerPointOfOrigin[0] as RateLineParams;

export let requestDetails: RequestFobAir = {
  boxes: [
    {
      height: { value: '100', unit: 'cm' },
      width: { value: '100', unit: 'cm' },
      length: { value: '100', unit: 'cm' },
      weight: { value: '100', unit: 'kg' },
      count: '5',
    },
  ],
};

test('Fob Air Local Charges By Weight',
  () => {


    const airChargeProcessedTable = processedAirTable();

    const freightAirBaseChargeMap = new FreightAirBaseChargeMap(airChargeProcessedTable);

    const actualFreightTransport = freightAirBaseChargeMap.calcMe({
      name: 'Boxes',
      requestDetails: requestDetails.boxes,
    });

    const expectedLocalChargesByWeightApplied =
      new LocalsByWeightChargeMap(localsAirByWeightTable() as Pick<GridElement, keyof GridElement>[][])
        .calcMe({ name: 'Boxes', requestDetails: requestDetails.boxes });

    /* const yataChargeMap = new YataChargeMap(yataChargeSet());
 */
    if (typeof actualFreightTransport !== 'string') {
      const totalAirFreightCharge = reduceApplyingChargesArrayToTotal(actualFreightTransport);


      if (totalAirFreightCharge !== undefined) {

        /*

                const expectedYataApplied = yataChargeMap.calcMe(totalAirFreightCharge);


                if (typeof expectedYataApplied !== 'string' && typeof expectedLocalChargesByWeightApplied !== 'string') {}
        */

        const airQuote = new Quote(rateLine, requestDetails).quoteCharges;

        const value = airQuote.toString();
        // typeof airQuote !== 'string' && console.log(value);
        typeof airQuote !== 'string' &&
        expect(value).toStrictEqual(
           [
            '\nFREIGHT TRANSPORT:',
            '\n=================',
            '\nMandatory Total Cost: NIS 2505, USD 0, EUR 0,',
            '\nNon Mandatory Total Cost: NIS 0, EUR 0, USD 0.',

            '\n\nMandatory charges:',
            '\n~~~~~~~~~~~~~~~~~~',

            '\n\n\tCharges In NIS:',
            '\n\t---------------',
            '\n\tAIR Freight Charge: [NIS 2505, mandatory], per rate of NIS 3 / Physical/Volume Weight (Volume Weight = 1 m3 * 167 kg),',
            '\n\t\tCharge Input:',
            '\n\t\t5 Boxes:',
            '\n\t\t~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
            '\n\t\tDimensions: 100 cm X 100 cm X 100 cm,',
            '\n\t\tCBM: 500 cm3',
            '\n\t\tWeight: 100 kg,',
            '\n\t\t~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
            '\n\t\tTotal Weight: 500 kg,',
            '\n\t\tTotal Volume Weight: 835 kg, ratio: 167,',
            '\n\t\tQuoted Weight: 835 kg.\n\t\t',

            '\n\tCharges In USD:',
            '\n\t---------------',
            '\n\tCharges In EUR:',
            '\n\t---------------',

            '\n\nNon Mandatory charges:',
            '\n~~~~~~~~~~~~~~~~~~~~~~',

            '\n\n\tCharges In NIS:',
            '\n\t---------------',
            '\n\tCharges In USD:',
            '\n\t---------------',
            '\n\tCharges In EUR:',
            '\n\t---------------',

            '\n\nLOCAL:',
            '\n=====',
            '\nMandatory Total Cost: NIS 273.5, USD 0, EUR 0,',
            '\nNon Mandatory Total Cost: NIS 0, EUR 0, USD 0.',

            '\n\nMandatory charges:',
            '\n~~~~~~~~~~~~~~~~~~',

            '\n\n\tCharges In NIS:',
            '\n\t---------------',
            '\n\tYATA Charge: [NIS 250.5, mandatory], per rate of Total Air Freight,',
            '\n\t\tCharge Input:NIS 2505',
            '\n\tFix Charge: [NIS 23, mandatory].',
            '\n\tCharges In USD:',
            '\n\t---------------',
            '\n\tCharges In EUR:',
            '\n\t---------------',

            '\n\nNon Mandatory charges:',
            '\n~~~~~~~~~~~~~~~~~~~~~~',

            '\n\n\tCharges In NIS:',
            '\n\t---------------',
            '\n\tCharges In USD:',
            '\n\t---------------',
            '\n\tCharges In EUR:',
            '\n\t---------------\n',
          ].join(''),
        );

      }
    }
  },
);
