import { FixChargeMap } from '../../RateChargeClasses/FixChargeMap';
import { ChargeName, CurrencyType, FixCharges, GridElement, Mandatory } from '../..';
import { ApplyingCharge } from '../../ApplyingCharges/ApplyingCharge';
import { FixCharge, FixChargeMapType, FixTypeRequest } from '../../Rates/rateTypes';




const rateLineOceanFclFreightFix = (): Pick<GridElement, keyof GridElement>[][] => {
  return [
    [
      { field: 'rowIndex', value: '1.' }, { field: 'chargeName', value: 'a' },
      { field: 'amount', value: '20', currencyType: 'NIS' }, { field: 'mandatory', value: 'Y' },
    ],
    [
      { field: 'rowIndex', value: '2.' }, { field: 'chargeName', value: 'b' },
      { field: 'amount', value: '40', currencyType: 'EUR' }, { field: 'mandatory', value: 'N' },
    ],
  ];
};


test(
  'New FixChargesMap() Instantiate from Pick<GridElement,keyof GridElement>[][] ',
  () => {
    const actual = new FixChargeMap(rateLineOceanFclFreightFix()).calcMe();
    const fixAppliedA = new ApplyingCharge<'FixCharges', ChargeName, FixCharge, FixChargeMapType, CurrencyType, Mandatory, FixTypeRequest>(
      'FixCharges', { currency: 'NIS', amount: '20', mandatory: 'Y' }, ['a', {
        charge: {
          currency: 'NIS',
          amount: '20',
          mandatory: 'Y',
        },
      }],
    );
    const fixAppliedB = new ApplyingCharge<'FixCharges', ChargeName, FixCharge, FixChargeMapType, CurrencyType, Mandatory, FixTypeRequest>(
      'FixCharges', { currency: 'EUR', amount: '40', mandatory: 'N' }, ['b', {
        charge: {
          currency: 'EUR',
          amount: '40',
          mandatory: 'N',
        },
      }],
    );

    const expectedOutput: ApplyingCharge<'FixCharges', ChargeName, FixCharge, FixChargeMapType, CurrencyType, Mandatory, FixTypeRequest>[] = [fixAppliedA, fixAppliedB];

    if (typeof actual !== 'string') {

      const actualA = actual.find(fixCharge => fixCharge.eq(fixAppliedA));
      const actualB = actual.find(fixCharge => fixCharge.eq(fixAppliedB));

      if (actualA !== undefined && actualB !== undefined) {
     
        // expect(actualA.toString()).toStrictEqual(fixAppliedA.toString());
        // expect(actualB.toString()).toStrictEqual(fixAppliedB.toString());
        expect(actual.toString()).toStrictEqual(expectedOutput.toString());
      }
    }
  },
);


test(
  'New FixChargesMap() Instantiate from string ',
  () => {
    const initialFixChargeMap = new FixChargeMap(rateLineOceanFclFreightFix());
    const serializedChargeMap = initialFixChargeMap.toString();

    const actualDeserialized = new FixChargeMap(serializedChargeMap);
    const newResult = actualDeserialized.calcMe();

    const fixAppliedA = new ApplyingCharge<'FixCharges', ChargeName, FixCharge, FixChargeMapType, CurrencyType, Mandatory, FixTypeRequest>(
      'FixCharges',
      { currency: 'NIS', amount: '20', mandatory: 'Y' },
      ['a', { charge: { currency: 'NIS', amount: '20', mandatory: 'Y' } }],
    );

    const fixAppliedB = new ApplyingCharge<'FixCharges', ChargeName, FixCharge, FixChargeMapType, CurrencyType, Mandatory, FixTypeRequest>(
      'FixCharges',
      { currency: 'EUR', amount: '40', mandatory: 'N' },
      ['b', { charge: { currency: 'EUR', amount: '40', mandatory: 'N' } }],
    );

    if (typeof newResult !== 'string') {

      const actualA = newResult.find(fixCharge => fixCharge.eq(fixAppliedA));
      const actualB = newResult.find(fixCharge => fixCharge.eq(fixAppliedB));

      if (actualA !== undefined && actualB !== undefined) {
        expect(JSON.stringify(actualA.toString())).toStrictEqual(JSON.stringify('\nFix Charge: [NIS 20, mandatory].'));
        expect(JSON.stringify(actualB.toString())).toStrictEqual(JSON.stringify('\nFix Charge: [EUR 40, non-mandatory].'));
        expect(JSON.stringify(newResult.toString())).toStrictEqual(
          JSON.stringify(
            [
              '\nFix Charge: [NIS 20, mandatory].',
              '\nFix Charge: [EUR 40, non-mandatory].',
            ].toString(),
          ),
        );
      }
    }
  },
);