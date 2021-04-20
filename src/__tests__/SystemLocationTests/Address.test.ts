 import { Address } from '../../SystemLocations/Address';

test(
  'Address',
  () => {
    const address = new Address({city:'Berlin', postCode: '546612', countryCode: 'DE', countryName: 'Germany', region: 'Europe' });
    /*console.log(address.toString());
    console.log(address.getLocationHash());*/
    const addressLocationHash = new Address().fromLocationHash('Berlin#546612#DE#Germany#Europe');
    // addressLocationHash && console.log(addressLocationHash.getLocationHash())
  },
);