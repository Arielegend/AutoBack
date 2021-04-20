import { Address } from './Address';
import { Point, PortMeta, SystemPoint } from './SystemLocationTypes';
export declare class Port implements SystemPoint<'Port', PortMeta, Point<'Port', PortMeta>> {
    pointObject?: PortMeta;
    constructor(port?: PortMeta);
    getPointObj: () => PortMeta | null;
    fromLocationHash(locationHash: string): Port | undefined;
    getLocationHash: () => string;
    getAddressHash: () => string;
    getAddressStr: () => string;
    getAddress: () => Address | undefined;
    toString: () => string;
}
