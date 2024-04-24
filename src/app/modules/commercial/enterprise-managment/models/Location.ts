import { City, CityShort } from './City'
import { Country } from './Country';
import { Department } from './Department';


export interface Location {
  id?: number;
  address: string;
  city: number;
  country: number;
  department: number;
}

export interface LocationDetails {
  id?: number;
  address: string;
  city: CityShort;
  country: Country;
  department: Department;
}