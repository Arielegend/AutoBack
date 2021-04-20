import { Money } from 'bigint-money';
import { ApplyingCharge } from '../../ApplyingCharges/ApplyingCharge';
 import {
  ChargeName,
   CurrencyType,
   FixCharge,
  FixChargeMapType,
  FixTypeRequest,
  Mandatory,
  WeightRatioRule,
  WeightUnit,
} from '../../Rates/rateTypes';
import {boxString, getBoxesMocked1Meter} from '../../Mocks/cargoUnitsMocking'

export const getChargeObject = (currency:CurrencyType, amount:string, mandatory:Mandatory ) => {
  return {currency, amount, mandatory } 
}


test('Charge from integer-value currency string - NIS',
  () => {
    const expectedOutput = getChargeObject('NIS', '30', 'Y')
    const stringCharge = new ApplyingCharge<'FixCharges', ChargeName, FixCharge, FixChargeMapType, 'NIS', Mandatory, FixTypeRequest>('FixCharges')
      .currencyChargeFromStringValue('NIS 30', 'Y');
    expect(stringCharge.getCharge()).toMatchObject(expectedOutput);
  },
);

test('Charge from integer-value currency string - USD',
  () => {
    const expectedOutput = getChargeObject('USD', '60', 'Y')
    const stringCharge = new ApplyingCharge<'FixCharges', ChargeName, FixCharge, FixChargeMapType, 'NIS', Mandatory, FixTypeRequest>('FixCharges')
      .currencyChargeFromStringValue('USD 60', 'Y');
    expect(stringCharge.getCharge()).toMatchObject(expectedOutput);
  },
);

test('Charge from integer-value currency string - EUR',
  () => {
    const expectedOutput = getChargeObject('EUR', '60', 'Y')
    const stringCharge = new ApplyingCharge<'FixCharges', ChargeName, FixCharge, FixChargeMapType, 'NIS', Mandatory, FixTypeRequest>('FixCharges')
      .currencyChargeFromStringValue('EUR 60', 'Y');
    expect(stringCharge.getCharge()).toMatchObject(expectedOutput);
  },
);

test('Charge from integer-value currency string - wrong currency EURO',
  () => {
    const stringCharge = new ApplyingCharge<'FixCharges', ChargeName, FixCharge, FixChargeMapType, 'NIS', Mandatory, FixTypeRequest>('FixCharges')
      .currencyChargeFromStringValue('EURO 60', 'Y');
    expect(stringCharge.getCharge()).toBe(undefined);
  },
);

test('Charge from integer-value currency string - biggest Integer',
  () => {
    const expectedOutput = getChargeObject('USD', '9007199254740991', 'N')
    const stringCharge = new ApplyingCharge<'FixCharges', ChargeName, FixCharge, FixChargeMapType, 'USD', Mandatory, FixTypeRequest>('FixCharges')
      .currencyChargeFromStringValue('USD 9007199254740991', 'N');
    expect(stringCharge.getCharge()).toMatchObject(expectedOutput);
  },
);


test('Charge from decimal-value currency string - NIS',
  () => {
    const expectedOutput = getChargeObject('NIS', '30.343', 'Y')
    const stringCharge = new ApplyingCharge<'FixCharges', ChargeName, FixCharge,FixChargeMapType, 'NIS', Mandatory,FixTypeRequest>(
      'FixCharges')
      .currencyChargeFromStringValue('NIS 30.343', 'Y');
    expect(stringCharge.getCharge()).toMatchObject(expectedOutput);
  },
);

test('Charge from decimal-value currency string - USD',
  () => {
    const expectedOutput = getChargeObject('USD', '70.343', 'Y')
    const stringCharge = new ApplyingCharge<'FixCharges', ChargeName, FixCharge,FixChargeMapType, 'NIS', Mandatory,FixTypeRequest>(
      'FixCharges')
      .currencyChargeFromStringValue('USD 70.343', 'Y');
    expect(stringCharge.getCharge()).toMatchObject(expectedOutput);
  },
);

test('Charge from decimal-value currency string - EUR',
  () => {
    const expectedOutput = getChargeObject('EUR', '700.343', 'Y')
    const stringCharge = new ApplyingCharge<'FixCharges', ChargeName, FixCharge,FixChargeMapType, 'NIS', Mandatory,FixTypeRequest>(
      'FixCharges')
      .currencyChargeFromStringValue('EUR 700.343', 'Y');
    expect(stringCharge.getCharge()).toMatchObject(expectedOutput);
  },
);



test('Charge from decimal-value currency string - Ending zeroes',
  () => {
    const expectedOutput = getChargeObject('NIS', '30.000000', 'Y')
    const stringCharge = new ApplyingCharge<'FixCharges', ChargeName, FixCharge,FixChargeMapType, 'NIS', Mandatory,FixTypeRequest>(
      'FixCharges')
      .currencyChargeFromStringValue('NIS 30.000000', 'Y');
    expect(stringCharge.getCharge()).toMatchObject(expectedOutput);
  },
);


test('Charge from decimal-value currency string - Leading zeroes',
  () => {
    const stringCharge = new ApplyingCharge<'FixCharges', ChargeName, FixCharge,FixChargeMapType, 'NIS', Mandatory,FixTypeRequest>(
      'FixCharges')
      .currencyChargeFromStringValue('NIS 030.000000', 'Y');
    expect(stringCharge.getCharge()).toBe(undefined)
  },
);



test('Charge from invalid currency string - No leading 0.',
  () => {
    const stringCharge = new ApplyingCharge<'FixCharges', ChargeName, FixCharge,FixChargeMapType, 'NIS', Mandatory,FixTypeRequest>(
      'FixCharges')
      .currencyChargeFromStringValue('NIS .343', 'Y');
    expect(stringCharge.getCharge()).toBe(undefined);
  },
);

test('Charge from invalid currency string - No digits after dot.',
  () => {
    const stringCharge = new ApplyingCharge<'FixCharges', ChargeName, FixCharge,FixChargeMapType, 'NIS', Mandatory,FixTypeRequest>(
      'FixCharges')
      .currencyChargeFromStringValue('NIS 40.', 'Y');
    expect(stringCharge.getCharge()).toBe(undefined);
  },
);



test('Charge from invalid currency string - includes a letter at the end.',
  () => {
    const stringCharge = new ApplyingCharge<'FixCharges', ChargeName, FixCharge,FixChargeMapType, 'NIS', Mandatory,FixTypeRequest>(
      'FixCharges')
      .currencyChargeFromStringValue('NIS 4.343a', 'Y');
    expect(stringCharge.getCharge()).toBe(undefined);
  },
);

test('Charge from invalid currency string - includes a slash in the middle.',
  () => {
    const stringCharge = new ApplyingCharge<'FixCharges', ChargeName, FixCharge,FixChargeMapType, 'NIS', Mandatory,FixTypeRequest>(
      'FixCharges')
      .currencyChargeFromStringValue('NIS 4.34/3a', 'Y');

     expect(stringCharge.getCharge()).toBe(undefined);
  },
);

test('Scaling charge with string: NIS 67.1084 * 0.0',
  () => {
    const thisCurrency1 = new ApplyingCharge<'FixCharges', ChargeName, FixCharge, FixChargeMapType, 'NIS', Mandatory, FixTypeRequest>(
      'FixCharges',
      { currency: 'NIS', amount: '67.1084', mandatory: 'Y' },
    );
    const thisCurrency2 = new ApplyingCharge<'FixCharges', ChargeName, FixCharge, FixChargeMapType, 'NIS', Mandatory, FixTypeRequest>(
      'FixCharges',
      { currency: 'NIS', amount: '67.1084', mandatory: 'Y' },
    );

    const scalar1 = '0'
    const scalar2 = '0.0'

    thisCurrency1.scaleCharge(scalar1);
    thisCurrency2.scaleCharge(scalar2);

    const expectedOutput = getChargeObject('NIS', '0', 'Y')

    expect(thisCurrency1.getCharge()).toStrictEqual(expectedOutput);
    expect(thisCurrency2.getCharge()).toStrictEqual(expectedOutput);
  },
);



test('Scaling charge with string: NIS 67.1084 * 1200.34 (kg)',
  () => {
    const thisCurrency = new ApplyingCharge<'FixCharges', ChargeName, FixCharge, FixChargeMapType, 'NIS', Mandatory, FixTypeRequest>(
      'FixCharges',
      { currency: 'NIS', amount: '67.1084', mandatory: 'Y' },
    );

    const scalar = '1200.34'

    thisCurrency.scaleCharge(scalar);

    // console.log(`Multiply by 1200.34 (kg) = ${thisCurrency.getCharge()?.amount}`)
    // console.log(`Using Javascript Numbers: (32.443 + 34.6654) * 1200.34 = ${(Number(32.443) + Number(34.6654)) * 1200.34}`)
    const expectedOutput = getChargeObject('NIS', '80552.896856', 'Y')
    expect(thisCurrency.getCharge()).toStrictEqual(expectedOutput);
  },
);


test('Applying charge ToMoney - NIS ',
  () => {
    const thisCurrency = new ApplyingCharge<'FixCharges', ChargeName, FixCharge,FixChargeMapType, 'NIS', Mandatory,FixTypeRequest>(
      'FixCharges',
      { currency: 'NIS', amount: '32.45', mandatory: 'Y' } ,
    );


    const expectedOutput = new Money('32.45', 'NIS')

    expect(thisCurrency.toMoney()).toStrictEqual(expectedOutput);
  }
);

test('Applying charge ToMoney - USD ',
  () => {
    const thisCurrency = new ApplyingCharge<'FixCharges', ChargeName, FixCharge,FixChargeMapType, 'USD', Mandatory,FixTypeRequest>(
      'FixCharges',
      { currency: 'USD', amount: '32', mandatory: 'Y' } ,
    );


    const expectedOutput = new Money('32', 'USD')

    expect(thisCurrency.toMoney()).toStrictEqual(expectedOutput);
  }
);


test('Applying charge ToMoney - EUR ',
  () => {
    const thisCurrency = new ApplyingCharge<'FixCharges', ChargeName, FixCharge,FixChargeMapType, 'EUR', Mandatory,FixTypeRequest>(
      'FixCharges',
      { currency: 'EUR', amount: '32.0', mandatory: 'Y' } ,
    );
    const expectedOutput = new Money('32.0', 'EUR')

    expect(thisCurrency.toMoney()).toStrictEqual(expectedOutput);
  }
);

test('Applying charge weight Charge Parameter - TON',
  () => {
    const thisCurrency = new ApplyingCharge<'FixCharges', ChargeName, FixCharge,FixChargeMapType, 'EUR', Mandatory,FixTypeRequest>(
      'FixCharges',
    );
    const unit:WeightUnit = "ton"
    const weightRatioRule: WeightRatioRule  = {ratio:"200", charge:{currency:"EUR", amount:"1000", mandatory:'Y'}}
  /*
  Note ->
       weightChargeParameter = (applyingRateCharge: WeightRatioRule, unit: WeightUnit) => 
      `${applyingRateCharge.charge.currency} ${applyingRateCharge.charge.amount} / Physical/Volume Weight (Volume Weight = 1 m3 * ${applyingRateCharge.ratio} ${unit})`;
 
  */   
    const expectedOutput = "EUR 1000 / Physical/Volume Weight (Volume Weight = 1 m3 * 200 ton)"
    
    expect(thisCurrency.weightChargeParameter(weightRatioRule, unit)).toStrictEqual(expectedOutput);
  }
);

test('Applying charge weight Charge Parameter - KG',
  () => {
    const thisCurrency = new ApplyingCharge<'FixCharges', ChargeName, FixCharge,FixChargeMapType, 'NIS', Mandatory,FixTypeRequest>(
      'FixCharges',
    );
    const unit:WeightUnit = "kg"
    const weightRatioRule: WeightRatioRule  = {ratio:"150", charge:{currency:"NIS", amount:"150", mandatory:'Y'}}

    const expectedOutput = "NIS 150 / Physical/Volume Weight (Volume Weight = 1 m3 * 150 kg)"
    
    expect(thisCurrency.weightChargeParameter(weightRatioRule, unit)).toStrictEqual(expectedOutput);
  }
);


// test('Applying charge boxes request',
//   () => {
//     const thisCurrency = new ApplyingCharge<'FixCharges', ChargeName, FixCharge,FixChargeMapType, 'EUR', Mandatory,FixTypeRequest>(
//       'FixCharges',
//     );

  
//     const boxes = [getBoxesMocked1Meter('167', '4', {unit:'kg', value:'100'})]

//     const expectedOutput = boxString(4,100,100,100,400,100,400,668,167,668)
//     expect(thisCurrency.boxesRequest(boxes)).toMatch(expectedOutput);
//   }
// );







// test('Scaling charge with string: NIS 32.45 * 3',
//   () => {
//     const thisCurrency = new ApplyingCharge<'FixCharges', ChargeName, FixCharge,FixChargeMapType, 'NIS', Mandatory,FixTypeRequest>(
//       'FixCharges',
//       { currency: 'NIS', amount: '32.45', mandatory: 'Y' } ,
//     );

//     const scalar = '3'

//     thisCurrency.scaleCharge(scalar);
//     const expectedOutput = getChargeObject('NIS', '97.35', 'Y')

//     expect(thisCurrency.getCharge()).toStrictEqual(expectedOutput);
//   }
// );




// test('Scaling charge with Weight: NIS 32.45 * {value: "1024.34", unit: "ton" }}',
//   () => {

//     const thisCurrency = new ApplyingCharge<'FixCharges', ChargeName, FixCharge,FixChargeMapType, 'NIS', Mandatory,FixTypeRequest>(
//       'FixCharges',
//       { currency: 'NIS', amount: '32.45', mandatory: 'Y' },
//     );

//     thisCurrency.scaleCharge('1024.34');

//     expect(thisCurrency.getCharge()).toStrictEqual({amount: '33239.833', currency: 'NIS', mandatory: 'Y'});
//   }
// );





// test('Scaling charge with Weight: NIS 32.45 * {value: "1024.34", unit: "kg" }}',
//   () => {

//   const thisCurrency = new ApplyingCharge<'FixCharges', ChargeName, FixCharge,FixChargeMapType, 'NIS', Mandatory,FixTypeRequest>(
//     'FixCharges',
//       { currency: 'NIS', amount: '32.45', mandatory: 'Y' },
//     );

//     thisCurrency.scaleCharge("1024.34");

//     expect(thisCurrency.getCharge()).toStrictEqual({amount: '33239.833', currency: 'NIS', mandatory: 'Y'});
//   }
// );