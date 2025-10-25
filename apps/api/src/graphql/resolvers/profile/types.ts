export interface ILocationInput {
  type?: string;
  coordinates?: number[];
}

export interface IAddressInput {
  city?: string;
  region?: string;
  country?: string;
}

export interface IUpdateProfileInput {
  name?: string;
  location?: ILocationInput;
  address?: IAddressInput;
}
