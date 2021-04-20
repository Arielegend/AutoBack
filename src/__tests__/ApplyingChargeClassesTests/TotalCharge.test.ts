import {
  AirChargeKey,
  AirChargeMapType,
  ApplyingCurrencyCharge,
  BoxesTypeRequest,
  ContainerCharge,
  CurrencyRateChargeType,
  FixCharge,
  FixChargeMapType,
  FixTypeRequest,
  LocalContainerChargeMapType,
  Mandatory,
  QuoteParam,
  RateChargeAlias,
  RateChargeKey,
  RateChargeMapType,
  WeightRatioRule,
} from '../../Rates/rateTypes';
import { TotalCharge } from '../../ApplyingCharges/TotalCharge';
import { ApplyingCharge } from '../../ApplyingCharges/ApplyingCharge';
import { getChargeObject } from './ApplyingCharge.test';


test(
  'Total Creation Charge Test, Mandatory',
  () => {

    const applyingChargeInNisA = new ApplyingCharge<'FixCharges', string, FixCharge, FixChargeMapType, 'NIS', 'Y', FixTypeRequest>(
      'FixCharges',
      { currency: 'NIS', amount: '50', mandatory: 'Y' },
      ['FixCharge1Nis', { charge: { currency: 'NIS', amount: '50', mandatory: 'Y' } }] as [string, FixCharge],
    );

    const applyingChargeInNisB = new ApplyingCharge<'FixCharges', string, FixCharge, FixChargeMapType, 'NIS', 'Y', FixTypeRequest>(
      'FixCharges',
      { currency: 'NIS', amount: '123.45', mandatory: 'Y' },
      ['FixCharge2Nis', { charge: { currency: 'NIS', amount: '123.45', mandatory: 'Y' } }] as [string, FixCharge],
    );

    const applyingChargeInNisC = new ApplyingCharge<'LocalContainerCharges', string, ContainerCharge, LocalContainerChargeMapType, 'NIS', 'Y', BoxesTypeRequest>(
      'LocalContainerCharges',
      { currency: 'NIS', amount: '200', mandatory: 'Y' },
      ['LocalContainerCharge1Nis', { charge: { currency: 'NIS', amount: '200', mandatory: 'Y' }, container: "DV20"}] as [string, ContainerCharge],
    );

    const applyingChargeInNisD = new ApplyingCharge<'AirChargeMap', AirChargeKey, WeightRatioRule, AirChargeMapType, 'NIS', 'Y', BoxesTypeRequest>(
      'AirChargeMap',
      { currency: 'NIS', amount: '200', mandatory: 'Y' },
      [{ value: '120', unit: 'kg'} , { charge: { currency: 'NIS', amount: '200', mandatory: 'Y' }, ratio: "176"}] as [AirChargeKey, WeightRatioRule],
    );

    
    const applyingChargeInEur = new ApplyingCharge<'FixCharges', RateChargeKey, CurrencyRateChargeType, FixChargeMapType, 'EUR', Mandatory, QuoteParam>(
      'FixCharges',
      { currency: 'EUR', amount: '50', mandatory: 'Y' },
      ['FixCharge1Eur', { charge: { currency: 'EUR', amount: '50', mandatory: 'Y' } }] as [string, FixCharge],
    );

    const applyingChargeInUsd = new ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType, 'USD', Mandatory, QuoteParam>(
      'FixCharges',
      { currency: 'USD', amount: '50', mandatory: 'Y' },
      ['FixCharge1Usd', { charge: { currency: 'USD', amount: '50', mandatory: 'Y' } }] as [string, FixCharge],
    );

    const totalCharge = new TotalCharge<Mandatory>('Y', {
      totalChargesInNis: [applyingChargeInNisA, applyingChargeInNisB, applyingChargeInNisC, applyingChargeInNisD],
      totalChargesInUsd: [applyingChargeInUsd],
      totalChargesInEur: [applyingChargeInEur],
    });

    const totalChargeHelper = totalCharge.calculateTotalCharge()

    const expectedOutputNIS = getChargeObject("NIS", '573.45', 'Y')
    const expectedOutputUSD =  getChargeObject("USD", '50', 'Y')
    const expectedOutputEUR = getChargeObject("EUR", '50', 'Y')


    expect(totalChargeHelper.totalChargesInNis.sumTotal).toMatchObject(expectedOutputNIS);
    expect(totalChargeHelper.totalChargesInUsd.sumTotal).toMatchObject(expectedOutputUSD);
    expect(totalChargeHelper.totalChargesInEur.sumTotal).toMatchObject(expectedOutputEUR);
    expect(totalChargeHelper.totalChargesInNis.charges).toHaveLength(4);
  },
);


test(
  'Total Creation Charge Test, nonMandatory',
  () => {

    const applyingChargeInNisA = new ApplyingCharge<'FixCharges', string, FixCharge, FixChargeMapType, 'NIS', Mandatory, FixTypeRequest>(
      'FixCharges',
      { currency: 'NIS', amount: '50', mandatory: 'N' },
      ['FixCharge1Nis', { charge: { currency: 'NIS', amount: '50', mandatory: 'N' } }] as [string, FixCharge],
    );

    const applyingChargeInNisB = new ApplyingCharge<'FixCharges', string, FixCharge, FixChargeMapType, 'NIS', Mandatory, FixTypeRequest>(
      'FixCharges',
      { currency: 'NIS', amount: '123.45', mandatory: 'N' },
      ['FixCharge2Nis', { charge: { currency: 'NIS', amount: '123.45', mandatory: 'N' } }] as [string, FixCharge],
    );

    const applyingChargeInNisC = new ApplyingCharge<'LocalContainerCharges', string, ContainerCharge, LocalContainerChargeMapType, 'NIS', Mandatory, BoxesTypeRequest>(
      'LocalContainerCharges',
      { currency: 'NIS', amount: '200', mandatory: 'N' },
      ['LocalContainerCharge1Nis', { charge: { currency: 'NIS', amount: '200', mandatory: 'N' }, container: "DV20"}] as [string, ContainerCharge],
    );

    const applyingChargeInNisD = new ApplyingCharge<'AirChargeMap', AirChargeKey, WeightRatioRule, AirChargeMapType, 'NIS', Mandatory, BoxesTypeRequest>(
      'AirChargeMap',
      { currency: 'NIS', amount: '200', mandatory: 'N' },
      [{ value: '120', unit: 'kg'} , { charge: { currency: 'NIS', amount: '200',  mandatory: 'N' }, ratio: "176"}] as [AirChargeKey, WeightRatioRule],
    );

    
    const applyingChargeInEur = new ApplyingCharge<'FixCharges', RateChargeKey, CurrencyRateChargeType, FixChargeMapType, 'EUR', Mandatory, QuoteParam>(
      'FixCharges',
      { currency: 'EUR', amount: '50', mandatory: 'N' },
      ['FixCharge1Eur', { charge: { currency: 'EUR', amount: '50', mandatory: 'N' } }] as [string, FixCharge],
    );

    const applyingChargeInUsd = new ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType, 'USD', Mandatory, QuoteParam>(
      'FixCharges',
      { currency: 'USD', amount: '50', mandatory: 'N' },
      ['FixCharge1Usd', { charge: { currency: 'USD', amount: '50', mandatory: 'N' } }] as [string, FixCharge],
    );

    const totalCharge = new TotalCharge<Mandatory>('N', {
      totalChargesInNis: [applyingChargeInNisA, applyingChargeInNisB, applyingChargeInNisC, applyingChargeInNisD],
      totalChargesInUsd: [applyingChargeInUsd],
      totalChargesInEur: [applyingChargeInEur],
    });

    const totalChargeHelper = totalCharge.calculateTotalCharge()

    const expectedOutputNIS = getChargeObject("NIS", '573.45', 'N')
    const expectedOutputUSD =  getChargeObject("USD", '50', 'N')
    const expectedOutputEUR = getChargeObject("EUR", '50', 'N')


    expect(totalChargeHelper.totalChargesInNis.sumTotal).toMatchObject(expectedOutputNIS);
    expect(totalChargeHelper.totalChargesInUsd.sumTotal).toMatchObject(expectedOutputUSD);
    expect(totalChargeHelper.totalChargesInEur.sumTotal).toMatchObject(expectedOutputEUR);
    expect(totalChargeHelper.totalChargesInNis.charges).toHaveLength(4);


    // const actualTotalChargeString = totalCharge.toString();

    // console.log(actualTotalChargeString);
    // console.log(totalCharge.getTotalSum())

  },
);

test("Add two fix charges", () => {

  const applyingChargeInNisA = new ApplyingCharge<'FixCharges', string, FixCharge, FixChargeMapType, 'USD', Mandatory, FixTypeRequest>(
    'FixCharges',
    { currency: 'USD', amount: '123.45', mandatory: 'Y' },
    ['FixCharge2Nis', { charge: { currency: 'USD', amount: '123.45', mandatory: 'Y' } }] as [string, FixCharge],
  );

  const applyingChargeInNisB = new ApplyingCharge<'FixCharges', string, FixCharge, FixChargeMapType, 'NIS', Mandatory, FixTypeRequest>(
    'FixCharges',
    { currency: 'NIS', amount: '123.45', mandatory: 'Y' },
    ['FixCharge2Nis', { charge: { currency: 'NIS', amount: '123.45', mandatory: 'Y' } }] as [string, FixCharge],
  );

  const applyingChargeInUsd = new ApplyingCharge<RateChargeAlias, RateChargeKey, CurrencyRateChargeType, RateChargeMapType, 'USD', Mandatory, QuoteParam>(
    'FixCharges',
    { currency: 'USD', amount: '500', mandatory: 'Y' },
    ['FixCharge1Usd', { charge: { currency: 'USD', amount: '500', mandatory: 'Y' } }] as [string, FixCharge],
  );

  const applyingChargeInEur = new ApplyingCharge<'FixCharges', RateChargeKey, CurrencyRateChargeType, FixChargeMapType, 'EUR', Mandatory, QuoteParam>(
    'FixCharges',
    { currency: 'EUR', amount: '1500', mandatory: 'Y' },
    ['FixCharge1Eur', { charge: { currency: 'EUR', amount: '1500', mandatory: 'Y' } }] as [string, FixCharge],
  );


  const applyingCurrencyChargeNIS:ApplyingCurrencyCharge<"NIS", 'Y'> = {amount:'100', currency:"NIS", mandatory:'Y'}
  const applyingCurrencyChargeUSD:ApplyingCurrencyCharge<"USD", 'Y'> = {amount:'100', currency:"USD", mandatory:'Y'}
  const applyingCurrencyChargeEUR:ApplyingCurrencyCharge<"EUR", 'Y'> = {amount:'100', currency:"EUR", mandatory:'Y'}

  const totalCharge = new TotalCharge<Mandatory>('Y', {
    totalChargesInNis: [],
    totalChargesInUsd: [],
    totalChargesInEur: [],
  });

  const expectedOutputNIS = getChargeObject("NIS", '223.45', 'Y')
  const expectedOutputUSD = getChargeObject("USD", '600', 'Y')
  const expectedOutputEUR = getChargeObject("EUR", '1600', 'Y')

  expect(totalCharge.addCharges(applyingCurrencyChargeNIS, applyingChargeInNisB)).toMatchObject(expectedOutputNIS)
  expect(totalCharge.addCharges(applyingCurrencyChargeUSD, applyingChargeInUsd)).toMatchObject(expectedOutputUSD)
  expect(totalCharge.addCharges(applyingCurrencyChargeEUR, applyingChargeInEur)).toMatchObject(expectedOutputEUR)
  //Adding two different Currencies 
  expect(totalCharge.addCharges(applyingCurrencyChargeNIS, applyingChargeInNisA)).toBe(undefined)
})

// test(
//   'Calculate Percentage of Total Charge',
//   () => {
//     const applyingAirChargeMap = new ApplyingCharge<'AirChargeMap', AirChargeKey, WeightRatioRule, AirChargeMapType, 'NIS', 'Y', BoxesTypeRequest>(
//       'AirChargeMap',
//       { currency: 'NIS', amount: '200', mandatory: 'Y' },
//       [{ value: '120', unit: 'kg'} , { charge: { currency: 'NIS', amount: '200', mandatory: 'Y' }, ratio: "176"}] as [AirChargeKey, WeightRatioRule],
//     );
//     const applyingAirFreightFix = new ApplyingCharge<'FixCharges', string, FixCharge, FixChargeMapType, 'NIS', 'Y', FixTypeRequest>(
//       'FixCharges',
//       { currency: 'NIS', amount: '123.45', mandatory: 'Y' },
//       ['b', { charge: { currency: 'NIS', amount: '123.45', mandatory: 'Y' } }] as [string, FixCharge],
//     );

//     const freightPart = [applyingAirChargeMap, applyingAirFreightFix]

//     const totalChargeMandatory = new TotalCharge<'Y'>('Y', {
//       totalChargesInNis: freightPart,
//       totalChargesInUsd: [],
//       totalChargesInEur: [],
//     })

//     const totalChargeNonMandatory = new TotalCharge<'N'>('N', {
//         totalChargesInNis: [],
//         totalChargesInUsd: [],
//         totalChargesInEur: [],
//       }
//     );
//     const yataPercentageCharge = totalChargeMandatory.calculatePercentCharge<'YataCharge','Y'>(
//       'YataCharge',
//       'Y',
//       '10',
//       {
//         chargeParamObj: totalChargeMandatory.getTotalCharge().totalChargesInNis.sumTotal as ApplyingCurrencyCharge<'NIS', 'Y'> ,
//         name: 'TotalChargeSet',
//         requestDetails: {
//           mandatory: totalChargeMandatory,
//           nonMandatory: totalChargeNonMandatory
//         }

//       }
//       )
//     // console.log('yataPercentageCharge: ', yataPercentageCharge.totalChargesInNis.toString())
//   }
// )