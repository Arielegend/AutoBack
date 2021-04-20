"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Address = void 0;
const Country_1 = require("./Country");
class Address {
    constructor(address) {
        this.getLocationHash = () => this.pointObject === undefined ? '' : `${this.pointObject.city}#${this.pointObject.postCode}#${this.getCountryHash()}`;
        this.fromCountryHash = (countryHash) => new Country_1.Country().fromLocationHash(countryHash);
        this.getCountryHash = () => {
            const country = this.getCountry();
            return country === undefined ? '' : country.getLocationHash();
        };
        this.getCountryString = () => {
            const country = this.getCountry();
            return country === undefined ? '' : `Country: ${country.toString()}`;
        };
        this.getCountry = () => this.pointObject === undefined ?
            undefined :
            new Country_1.Country({
                countryCode: this.pointObject.countryCode,
                countryName: this.pointObject.countryName,
                region: this.pointObject.region,
            });
        this.toString = () => this.pointObject === undefined ? '' : `City: ${this.pointObject.city},\nPost Code:${this.pointObject.postCode},\nCountry: ${this.getCountryString()}`;
        this.pointObject = address;
    }
    fromLocationHash(locationHash) {
        const locationArray = locationHash.split('#');
        const addressPart = locationArray.slice(0, 2);
        const countryPart = locationArray.slice(2);
        const country = this.fromCountryHash(countryPart.join('#')).getPointObj();
        if (country) {
            return new Address({
                countryCode: country.countryCode,
                countryName: country.countryName,
                region: country.region,
                city: addressPart[0],
                postCode: addressPart[1],
            });
        }
    }
    getPointObj() {
        return this.pointObject === undefined ? null : { city: this.pointObject.city, countryCode: this.pointObject.countryCode, countryName: this.pointObject.countryName, postCode: this.pointObject.postCode, region: this.pointObject.region };
    }
}
exports.Address = Address;
//# sourceMappingURL=Address.js.map