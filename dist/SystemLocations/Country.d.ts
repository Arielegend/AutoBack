import { CountryMeta, Point, SystemPoint } from './SystemLocationTypes';
export declare class Country implements SystemPoint<'Country', CountryMeta, Point<'Country', CountryMeta>> {
    pointObject?: CountryMeta;
    constructor(country?: CountryMeta);
    getLocationHash: () => string;
    toString: () => string;
    fromLocationHash: (locationHash: string) => Country;
    getPointObj(): CountryMeta | null;
}
