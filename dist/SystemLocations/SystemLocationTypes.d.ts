export declare type PointType = 'Port' | 'Address' | 'PostalCodeRange' | 'Country';
export declare type Region = 'FarEast' | 'Europe' | 'NorthAmerica';
export declare type CountryMeta = {
    countryName: string;
    countryCode: string;
    region: Region;
};
export declare type PostCodeMeta = {
    postCodeString: string;
    postCodeFormatValidator: (postCodeString: string) => boolean;
};
export declare type PostCodeMetaRange = {
    startPostCodeString: string;
    endPostCodeString: string;
    postCodeFormatValidator: (postCodeString: string) => boolean;
};
export declare type AddressMeta = {
    city: string;
    postCode: string;
} & CountryMeta;
export declare type PortMeta = {
    portName: string;
    portCode: string;
} & AddressMeta;
export declare type PointObject<PT extends PointType> = PT extends 'Port' ? PortMeta : PT extends 'StreetAddress' ? AddressMeta : PT extends 'PostCodeMetaRange' ? PostCodeMetaRange : CountryMeta;
export declare type Point<PT extends PointType, PObj extends PointObject<PT>> = PObj extends PortMeta ? {
    locationType: PT;
    location: PortMeta;
} : PObj extends AddressMeta ? {
    locationType: PT;
    location: AddressMeta;
} : PObj extends PostCodeMetaRange ? {
    locationType: PT;
    location: PostCodeMeta;
} : {
    locationType: PT;
    location: CountryMeta;
};
export declare type SystemPointType = {
    locationType: 'Port';
    location: PortMeta;
} | {
    locationType: 'Address';
    location: AddressMeta;
} | {
    locationType: 'Country';
    location: CountryMeta;
};
export interface SystemPoint<PT extends PointType, PObj extends PointObject<PT>, P extends Point<PT, PObj> & SystemPointType> {
    pointObject?: PObj;
    getPointObj: () => PObj | null;
    getLocationHash(): string;
    fromLocationHash(locationHash: string): void;
    toString(): string;
}
export declare const hashMatcher: () => RegExp;
