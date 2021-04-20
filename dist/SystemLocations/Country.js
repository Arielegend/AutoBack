"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Country = void 0;
class Country {
    constructor(country) {
        this.getLocationHash = () => this.pointObject === undefined ? '' : `${this.pointObject.countryCode}#${this.pointObject.countryName}#${this.pointObject.region}`;
        this.toString = () => this.pointObject === undefined ? '' : `${this.pointObject.countryCode}, ${this.pointObject.countryName}, ${this.pointObject.region}`;
        this.fromLocationHash = (locationHash) => {
            const hashMatchArray = locationHash.split('#');
            return new Country({ countryName: hashMatchArray[0], countryCode: hashMatchArray[1], region: hashMatchArray[2] });
        };
        this.pointObject = country;
    }
    getPointObj() {
        return this.pointObject === undefined ? null : { countryCode: this.pointObject.countryCode, countryName: this.pointObject.countryName, region: this.pointObject.region };
    }
}
exports.Country = Country;
//# sourceMappingURL=Country.js.map