import { Country } from '../../SystemLocations/Country';

test(
  'Country',
  () => {
    const country = new Country({ countryCode: 'DE', countryName: 'Germany', region: 'Europe' });
   /* console.log(country.toString());
    console.log(country.getLocationHash());*/
    const countryLocationHash = new Country().fromLocationHash('DE#Germany#Europe');
    // countryLocationHash && console.log(countryLocationHash.getLocationHash())
  },
);