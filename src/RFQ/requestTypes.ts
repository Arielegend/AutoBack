import { ContainerType, Length, Weight } from '../Rates/rateTypes';

/*
Types for representing a request
*/
export type BoxDetails = {
  height: Length,
  width: Length,
  length: Length,
  weight: Weight,
  count: string
}

export type ContainerDetails = {
  containerType: ContainerType,
  count: string,
  weight: Weight<'ton'>
}

export type RequestFobAir = {
  boxes: BoxDetails[]
  
}

export type RequestFobLcl = {
  boxes: BoxDetails[]
}

export type RequestFobFcl = {
  containers: ContainerDetails[]
}

export type RequestDetails = RequestFobLcl | RequestFobFcl | RequestFobAir

