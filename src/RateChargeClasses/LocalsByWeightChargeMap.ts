import {
  BoxesTypeRequest,
  ChargeMap,
  ChargeMapIterableType,
  ChargeMapName,
  ChargeName,
  CurrencyCharge,
  CurrencyType,
  GridElement,
  InvalidChargeSetMessage,
  Length,
  Mandatory,
  ShipmentDetails,
  WeightRatioRule,
  WeightRuleChargeMapType,
  WeightRulesCharges,
} from '../Rates/rateTypes';
import { massInKg } from '../Rates/rateUtils';
import { ApplyingCharge } from '../ApplyingCharges/ApplyingCharge';
import { currencyFromString } from '../ApplyingCharges/chargeUtils';
import { Box } from '../CargoUnit/Box';
import { BoxDetails } from '../RFQ/requestTypes';

export class LocalsByWeightChargeMap implements ChargeMap<'WeightRulesCharges', ChargeName, WeightRatioRule, WeightRuleChargeMapType, BoxesTypeRequest> {
  chargeMapName: ChargeMapName<WeightRuleChargeMapType> = 'WeightRulesCharges';
  chargeMap: ChargeMapIterableType<ChargeName, WeightRatioRule> | InvalidChargeSetMessage<WeightRuleChargeMapType>;

  constructor(chargeTable: Pick<GridElement, keyof GridElement>[][] | string) {
    this.chargeMap = typeof chargeTable === 'string' ?
      this.fromString(chargeTable) :
      this.getChargeMap(chargeTable);
  }


  fromString(serializedChargeTable: string): ChargeMapIterableType<ChargeName, WeightRatioRule> | InvalidChargeSetMessage<WeightRuleChargeMapType> {
    try {
      const chargeObject = JSON.parse(serializedChargeTable);

      return typeof chargeObject[0][0] === 'string' ?
        new Map(chargeObject) as unknown as ChargeMapIterableType<ChargeName, WeightRatioRule> :
        this.getChargeMap(chargeObject);

    } catch (e) {
      return this.invalidChargeSetMessage();
    }
  }


  getChargeMap(chargeMap: Pick<GridElement, keyof GridElement>[][]):
    ChargeMapIterableType<ChargeName, WeightRatioRule> |
    InvalidChargeSetMessage<WeightRuleChargeMapType> {

    const chargeMapEntries: ([false, false] | [string, WeightRatioRule])[] =
      chargeMap.map(
        (localWeightCharge: Pick<GridElement, keyof GridElement>[]) => {
          const deserializedChargeAmount = currencyFromString(localWeightCharge[3].value as string);

          if (typeof deserializedChargeAmount === 'string') return [false, false];

          return [
            localWeightCharge[1].value as ChargeName,
            {
              ratio: localWeightCharge[2].value as string,
              charge: {
                amount: deserializedChargeAmount.amount,
                currency: localWeightCharge[3].currencyType as CurrencyType,
                mandatory: localWeightCharge[4].value as Mandatory,
              } as CurrencyCharge,

            },
          ];
        },
      );

    if (chargeMapEntries.every(([chargeName, weightRatioRule]) => chargeName && weightRatioRule)) {

      const localsByWeightCharges = new Map(chargeMapEntries as [string, WeightRatioRule][]);
      if (localsByWeightCharges !== undefined) {
        return localsByWeightCharges;
      }
    }
    return this.invalidChargeSetMessage();
  }


  invalidChargeSetMessage(): InvalidChargeSetMessage<WeightRuleChargeMapType> {
    return 'Invalid Locals By Weight ChargeSet.';
  }


  toString(): string {
    return typeof this.chargeMap === 'string' ?
      this.invalidChargeSetMessage() :
      JSON.stringify(Array.from(this.chargeMap.entries()));
  }


  calcMe(shipmentDetails:  ShipmentDetails<'WeightRulesCharges', BoxesTypeRequest>):
    ApplyingCharge<'WeightRulesCharges', ChargeName, WeightRatioRule, WeightRuleChargeMapType, CurrencyType, Mandatory, BoxesTypeRequest>[] |
    InvalidChargeSetMessage<WeightRuleChargeMapType> {

    const applicableCharges: ApplyingCharge<'WeightRulesCharges', ChargeName, WeightRatioRule, WeightRuleChargeMapType, CurrencyType, Mandatory, BoxesTypeRequest>[] = [];

    if (typeof this.chargeMap === 'string') return this.invalidChargeSetMessage();

    const localsByWeightCharges = this.chargeMap.entries();
    let nextLocalWeightCharge = localsByWeightCharges.next();

    while (!nextLocalWeightCharge.done) {
      const [chargeName, localWeightChargeObj] = nextLocalWeightCharge.value;

      const boxes = shipmentDetails.requestDetails
        .map(
          box =>
            new Box(
              {
                length: box.length as Length,
                height: box.height as Length,
                width: box.width as Length,
              },
              box.weight,
              localWeightChargeObj.ratio,
              box.count,
            ),
        );

      const weightValueToScale =
        boxes.map(
          box => massInKg(box.getQuotingWeight('kg')),
        ).reduce(
          (massA, massB) =>
            massA.plus(massB),
        ).value
          .toString();

      /** Getting the weight to be used in the calculations. */

      /** Applying the weight to the local charge per weight. */
      const applicableCharge = new ApplyingCharge<'WeightRulesCharges', ChargeName, WeightRatioRule, WeightRuleChargeMapType, CurrencyType, Mandatory, BoxesTypeRequest>(
        'WeightRulesCharges',
        localWeightChargeObj.charge,
        [chargeName, localWeightChargeObj] as [string, WeightRatioRule],
        { name: 'Boxes', requestDetails: shipmentDetails.requestDetails, chargeParamObj:boxes}
      );

      applicableCharge.scaleCharge(weightValueToScale);

      /** Returning the charge to be used. */
      const charge = applicableCharge;

      /** If charge is undefined return error message. */
      if (charge === undefined) return this.invalidChargeSetMessage();

      /** Otherwise, push the charge into the array. */
      applicableCharges.push(charge);

      /** Move rate iterator to next charge. */
      nextLocalWeightCharge = localsByWeightCharges.next();
    }

    return applicableCharges;
  }


}