import { ePersonType } from "./ePersonType";
import { eThirdGender } from "./eThirdGender";
import { eTypeId } from "./eTypeId";


export interface Third {
    entId: number;
    typeId: eTypeId; 
    thirdTypes: string[];// You'll need to define or reference the actual enum or replace this with the correct type.
    rutPath?: string; 
    personType: ePersonType; // Same as above, define or reference the actual enum.
    names?: string; 
    lastNames?: string; 
    socialReason?: string; 
    gender?: eThirdGender; // And again, define or reference the actual enum.
    idNumber: number;
    verificationNumber?: number; 
    state: boolean;
    photoPath?: string;
    country: string;
    province: string;
    city: string; 
    address: string;
    phoneNumber: string; 
    email: string; 
    creationDate: string;
    updateDate: string;
  }