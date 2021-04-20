import { RequestDetails } from './requestTypes';
import { Quote } from './Quote';
import { RateType } from '../Rates/rateTypes';
import {
  ChargeName,
  CurrencyType,
  FixCharge,
  FixChargeMapType,
  FixTypeRequest,
  RateLineParams,
} from '../Rates/rateTypes';
import { ApplyingCharge } from '../ApplyingCharges/ApplyingCharge';
import { Port } from '../SystemLocations/Port';
import { PortMeta } from '../SystemLocations/SystemLocationTypes';
import { Box } from '../CargoUnit/Box';
import { Container } from '../CargoUnit/Container';


export class QuoteRequest {
  rateType: RateType;
  requestId: string;
  clientId: string;
  requestHash: string;
  requestDetails: RequestDetails;
  offers: Quote[];

  constructor(
    rateType: RateType,
    requestId: string,
    pointOfOrigin: string,
    pointOfDestination: string,
    fromDate: string,
    toDate: string,
    clientId: string,
    requestDetails: RequestDetails,
  ) {
    /** TODO:
     * * Build Request Hash: name: "ByTypeValidity" value:  rateType +  pointOfOrigin + pointOfDestination + fromDate + toDate,
     * * Get Client Add on,
     * * Get Relevant RateLine[],
     * * map new Quote() on RateLine[],*/

    this.rateType = rateType;
    this.requestId = requestId;
    this.clientId = clientId;

    const pointOfOriginHash = this.getLocation(rateType, pointOfOrigin);
    const pointOfDestinationHash = this.getLocation(rateType, pointOfDestination);

    const requestHash = [rateType, pointOfOriginHash, pointOfDestinationHash, fromDate, toDate].join('#');


    /** TODO "Block" requests by passing the request id. */

    /** Async Code */
    const addOns = this.getAddOns(clientId);
    const rateLines = this.getRelevantRateLines(rateType, requestHash);

    /** TODO: Add Client Add ons to Quote params */
    this.offers = rateLines.map(rateLine => new Quote(rateLine, requestDetails));

    this.requestDetails = requestDetails;
    this.requestHash = requestHash;

  }

  getRelevantRateLines(rateType: RateType, requestHash: string): RateLineParams[] {
    return [];
  }

  getAddOns = (clientId: string):
    ApplyingCharge<'FixCharges', ChargeName, FixCharge, FixChargeMapType, CurrencyType, 'Y', FixTypeRequest>[] =>
    [];


  getLocation = (rateType: RateType, pointSerialized: string) => {
    const parsedLocation = JSON.parse(pointSerialized);
    switch (rateType) {
      case 'ImportFOBAIR':
        return new Port(parsedLocation as PortMeta).getLocationHash();

      case 'ImportFOBOCEANFCL':
        return new Port(parsedLocation as PortMeta).getLocationHash();

      case 'ImportFOBOCEANLCL':
        return new Port(parsedLocation as PortMeta).getLocationHash();

      default:
        return '';
    }
  };

  toString = () => {
    const requestArray = this.requestHash.split('#');
    const pointsArray = requestArray.slice(1, requestArray.length - 2);


    /** Since the 2 points are always with equal number of fields, it must be that the
     * array is of even length.
     * */
    const [pointOfOriginTuple, pointOfDestinationTuple] = [
      pointsArray.slice(0, pointsArray.length / 2),
      pointsArray.slice(pointsArray.length / 2, pointsArray.length),
    ];

    const [fromDate, toDate] = requestArray.slice(requestArray.length - 2, requestArray.length);


    const requestDetails =
      'containers' in this.requestDetails ?
        this.requestDetails
          .containers
          .map(
            container =>
              new Container(
                container.containerType,
                container.weight,
                container.count,
              ).toString(),
          ) :
        this.requestDetails
          .boxes
          .map(
            box =>
              new Box(
                {
                  length: box.length,
                  width: box.width,
                  height: box.height,
                },
                box.weight,
                '1',
                box.count,
              ).toString(),
          );

    return [
      '\n"QuoteRequest": [',
      `\n\t["requestId", "${this.requestId}]"`,
      `\n\t["requestId", "${this.clientId}"]`,
      `\n\t["rateType", "${this.rateType}"]`,
      `\n\t["pointOfOriginTuple", "(${pointOfOriginTuple.join(', ')})"]`,
      `\n\t["pointOfDestinationTuple", "(${pointOfDestinationTuple.join(', ')})"]`,
      `\n\t["fromDate", "${fromDate}"]`,
      `\n\t["toDate", "${toDate}"]`,
      `\n\t["requestDetails",\n\t\t${requestDetails.join('\n\t\t')}\n\t]`,
      '\n]',
    ].join('');

  };

}