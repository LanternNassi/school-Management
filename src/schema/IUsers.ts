
import Idefaults from "./IDefault";
import {IContactSchema} from "./IContact";

export interface IUserSchema extends Idefaults{
    id : string;
    firstName : string;
    otherNames : string;
    username : string;
    group : string;
    contacts : IContactSchema[];
}

export interface IUserPostSchema {
    firstName : string;
    otherNames : string;
    password : string;
    username : string;
    group : string;
}

