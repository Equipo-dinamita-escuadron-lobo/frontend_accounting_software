import { Location } from "./Location";
import { PersonType } from "./PersonType";

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
}