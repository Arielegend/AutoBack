import ReactDataSheet from 'react-datasheet';
import { BoxDetails, ContainerDetails } from '../RFQ/requestTypes';
import { FixChargeMap } from '../RateChargeClasses/FixChargeMap';
import { HeavyWeightChargesMap } from '../RateChargeClasses/HeavyWeightChargeMap';
import { LocalContainerChargeMap } from '../RateChargeClasses/LocalContainerChargeMap';
import { LocalsByWeightChargeMap } from '../RateChargeClasses/LocalsByWeightChargeMap';
import { ApplyingCharge } from '../ApplyingCharges/ApplyingCharge';
import { TotalChargeSet } from '../ApplyingCharges/chargeTypes';
import { GenericMeasure } from 'safe-units';
import { Box } from '../CargoUnit/Box';
import { Container } from '../CargoUnit/Container';

/* GridElement Field Type */
export type CellFieldType =
  | 'cm'
  | 'kg'
  | 'ton'
  | 'decimal'
  | 'int'
  | 'date'
  | 'currency'
  | 'day'
  | 'boolean'
  | 'options'
  | 'percentOfCurrency'
  | 'dropdown';
/* System Units */

export type CurrencyType = 'NIS' | 'USD' | 'EUR';

/*
 GridElement object. Autolog Forms use this object to submit tabular data.
*/
export interface GridElement extends ReactDataSheet.Cell<GridElement> {
  field: string;
  value: string | number | null;
  fieldType?: CellFieldType;
  currencyType?: CurrencyType;
  fieldName?: string;
  head?: boolean;
  readOnly?: boolean;
  nonDeletable?: boolean;
  component?: JSX.Element;
  colSpan?: number;
  forceComponent?: boolean;
  style?: Object;
  edited?: boolean;
  updated?: boolean;
  selected?: boolean;
  options?: string[];
  name?: string;
  section?: 'vertical' | 'horizontal';
  memberOfSection?: string;
  sectionIndex?: number;
  paddingCell?: boolean;
  staticSection?: boolean;
  fieldMetadata?: IValues;
  rowSpan?: number;
  columnMetadataSection?: GridElement[][];
}

/* System submission form type. */
export interface IValues {
  /* Key value pairs for all the field values with key being the field name */
  [key: string]: string | IValues;
}

export interface NonNestedIValues {
  /* Key value pairs for all the field values with key being the field name */
  [key: string]: string;
}

/* System mandatory check */
export type Mandatory = 'Y' | 'N';

/* Units of charge. */
export type CurrencyCharge = {
  amount: string;
  currency: CurrencyType;
  mandatory: Mandatory;
};


export type ModeOfTransport = 'AIR' | 'OCEAN';


export type ApplyingCurrencyCharge<C extends CurrencyType, M extends Mandatory> = {
  amount: string;
  currency: C;
  mandatory: M;
};

/* Serialized Percent Value. */
export type PercentageCharge = { percentage: string }
/* System Measurement Types */
export type WeightUnit = 'kg' | 'ton';

export type Weight<T extends WeightUnit = 'kg'> = { value: string; unit: WeightUnit };

export type Length = { value: string; unit: 'cm' };
export type PhysicalObjectSize = { length: Length; width: Length, height: Length }
export type Volume = { length: Length; width: Length, height: Length, volume: GenericMeasure<number, { length: '3' }>, unit: 'cm3' };

export type VolumeWeightParam = { weight: Weight; volumeUnit: 'CBM' };

export type MeasurementLimits = {
  heightLimit: Length;
  weightLimits: Weight;
  weightLimitPerBox: Weight;
};

export type LimitsShipmentsAirLcl = {
  limitHeightShipment: string;
  limitWeightShipment: string;
  limitWeightBox: string;
};

/* System container types.*/
export type ContainerType =
  | 'DV20'
  | 'DV40'
  | 'HQ40'
  | 'OT20'
  | 'OT40'
  | 'RF20'
  | 'RF40'
  | 'FR40'
  | 'TK20';
export type ContainerLimits = Map<ContainerType, MeasurementLimits> | 'No Limits';

export type ChargeName = string & Exclude<string, 'perTon'>;

export type ContainerCharge = {
  charge: CurrencyCharge;
  container: ContainerType;
};
export type LocalContainerCharges = Map<ChargeName, ContainerCharge>;
export type WeightRatioRule = {
  ratio: string;
  charge: CurrencyCharge;
};
export type FixCharge = { charge: CurrencyCharge };

export type LclKey = 'perTon';
export type AirChargeKey = Weight;

export type RateChargeKey =
  ChargeName
  | ContainerType
  | Weight<'ton'>
  | LclKey
  | Weight
  | 'percent'
  | AirChargeKey
  | 'Total'
export type CurrencyRateChargeType =
  WeightRatioRule
  | ContainerCharge
  | PercentageCharge
  | FixCharge;


export type FixCharges = Map<ChargeName, FixCharge>;
export type WeightRulesCharges = Map<ChargeName, WeightRatioRule>;
export type WeightCharges<T extends WeightUnit = 'kg'> = Map<Weight<T>, WeightRatioRule>;
export type AirChargeMap = Map<AirChargeKey, WeightRatioRule>
export type HeavyWeightCharges = Map<Weight<'ton'>, FixCharge>;
export type YataCharge = Map<'percent', PercentageCharge>
export type ThcCharge = Map<ContainerType, ContainerCharge>;


// /* Zone Charge defined by  */
// export type ZoneCharges = Map<{ zoneDefinition: string },
//   LclCharges | FclCharges>;

export type RateChargeAlias =
  | 'ThcCharge'
  | 'LclCharge'
  | 'LocalContainerCharges'
  | 'HeavyWeightCharges'
  | 'WeightCharges'
  | 'WeightRulesCharges'
  | 'FixCharges'
  | 'YataCharge'
  | 'AirChargeMap'
  | 'FclCharge'
  | 'ZeroCharge'
  | 'TotalNisCharge'
  | 'TotalUsdCharge'
  | 'TotalEurCharge'

export type TotalAlias = RateChargeAlias & 'TotalNisCharge'
  | 'TotalUsdCharge'
  | 'TotalEurCharge'

export type ChargeMapIterableType<RK extends RateChargeKey, R extends CurrencyRateChargeType> = Map<RK, R>;


export type ChargeMapType<RN extends RateChargeAlias, RK extends RateChargeKey, R extends CurrencyRateChargeType> = { chargeName: RN, chargeRateLines: ChargeMapIterableType<RK, R> }

export type ThcChargeMapType = ChargeMapType<'ThcCharge', ContainerType, ContainerCharge>
export type LclChargeMapType = ChargeMapType<'LclCharge', LclKey, WeightRatioRule>
export type LocalContainerChargeMapType = ChargeMapType<'LocalContainerCharges', ChargeName, ContainerCharge>
export type HeavyWeightChargeMapType = ChargeMapType<'HeavyWeightCharges', Weight<'ton'>, FixCharge>;
export type WeightChargeMapType = ChargeMapType<'WeightCharges', Weight, WeightRatioRule>
export type WeightRuleChargeMapType = ChargeMapType<'WeightRulesCharges', ChargeName, WeightRatioRule>
export type FixChargeMapType = ChargeMapType<'FixCharges', ChargeName, FixCharge>;
export type YataChargeMapType = ChargeMapType<'YataCharge', 'percent', PercentageCharge>;
export type AirChargeMapType = ChargeMapType<'AirChargeMap', AirChargeKey, WeightRatioRule>;
export type FclChargeMapType = ChargeMapType<'FclCharge', ContainerType, ContainerCharge>;


/**
 *  Query Rate Type - queried when a quote of @RateType is requested.
 * * TODO: write full explanation.
 * */


export type RateChargeMapType =
  (| ThcChargeMapType
    | LclChargeMapType
    | LocalContainerChargeMapType
    | HeavyWeightChargeMapType
    // | WeightChargeMapType
    | WeightRuleChargeMapType
    | FixChargeMapType
    | YataChargeMapType
    | AirChargeMapType
    | FclChargeMapType
    )
  & ChargeMapType<RateChargeAlias, RateChargeKey, CurrencyRateChargeType>

export type RateType =
  | 'ImportFOBOCEANFCL'
  | 'ImportFOBOCEANLCL'
  | 'ImportFOBAIR'
  | 'ImportEXWOCEANFCL'
  | 'ImportEXWOCEANLCL'
  | 'ImportEXWAIR';

/**
 * Rate Step Form Submission type.
 * * TODO: write full explanation.
 * */

export type RateSubmissionParams = {
  id: string;
  rateName: string;
  freightForwarderName: string;
  carrierName: string;
  rateType: RateType;
  region: string;
  validFrom: string;
  validTo: string;
  originRates?: string;
  freightTransportRates: string;
  localRates: string;
};

export type RateSubmissionParamsDeserialized = {
  rateID: string;
  rateName: string;
  freightForwarderName: string;
  region: string;
  carrierName: string;
  rateType: RateType;
  validFrom: string;
  validTo: string;
  originRatesObject?: IValues;
  freightTransportRatesObject: IValues;
  localRatesObject: IValues;
};

/**
 * Extracted Rate Line per Point of Origin -> Point of Arrival.
 * * TODO: write full explanation.
 */
export interface RateLineParams {
  rateID: string;
  rateName: string;
  pointOfOrigin: string;
  pointOfDestination: string;
  freightForwarderName: string;
  carrierName: string;
  rateType: RateType;
  validFrom: string;
  validTo: string;
  originCharges: string;
  freightTransportCharges: string;
  localCharges: string;
}

export type ChargeSetType = 'FCL' | 'LCL' | 'Air' | 'Inland' | 'Fix';

export type ErrorMessage =
  | 'Invalid FCL ChargeSet.'
  | 'Invalid LCL ChargeSet.'
  | 'Invalid Inland ChargeSet.'
  | 'Invalid Fix ChargeSet.'
  | 'Invalid Rate Submission.'

/* GeneralInfoRate is the first page of Rate upload...  */
export type GeneralInfoRate = {
  rateID: string;
  rateType: RateType;
  rateName: string;
  freightForwarderName: string;
  carrierName: string;
  validFrom: string;
  validTo: string;
  region: string;
  cargoLoad?: string;
};

export type LclChargeParams =
  {
    generalInfo: GeneralInfoRate,
    oceanLclBaseRates: Pick<GridElement, keyof GridElement>[][],
    limits: LimitsShipmentsAirLcl,
    freightPartLclRatio: string,
    oceanLclLocalFix: FixChargeMap,
    oceanLclLocalWeight: LocalsByWeightChargeMap,
  };
/* TODO narrow the fields to expected columns different columns types */
export type FclChargeParams = {
  generalInfo: GeneralInfoRate;
  oceanFclBaseRates: Pick<GridElement, keyof GridElement>[][];
  oceanFclHeavyRates: HeavyWeightChargesMap;
  oceanFclFreightFix: FixChargeMap;
  localsOceanFclFixRates: FixChargeMap;
  localsOceanFclContainerRates: LocalContainerChargeMap;
  thc20: string;
  thc40: string;
};
export type AirChargeParams = {
  generalInfo: GeneralInfoRate; //Need actually to do it by declared type GeneralInfoRate.. make sure for it ><
  airBaseRates: Pick<GridElement, keyof GridElement>[][];
  limits: LimitsShipmentsAirLcl;
  freightPartAirRatio: string;
  airLocalsFix: FixChargeMap;
  airLocalsByWeight: LocalsByWeightChargeMap // when done with this rate need to remove the any
  yata: PercentageCharge;
};

export type InvalidChargeSetMessage<R extends RateChargeMapType> =
  R extends ThcChargeMapType ? 'Invalid THC Charge.' :
    R extends LclChargeMapType ? 'Invalid LCL Base Charge' :
      R extends LocalContainerChargeMapType ? 'Invalid Locals By Container ChargeSet.' :
        R extends FclChargeMapType ? 'Invalid FCL ChargeSet.' :
          R extends HeavyWeightChargeMapType ? 'Invalid Heavy Weight ChargeSet.' :
            R extends AirChargeMapType ? 'Invalid Air Freight Charge' :
              // R extends WeightChargeMapType ? 'Invalid Weight ChargeSet.' :
                R extends WeightRuleChargeMapType ? 'Invalid Locals By Weight ChargeSet.' :
                  R extends YataChargeMapType ? 'Invalid Yata' :

                    'Invalid Fix ChargeSet.';


export type ChargeMapName<R extends RateChargeMapType> =
  R extends ThcChargeMapType ? 'ThcCharge' :
    R extends LclChargeMapType ? 'LclCharge' :
      R extends LocalContainerChargeMapType ? 'LocalContainerCharges' :
        R extends HeavyWeightChargeMapType ? 'HeavyWeightCharges' :
          R extends WeightChargeMapType ? 'WeightCharges' :
            R extends WeightRuleChargeMapType ? 'WeightRulesCharges' :
              R extends FixChargeMapType ? 'FixCharges' :
                R extends YataChargeMapType ? 'YataCharge' :
                  R extends AirChargeMapType ? 'AirChargeMap' :
                    'FclCharge';


export type BoxesTypeRequest = { name: 'Boxes', requestDetails: BoxDetails[], chargeParamObj: Box[] };
export type ContainerTypeRequest = { name: 'Containers', requestDetails: ContainerDetails[], chargeParamObj: Container[] };
export type TotalChargeSetTypeRequest = {
  name: 'TotalChargeSet',
  requestDetails: TotalChargeSet,
  chargeParamObj:
    ApplyingCurrencyCharge<CurrencyType, Mandatory>
};
export type FixTypeRequest = { name: 'FixChargeSet', details: [], chargeParamObj: [] };

export type QuoteParam = BoxesTypeRequest | ContainerTypeRequest | TotalChargeSetTypeRequest | FixTypeRequest;

export type ShipmentDetails<RN extends RateChargeAlias, QP extends QuoteParam> =
  QP extends BoxesTypeRequest ?
    { name: 'Boxes', requestDetails: BoxDetails[]} :
    QP extends TotalChargeSetTypeRequest ?
      {name: 'TotalChargeSet', requestDetails: TotalChargeSet,} :
      QP extends ContainerTypeRequest ?
        { name: 'Containers', requestDetails: ContainerDetails[]} :
        { name: 'FixChargeSet', requestDetails: []};


export interface ChargeMap<RN extends RateChargeAlias,
  RK extends RateChargeKey,
  R extends CurrencyRateChargeType,
  RMT extends ChargeMapType<RN, RK, R> & RateChargeMapType,
  QP extends QuoteParam> {
  chargeMap: ChargeMapIterableType<RK, R> | InvalidChargeSetMessage<RMT>;
  chargeMapName: ChargeMapName<RMT>

  getChargeMap(chargeTable: Pick<GridElement, keyof GridElement>[][] | string): ChargeMapIterableType<RK, R> | InvalidChargeSetMessage<RMT>;

  fromString(serializedChargeMap: string): ChargeMapIterableType<RK, R> | InvalidChargeSetMessage<RMT>;

  invalidChargeSetMessage(): InvalidChargeSetMessage<RMT>;

  toString(): string;

  calcMe(shipmentDetails?: Pick<ShipmentDetails<RN, QP>, 'name'| 'requestDetails'>): ApplyingCharge<RN, RK, R, RMT, CurrencyType, Mandatory, QP>[] | InvalidChargeSetMessage<RMT>;
}

export type PerTon = 'perTon';
export type ThcType = 'thc20' | 'thc40';
