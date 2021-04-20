import { Country } from './Country';
import { AddressMeta, Point, Region, SystemPoint } from './SystemLocationTypes';

export class Address implements SystemPoint<'Address', AddressMeta, Point<'Address', AddressMeta>> {
  pointObject?: AddressMeta;

  constructor(address?: AddressMeta) {
    this.pointObject = address;
  }

  fromLocationHash(locationHash: string): Address | undefined {
    const locationArray = locationHash.split('#');
    const addressPart = locationArray.slice(0, 2);
    const countryPart = locationArray.slice(2);

    const country = this.fromCountryHash(countryPart.join('#')).getPointObj();

    if (country) {
      return new Address({
        countryCode: country.countryCode,
        countryName: country.countryName,
        region: country.region as Region,
        city: addressPart[0],
        postCode: addressPart[1],
      });
    }

  }

  getLocationHash = (): string =>
    this.pointObject === undefined ? '' : `${this.pointObject.city}#${this.pointObject.postCode}#${this.getCountryHash()}`;


  fromCountryHash = (countryHash: string): Country =>
    new Country().fromLocationHash(countryHash);

  getCountryHash = (): string => {
    const country = this.getCountry();
    return country === undefined ? '' : country.getLocationHash();
  };

  getCountryString = (): string => {
    const country = this.getCountry();
    return country === undefined ? '' : `Country: ${country.toString()}`;
  };

  getCountry = (): Country | undefined =>
    this.pointObject === undefined ?
      undefined :
      new Country(
        {
          countryCode: this.pointObject.countryCode,
          countryName: this.pointObject.countryName,
          region: this.pointObject.region,
        },
      );

  toString = (): string =>
    this.pointObject === undefined ? '' : `City: ${this.pointObject.city},\nPost Code:${this.pointObject.postCode},\nCountry: ${this.getCountryString()}`;

  getPointObj(): AddressMeta | null {
    return this.pointObject === undefined? null :{ city: this.pointObject.city, countryCode: this.pointObject.countryCode, countryName:  this.pointObject.countryName, postCode:  this.pointObject.postCode, region:  this.pointObject.region };
  }


}