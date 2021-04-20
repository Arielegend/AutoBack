import { ContainerType, Length, Weight } from '../Rates/rateTypes';
export declare type BoxDetails = {
    height: Length;
    width: Length;
    length: Length;
    weight: Weight;
    count: string;
};
export declare type ContainerDetails = {
    containerType: ContainerType;
    count: string;
    weight: Weight<'ton'>;
};
export declare type RequestFobAir = {
    boxes: BoxDetails[];
};
export declare type RequestFobLcl = {
    boxes: BoxDetails[];
};
export declare type RequestFobFcl = {
    containers: ContainerDetails[];
};
export declare type RequestDetails = RequestFobLcl | RequestFobFcl | RequestFobAir;
