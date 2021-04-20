import { RateLineParams } from '../Rates/rateTypes';

import { RequestDetails, RequestFobAir, RequestFobFcl, RequestFobLcl } from './requestTypes';

/** Shared Map Classes.*/
import { FixChargeMap } from '../RateChargeClasses/FixChargeMap';
import { LocalsByWeightChargeMap } from '../RateChargeClasses/LocalsByWeightChargeMap';

/**
 *  Freight Transport Fob Lcl Base Charge Map Classes.
 *  */
import { FreightLclBaseChargeMap } from '../RateChargeClasses/BaseCharges/Fob/FreightLclBaseChargeMap';

/**
 *  Freight Transport Fob Air Base Charge Map Classes.
 *  */
import { FreightAirBaseChargeMap } from '../RateChargeClasses/BaseCharges/Fob/FreightAirBaseChargeMap';
import { YataChargeMap } from '../RateChargeClasses/YataChargeMap';

/**
 *  Freight Transport Fob Fcl Base Charge Map Classes.
 *  */
import { FreightFclBaseChargeMap } from '../RateChargeClasses/BaseCharges/Fob/FreightFclBaseChargeMap';
import { HeavyWeightChargesMap } from '../RateChargeClasses/HeavyWeightChargeMap';

/**
 * Freight Transport FobFcl Base Charge Map Classes.
 * */
import { ThcChargeMap } from '../RateChargeClasses/ThcChargeMap';
import { LocalContainerChargeMap } from '../RateChargeClasses/LocalContainerChargeMap';

/**
 *  Applying Charge Classes
 *  */
import { ApplyingChargeSet } from '../ApplyingCharges/ApplyingChargeSet';
import { TotalChargeSet } from '../ApplyingCharges/chargeTypes';
import { reduceApplyingChargesArrayToTotal } from '../ApplyingCharges/chargeUtils';

export class Quote {

  quoteCharges: ApplyingChargeSet | 'Shipment Details Are Invalid.';
  rateLine: RateLineParams;

  constructor(rateLine: RateLineParams, requestDetails: RequestDetails) {
    this.rateLine = rateLine;
    this.quoteCharges = this.generateOffer(rateLine, requestDetails);
  }

  /** For each charge map present in a given RateLineParams,
   *  calculate total per request details charge.
   *
   *  RateLineSet Class will give you exactly what ChargeMap exists in any of the parts,
   *  (when you do JSON.parse), for each instantiate an appropriate new ChargeMap(chargeMapString)
   *  object, and do calcMe().
   *  NOTE: We will add the userDeltaUsd when iterating over all rate lines.
   * ADDITIONAL NOTE: type RequestDetails is not necessarily what need, change it if you need to.
   * */
  generateOffer(rateLine: RateLineParams, requestDetails: RequestDetails): ApplyingChargeSet | 'Shipment Details Are Invalid.' {
    const { originCharges, freightTransportCharges, localCharges, ...otherRateLineParams } = rateLine;
    switch (rateLine.rateType) {
      case 'ImportFOBOCEANFCL':
        return this.fobFclOffer(freightTransportCharges, localCharges, requestDetails as RequestFobFcl);

      case 'ImportFOBOCEANLCL':
        return this.fobLclOffer(freightTransportCharges, localCharges, requestDetails as RequestFobLcl);

      case 'ImportFOBAIR':
        return this.fobAirOffer(freightTransportCharges, localCharges, requestDetails as RequestFobLcl);

      default:
        return 'Shipment Details Are Invalid.';
    }
  }

  fobFclOffer(freightTransportCharges: string, localCharges: string, requestDetails: RequestFobFcl): ApplyingChargeSet | 'Shipment Details Are Invalid.' {

    const { fclCharges, oceanFclHeavyRates, oceanFclFreightFix } = JSON.parse(freightTransportCharges);
    const { localsOceanFclFixRates, localsOceanFclContainerRates, thcObject } = JSON.parse(localCharges);

    /** Calculating each of the freight transport charge sets. */
    const fclChargesApplied = new FreightFclBaseChargeMap(fclCharges).calcMe({ name: 'Containers', requestDetails: requestDetails.containers });
    const oceanFclHeavyRatesApplied = new HeavyWeightChargesMap(oceanFclHeavyRates).calcMe({ name: 'Containers', requestDetails: requestDetails.containers});
    const oceanFclFreightFixApplied = new FixChargeMap(oceanFclFreightFix).calcMe();

    /** Calculating each of the local charge sets. */
    const localsOceanFclFixRatesApplied = new FixChargeMap(localsOceanFclFixRates).calcMe();
    const localsOceanFclContainerRatesApplied = new LocalContainerChargeMap(localsOceanFclContainerRates).calcMe({ name: 'Containers', requestDetails: requestDetails.containers});
    const thcChargesApplied = new ThcChargeMap(thcObject).calcMe({name: 'Containers', requestDetails: requestDetails.containers});


    /** If all return ApplyingChargeSet(localRateCharges, freightTransportCharges), */
    if (
      typeof fclChargesApplied !== 'string' &&
      typeof oceanFclHeavyRatesApplied !== 'string' &&
      typeof oceanFclFreightFixApplied !== 'string' &&

      typeof localsOceanFclFixRatesApplied !== 'string' &&
      typeof localsOceanFclContainerRatesApplied !== 'string' &&
      typeof thcChargesApplied !== 'string'
    ) {
      return new ApplyingChargeSet(
        [
          ...localsOceanFclFixRatesApplied,
          ...localsOceanFclContainerRatesApplied,
          ...thcChargesApplied,
        ],

        [
          ...fclChargesApplied,
          ...oceanFclHeavyRatesApplied,
          ...oceanFclFreightFixApplied
        ],
      );
    }
    return 'Shipment Details Are Invalid.';
  }

  fobLclOffer(freightTransportCharges: string, localCharges: string, requestDetails: RequestFobLcl): ApplyingChargeSet | 'Shipment Details Are Invalid.' {
    const { lclCharges, limits } = JSON.parse(freightTransportCharges);
    const { oceanLclLocalFix, oceanLclLocalWeight } = JSON.parse(localCharges);

    const freightLclBaseCharge = JSON.stringify(lclCharges);

    /** Calculate each part. */
    const lclChargesApplied = new FreightLclBaseChargeMap(freightLclBaseCharge).calcMe({ name: 'Boxes', requestDetails: requestDetails.boxes });

    const oceanLclLocalFixApplied = new FixChargeMap(oceanLclLocalFix).calcMe();
    const oceanLclLocalWeightApplied = new LocalsByWeightChargeMap(oceanLclLocalWeight).calcMe({ name: 'Boxes', requestDetails: requestDetails.boxes });

    /** If all charges in ApplyingCharges[] list are all valid, */
    if (
      typeof oceanLclLocalFixApplied !== 'string' &&
      typeof oceanLclLocalWeightApplied !== 'string' &&
      typeof lclChargesApplied !== 'string'
    ) {
      /** If all return ApplyingChargeSet(localRateCharges, freightTransportCharges), */
      return new ApplyingChargeSet(
        [
          ...oceanLclLocalWeightApplied,
          ...oceanLclLocalFixApplied,
        ],
        lclChargesApplied,
      );
    }
    /** Otherwise, return the details are invalid.
     * TODO handle error managment.
     * */
    return 'Shipment Details Are Invalid.';
  }

  fobAirOffer(freightTransportCharges: string, localCharges: string, requestDetails: RequestFobAir): ApplyingChargeSet | 'Shipment Details Are Invalid.' {
    const { airFobCharges, limits } = JSON.parse(freightTransportCharges);
    const { airLocalsFix, airLocalsByWeight, yata } = JSON.parse(localCharges);

    const freightAirBaseChargeMap = new FreightAirBaseChargeMap(airFobCharges);


    const airFreightChargesApplied = freightAirBaseChargeMap.calcMe({ name: 'Boxes', requestDetails: requestDetails.boxes });

    const fixChargeMap = new FixChargeMap(airLocalsFix);
    const airLocalFixApplied = fixChargeMap.calcMe();

    const localsByWeightChargeMap = new LocalsByWeightChargeMap(airLocalsByWeight);

    const airLocalWeightApplied = localsByWeightChargeMap.calcMe({ name: 'Boxes', requestDetails: requestDetails.boxes });

    if (typeof airFreightChargesApplied === 'string') return 'Shipment Details Are Invalid.';
    const freightPartCostAsTotalChargeSet: TotalChargeSet | undefined = reduceApplyingChargesArrayToTotal(airFreightChargesApplied);

    if (freightPartCostAsTotalChargeSet === undefined) return 'Shipment Details Are Invalid.';

    const yataChargeMap = new YataChargeMap(yata);
    const yataCharges = yataChargeMap.calcMe({name: 'TotalChargeSet', requestDetails: freightPartCostAsTotalChargeSet});


    if (
      typeof yataCharges !== 'string' &&
      typeof airLocalFixApplied !== 'string' &&
      typeof airLocalWeightApplied !== 'string'
    ) {


      return new ApplyingChargeSet(
        [
          ...yataCharges,
          ...airLocalFixApplied,
        ],
        airFreightChargesApplied,
      );
    }


    return 'Shipment Details Are Invalid.';
  }

}


