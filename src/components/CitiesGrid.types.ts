export type CoordsType = {
  lat: number;
  lng: number;
}

export type CityType = {
  active: boolean;
  continent: string;
  country: string;
  description: string;
  image: string;
  name: string;
  coords: CoordsType;
}

export interface CityBoxInterface {
  city: CityType
}

export interface CitiesGridInterface {
  cities: CityType[]
}