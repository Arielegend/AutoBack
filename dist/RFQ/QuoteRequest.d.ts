import { RequestDetails } from './requestTypes';
import { Quote } from './Quote';
import { RateType } from '../Rates/rateTypes';
import { ChargeName, CurrencyType, FixCharge, FixChargeMapType, FixTypeRequest, RateLineParams } from '../Rates/rateTypes';
import { ApplyingCharge } from '../ApplyingCharges/ApplyingCharge';
export declare class QuoteRequest {
    rateType: RateType;
    requestId: string;
    clientId: string;
    requestHash: string;
    requestDetails: RequestDetails;
    offers: Quote[];
    constructor(rateType: RateType, requestId: string, pointOfOrigin: string, pointOfDestination: string, fromDate: string, toDate: string, clientId: string, requestDetails: RequestDetails);
    getRelevantRateLines(rateType: RateType, requestHash: string): RateLineParams[];
    getAddOns: (clientId: string) => ApplyingCharge<'FixCharges', ChargeName, FixCharge, FixChargeMapType, CurrencyType, 'Y', FixTypeRequest>[];
    getLocation: (rateType: RateType, pointSerialized: string) => string;
    toString: () => string;
}
