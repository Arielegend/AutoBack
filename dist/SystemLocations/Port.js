"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Port = void 0;
const Address_1 = require("./Address");
class Port {
    constructor(port) {
        this.getPointObj = () => {
            return this.pointObject === undefined ? null : {
                portName: this.pointObject.portName,
                portCode: this.pointObject.portCode,
                city: this.pointObject.city,
                postCode: this.pointObject.postCode,
                countryCode: this.pointObject.countryCode,
                countryName: this.pointObject.countryName,
                region: this.pointObject.region,
            };
        };
        this.getLocationHash = () => this.pointObject === undefined ? '' : `${this.pointObject.portName}#${this.pointObject.portCode}#${this.getAddressHash()}`;
        this.getAddressHash = () => {
            const address = this.getAddress();
            return address === undefined ? '' : address.getLocationHash();
        };
        this.getAddressStr = () => {
            const address = this.getAddress();
            return address === undefined ? '' : address.toString();
        };
        this.getAddress = () => this.pointObject === undefined ?
            undefined : new Address_1.Address({
            city: this.pointObject.city,
            postCode: this.pointObject.postCode,
            countryCode: this.pointObject.countryCode,
            countryName: this.pointObject.countryName,
            region: this.pointObject.region,
        });
        this.toString = () => this.pointObject === undefined ? '' : `Port Name: ${this.pointObject.portName}, Port Code: ${this.pointObject.portCode}\n${this.getAddressStr()}`;
        this.pointObject = port;
    }
    fromLocationHash(locationHash) {
        const matchArray = locationHash.split('#');
        const portPart = matchArray.slice(0, 2);
        const addressPart = matchArray.slice(2);
        const address = new Address_1.Address().fromLocationHash(addressPart.join('#'))?.getPointObj();
        if (address) {
            return new Port({
                portName: portPart[0],
                postCode: portPart[1],
                city: address.city,
                countryCode: address.countryCode,
                countryName: address.countryName,
                portCode: address.postCode,
                region: address.region,
            });
        }
    }
}
exports.Port = Port;
//# sourceMappingURL=Port.js.map