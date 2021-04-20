import { RateLineParams } from '../Rates/rateTypes';
import { RequestDetails, RequestFobAir, RequestFobFcl, RequestFobLcl } from './requestTypes';
/**
 *  Applying Charge Classes
 *  */
import { ApplyingChargeSet } from '../ApplyingCharges/ApplyingChargeSet';
export declare class Quote {
    quoteCharges: ApplyingChargeSet | 'Shipment Details Are Invalid.';
    rateLine: RateLineParams;
    constructor(rateLine: RateLineParams, requestDetails: RequestDetails);
    /** For each charge map present in a given RateLineParams,
     *  calculate total per request details charge.
     *
     *  RateLineSet Class will give you exactly what ChargeMap exists in any of the parts,
     *  (when you do JSON.parse), for each instantiate an appropriate new ChargeMap(chargeMapString)
     *  object, and do calcMe().
     *  NOTE: We will add the userDeltaUsd when iterating over all rate lines.
     * ADDITIONAL NOTE: type RequestDetails is not necessarily what need, change it if you need to.
     * */
    generateOffer(rateLine: RateLineParams, requestDetails: RequestDetails): ApplyingChargeSet | 'Shipment Details Are Invalid.';
    fobFclOffer(freightTransportCharges: string, localCharges: string, requestDetails: RequestFobFcl): ApplyingChargeSet | 'Shipment Details Are Invalid.';
    fobLclOffer(freightTransportCharges: string, localCharges: string, requestDetails: RequestFobLcl): ApplyingChargeSet | 'Shipment Details Are Invalid.';
    fobAirOffer(freightTransportCharges: string, localCharges: string, requestDetails: RequestFobAir): ApplyingChargeSet | 'Shipment Details Are Invalid.';
}
