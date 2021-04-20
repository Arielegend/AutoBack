import { RateType } from '../Rates/rateTypes';
import {
  fclBaseCharges,
  FclBaseCharges,
  fclFreightFix, FixChargeProps, HeavyContainerCharges, LocalContainerChargeProps,
  localContainerCharges,
  localFreightFix,
  oceanHeavyCharges, ThcChargeProps,
  thcCharges,
} from './fclMockObjects';

export const generalInfo = (
  carrierName: string,
  freightForwarderName: string,
  rateId: string,
  rateName: string,
  rateType: RateType,
  region: string,
  validFrom: string,
  validTo: string,
  pointOfOrigin: string,
  pointOfDestination: string,
  transitTime: string,
  route: string,
) => [
  `\n\n\t\tcarrierName: ${carrierName}`,
  `\n\t\tfreightForwarderName: ${freightForwarderName}`,
  `\n\t\trateID: ${rateId}`,
  `\n\t\trateName: ${rateName}`,
  `\n\t\trateType: ${rateType}`,
  `\n\t\tregion: ${region}`,
  `\n\t\tvalidFrom: ${validFrom}`,
  `\n\t\tvalidTo: ${validTo}`,
  `\n\t\tpointOfOrigin: ${pointOfOrigin}`,
  `\n\t\tpointOfDestination: ${pointOfDestination}`,
  `\n\t\ttransitTime: ${transitTime}`,
  `\n\t\troute: ${route}`,
];
export type GeneralInfoParams = {
  carrierName: string,
  freightForwarderName: string,
  rateId: string,
  rateName: string,
  rateType: RateType,
  region: string,
  validFrom: string,
  validTo: string,
  pointOfOrigin: string,
  pointOfDestination: string,
  transitTime: string,
  route: string
};

export type RateLineChargeProps = {
  generalInfoParams: GeneralInfoParams,
  fclBaseChargeParams: FclBaseCharges[],
  heavyChargeParams: HeavyContainerCharges[],
  oceanFclFreightFix: FixChargeProps[],
  localContainerParams: LocalContainerChargeProps[],
  localsOceanFclFixRates: FixChargeProps[],
  thcObject: ThcChargeProps[]
};

export const rateLineMock = (props: RateLineChargeProps[]) =>
  props
    .map(
      (rateLine, index) => {
        const {
          carrierName,
          freightForwarderName,
          rateId,
          rateName,
          rateType,
          region,
          validFrom,
          validTo,
          pointOfOrigin,
          pointOfDestination,
          route,
          transitTime,
        } = rateLine.generalInfoParams;

        return [
          `\n\t{`,
          ...generalInfo(
            carrierName,
            freightForwarderName,
            rateId,
            rateName,
            rateType,
            region,
            validFrom,
            validTo,
            pointOfDestination,
            pointOfOrigin,
            transitTime,
            route,
          ),
          `\n\n\t\tfclCharges: `,
          ...fclBaseCharges(rateLine.fclBaseChargeParams),
          `\n\t\toceanFclHeavyRates: `,
          ...oceanHeavyCharges(rateLine.heavyChargeParams),
          `\n\t\toceanFclFreightFix: `,
          ...fclFreightFix(rateLine.oceanFclFreightFix),
          `\n\t\tlocalsOceanFclFixRates: `,
          ...localFreightFix(rateLine.localsOceanFclFixRates),
          `\n\t\tlocalsOceanFclContainerRates: `,
          ...localContainerCharges(
            rateLine.localContainerParams,
          ),
          `\n\t\tthcObject: `,
          ...thcCharges(
            rateLine.thcObject,
          ),
          '\n\t}',
          ...[index === props.length - 1 ? '' : ','],
        ].join('');
      },
    );