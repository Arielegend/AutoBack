import { Address } from './Address';
import { Point, PortMeta, SystemPoint } from './SystemLocationTypes';

export class Port implements SystemPoint<'Port', PortMeta, Point<'Port', PortMeta>> {
  pointObject?: PortMeta;

  constructor(port?: PortMeta) {
    this.pointObject = port;
  }

  getPointObj: () => PortMeta | null = () => {
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

  fromLocationHash(locationHash: string): Port | undefined {
    const matchArray = locationHash.split('#');
    const portPart = matchArray.slice(0, 2);

     const addressPart = matchArray.slice(2);

    const address = new Address().fromLocationHash(addressPart.join('#'))?.getPointObj();
    if (address) {
      return new Port(
        {
          portName: portPart[0],
          postCode: portPart[1],
          city: address.city,
          countryCode: address.countryCode,
          countryName: address.countryName,
          portCode: address.postCode,
          region: address.region,
        },
      );
    }

  }

  getLocationHash = (): string =>
    this.pointObject === undefined ? '' : `${this.pointObject.portName}#${this.pointObject.portCode}#${this.getAddressHash()}`;

  getAddressHash = (): string => {
    const address = this.getAddress();
    return address === undefined ? '' : address.getLocationHash();
  };


  getAddressStr = (): string => {
    const address = this.getAddress();
    return address === undefined ? '' : address.toString();
  };

  getAddress = (): Address | undefined =>
    this.pointObject === undefined ?
      undefined : new Address(
      {
        city: this.pointObject.city,
        postCode: this.pointObject.postCode,
        countryCode: this.pointObject.countryCode,
        countryName: this.pointObject.countryName,
        region: this.pointObject.region,
      },
      );

  toString = (): string =>
    this.pointObject === undefined ? '' : `Port Name: ${this.pointObject.portName}, Port Code: ${this.pointObject.portCode}\n${this.getAddressStr()}`;

}