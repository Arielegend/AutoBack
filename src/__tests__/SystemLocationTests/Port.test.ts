import { Country } from '../../SystemLocations/Country';
import { Port } from '../../SystemLocations/Port';

test(
  'Country',
  () => {
    const port = new Port({
      city: 'Berlin',
      portName: 'Tegel',
      portCode: 'TXL',
      postCode: '546612',
      countryCode: 'DE',
      countryName: 'Germany',
      region: 'Europe',
    });
    console.log(port.toString());
    console.log(port.getLocationHash());
    const countryLocationHash = new Port().fromLocationHash('Tegel#TXL#Berlin#546612#DE#Germany#Europe');
    countryLocationHash && console.log(countryLocationHash.getLocationHash());
  },
);