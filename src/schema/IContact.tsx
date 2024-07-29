
import Idefaults from "./IDefault";

export interface IContactSchema extends Idefaults {
    id : string;
    contact : string;
    email : string;
    location : string;
    contactUser : string;
} 

export interface IPostContactSchema {
    contact : string;
    email : string;
    location : string;
    contactUser : string;
}