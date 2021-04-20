import { AddressMeta, CountryMeta, hashMatcher, Point, Region, SystemPoint } from './SystemLocationTypes';

export class Country implements SystemPoint<'Country', CountryMeta, Point<'Country', CountryMeta>> {
  pointObject?: CountryMeta;

  constructor(country?: CountryMeta) {
    this.pointObject = country;
  }

  getLocationHash = (): string =>
    this.pointObject === undefined ? '' :`${this.pointObject.countryCode}#${this.pointObject.countryName}#${this.pointObject.region}`;

  toString = (): string =>
    this.pointObject === undefined? '' :`${this.pointObject.countryCode}, ${this.pointObject.countryName}, ${this.pointObject.region}`;

  fromLocationHash = (locationHash: string): Country => {
    const hashMatchArray = locationHash.split('#');
        return new Country({ countryName: hashMatchArray[0], countryCode: hashMatchArray[1], region: hashMatchArray[2] as Region });
   }

  getPointObj(): CountryMeta | null {
    return this.pointObject === undefined? null :{ countryCode: this.pointObject.countryCode, countryName:  this.pointObject.countryName, region:  this.pointObject.region };
  }
}