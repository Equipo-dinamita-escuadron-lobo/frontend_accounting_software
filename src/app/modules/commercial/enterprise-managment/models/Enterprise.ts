import { EnterpriseType } from "./EnterpriseType";
import { Location, LocationDetails } from "./Location";
import { PersonType } from "./PersonType";
import { TaxLiability } from "./TaxLiability";
import { TaxPayerType } from "./TaxPayerType";

export interface Enterprise{
    name: String;
    nit: String;
    phone: String;
    branch: String;
    email: String;
    logo: String;
    taxLiabilities: number[];
    taxPayerType: number;
    enterpriseType: number;
    personType: PersonType;
    location: Location;
    dv: String;
    state?: string;
    mainActivity?:number;
    secondaryActivity?: number;
}

export interface EnterpriseDetails{
    id?:string;
    name: String;
    nit: String;
    phone: String;
    branch: String;
    email: String;
    logo: string;
    taxLiabilities: TaxLiability[];
    taxPayerType: TaxPayerType;
    enterpriseType: EnterpriseType;
    personType: PersonType;
    location: LocationDetails;
    dv: String;
    mainActivity?:number;
    secondaryActivity?: number;
}