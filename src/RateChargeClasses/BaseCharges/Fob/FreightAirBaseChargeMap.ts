import { BoxDetails } from '../../../RFQ/requestTypes';
import {
  AirChargeKey,
  AirChargeMap,
  AirChargeMapType,
  BoxesTypeRequest,
  ChargeMap,
  ChargeMapIterableType,
  ChargeMapName,
  CurrencyType,
  GridElement,
  InvalidChargeSetMessage,
  Length,
  Mandatory,
  ShipmentDetails,
  Weight,
  WeightRatioRule,
} from '../../../Rates/rateTypes';
import { compareWeights, massInKg } from '../../../Rates/rateUtils';
import { ApplyingCharge } from '../../../ApplyingCharges/ApplyingCharge';
import { currencyFromString } from '../../../ApplyingCharges/chargeUtils';
import { Box } from '../../../CargoUnit/Box';
import { GenericMeasure } from 'safe-units';

/**
 * System subtypes.
 * */

export class FreightAirBaseChargeMap implements ChargeMap<'AirChargeMap', AirChargeKey, WeightRatioRule, AirChargeMapType, BoxesTypeRequest> {
  chargeMapName: ChargeMapName<AirChargeMapType> = 'AirChargeMap';
  chargeMap: ChargeMapIterableType<AirChargeKey, WeightRatioRule> | InvalidChargeSetMessage<AirChargeMapType>;

  constructor(chargeTable: Pick<GridElement, keyof GridElement>[][] | string) {
    this.chargeMap = typeof chargeTable === 'string' ?
      this.fromString(chargeTable) :
      this.getChargeMap(chargeTable);
  }

  getChargeMap(baseRate: Pick<GridElement, keyof GridElement>[][]): ChargeMapIterableType<AirChargeKey, WeightRatioRule> | InvalidChargeSetMessage<AirChargeMapType> {
    const ratioScalar = this.parseWeightField(baseRate[0][0].value as string);

    const processedBaseRate = baseRate[0]
      .slice(1)
      .map(
        weightCharge => {
          const weightThreshold = this.parseWeightField(weightCharge.field);
          const charge = currencyFromString(weightCharge.value as string);

          if (typeof charge !== 'string' && typeof ratioScalar !== 'string') {
            const airFreightChargeMap = [
              weightThreshold,
              { ratio: ratioScalar.value, charge: { ...charge, mandatory: 'Y' } },
            ] as [AirChargeKey, WeightRatioRule];

            if (airFreightChargeMap !== undefined) return airFreightChargeMap;
          }

          return [this.invalidChargeSetMessage(), {}];
        },
      );
    const validatedDeserializedRateCharge = processedBaseRate as [AirChargeKey, WeightRatioRule][];
    const validProcessedRate = new Map(validatedDeserializedRateCharge);

    return validProcessedRate === undefined ? this.invalidChargeSetMessage() : validProcessedRate;
  }

  invalidChargeSetMessage(): InvalidChargeSetMessage<AirChargeMapType> {
    return 'Invalid Air Freight Charge';
  }

  fromString(serializedChargeTable: string): ChargeMapIterableType<AirChargeKey, WeightRatioRule> | InvalidChargeSetMessage<AirChargeMapType> {
    try {
       const chargeObject = JSON.parse(serializedChargeTable);

      const chargeMap = new Map(chargeObject);

      if (chargeMap === undefined) return this.invalidChargeSetMessage();

      return chargeMap as ChargeMapIterableType<AirChargeKey, WeightRatioRule> ;

    } catch (e) {
      return this.invalidChargeSetMessage();
    }
  }

  toString(): string {
    return typeof this.chargeMap === 'string' ?
      this.invalidChargeSetMessage() :
      JSON.stringify(Array.from(this.chargeMap.entries()));
  };


  calcMe(shipmentDetails: ShipmentDetails<'AirChargeMap', BoxesTypeRequest>):
    ApplyingCharge<'AirChargeMap', AirChargeKey, WeightRatioRule, AirChargeMapType, CurrencyType, Mandatory, BoxesTypeRequest>[] | InvalidChargeSetMessage<AirChargeMapType> {
    const applicableCharges: ApplyingCharge<'AirChargeMap', AirChargeKey, WeightRatioRule, AirChargeMapType, CurrencyType, Mandatory, BoxesTypeRequest>[] = [];

    const airFreightChargeMap = this.chargeMap;
    if (airFreightChargeMap === this.invalidChargeSetMessage()) return this.invalidChargeSetMessage();

    const orderedCharges = this.orderAirChargeByWeightKeys();

    if (typeof orderedCharges === 'string') return this.invalidChargeSetMessage();


    const orderedCharge = orderedCharges[0];
    let [boxes, airRateWeight, airCharge] = this.getQuotedRateTotal(shipmentDetails.requestDetails, orderedCharge);


    /**
     *  Looking through the sorted array,
     * and returning the LAST charge in row where the weight is SMALLER or EQUAL TO than the weight rate.
     * */

    const applicableAirFreightCharge =
      orderedCharges
        .reduce(
          (previousWeightCharge: [Weight<'kg'>, WeightRatioRule], currentWeightCharge: [Weight<'kg'>, WeightRatioRule],) => {
            /** If only one charge, that's the one we use. (Base Case)*/
            const onlyOneCharge = orderedCharges.length === 1;

            if (onlyOneCharge) return previousWeightCharge;

            /** Else check if weight is larger than the requested details by max(volumeWeight, physicalWeight), */
            [boxes, airRateWeight, airCharge] =
              this.getQuotedRateTotal(shipmentDetails.requestDetails, currentWeightCharge);

            const airChargeLarger =
              compareWeights(currentWeightCharge[0], { value: airRateWeight.value.toString(), unit: 'kg'}) > 0;

            /** If charge weight is larger, return the previous rate. Else keep going. */
            if (airChargeLarger) return previousWeightCharge;
            return currentWeightCharge;
          },
        );


    const finalAirFreightCharge =
      new ApplyingCharge<'AirChargeMap', AirChargeKey, WeightRatioRule, AirChargeMapType, CurrencyType, Mandatory, BoxesTypeRequest>(
        'AirChargeMap',
        applicableAirFreightCharge[1].charge,
        airCharge,
        { name: 'Boxes', requestDetails:  shipmentDetails.requestDetails, chargeParamObj: boxes}
      );


    if (finalAirFreightCharge === undefined) return this.invalidChargeSetMessage();

    finalAirFreightCharge.scaleCharge(airRateWeight.value.toString());
    applicableCharges.push(finalAirFreightCharge);

    return applicableCharges;
  }


  private getQuotedRateTotal(
    shipmentDetails: BoxDetails[],
    airCharge: [AirChargeKey, WeightRatioRule],
  ): [Box[], GenericMeasure<number, { mass: '1' }>, [AirChargeKey, WeightRatioRule]] {
    let boxes = shipmentDetails.map(
      box =>
        new Box(
          {
            length: box.length as Length,
            height: box.height as Length,
            width: box.width as Length,
          },
          box.weight,
          airCharge[1].ratio,
          box.count,
        ),
    );
    return [
      boxes,
      boxes.map(
        box => massInKg(box.getQuotingWeight('kg')),
      ).reduce(
        (massA, massB) =>
          massA.plus(massB),
      ),
      airCharge,
    ];
  }

  private orderAirChargeByWeightKeys = (): [Weight, WeightRatioRule][] | InvalidChargeSetMessage<AirChargeMapType> => {
    const airFreightChargeMap = this.chargeMap;
    if (airFreightChargeMap === this.invalidChargeSetMessage()) return this.invalidChargeSetMessage();
    return Array.from(airFreightChargeMap)
      .sort(
        (
          [weightA, weightRatioRuleA]: [Weight, WeightRatioRule],
          [weightB, weightRatioRuleB]: [Weight, WeightRatioRule],
        ) =>
          compareWeights(weightA, weightB),
      );
  };


  private parseWeightField = (weightLimitField: string) => {
    const weightValueFromField = weightLimitField.match(/^(from)?\s*(\d+(\.\d+)?)\s*kg/);
    if (!weightValueFromField) return this.invalidChargeSetMessage();
    return { value: weightValueFromField[2], unit: 'kg' };
  };

}