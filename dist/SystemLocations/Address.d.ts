import { Country } from './Country';
import { AddressMeta, Point, SystemPoint } from './SystemLocationTypes';
export declare class Address implements SystemPoint<'Address', AddressMeta, Point<'Address', AddressMeta>> {
    pointObject?: AddressMeta;
    constructor(address?: AddressMeta);
    fromLocationHash(locationHash: string): Address | undefined;
    getLocationHash: () => string;
    fromCountryHash: (countryHash: string) => Country;
    getCountryHash: () => string;
    getCountryString: () => string;
    getCountry: () => Country | undefined;
    toString: () => string;
    getPointObj(): AddressMeta | null;
}
