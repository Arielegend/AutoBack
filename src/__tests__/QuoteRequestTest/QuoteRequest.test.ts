import { v4 as uuid } from 'uuid';

import { QuoteRequest } from '../../RFQ/QuoteRequest';
import { Port } from '../../SystemLocations/Port';
import { RequestDetails } from '../../RFQ/requestTypes';

test(
  'QuoteRequest',
  () => {
    const requestId = uuid();
    const clientId = uuid();

    const pointOfOrigin = JSON.stringify(
      new Port({
          portName: 'Hanover_Port',
          portCode: 'HNVR',
          postCode: '13245',
          city: 'Hanover',
          countryName: 'Germany',
          countryCode: 'DEU',
          region: 'Europe',
        },
      ).getPointObj(),
    );
     const pointOfDestination = JSON.stringify(
      new Port({
          portName: 'Ashdod_Port',
          portCode: 'ASHD',
          postCode: '53255',
          city: 'Ashdod',
          countryName: 'Israel',
          countryCode: 'ILS',
          region: 'Europe',
        },
      ).getPointObj(),
    );

    const requestDetails: RequestDetails = {
      containers: [
        {
          containerType: 'DV20',
          count: '3',
          weight: { value: '23 ton', unit: 'ton' },
        },
        {
          containerType: 'DV40',
          count: '2',
          weight: { value: '33 ton', unit: 'ton' },
        },
      ],
    };

    const quoteRequest =
      new QuoteRequest(
        'ImportFOBOCEANFCL',
        requestId,
        pointOfOrigin,
        pointOfDestination,
        '17-02-2021',
        '27-02-2021',
        clientId,
        requestDetails,
      );

    const quoteRequestStr = quoteRequest.toString();

    console.log(quoteRequestStr)

   },
);