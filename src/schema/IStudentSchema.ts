import Idefaults from "./IDefault";
import { IStreamSchema } from "./IStreamSchema";

export interface IStudentSchema extends Idefaults{
    id : string;
    firstName : string;
    otherNames : string;
    payCode : string;
    streamId : string;
    stream : IStreamSchema;
}

export interface IPostStudentSchema{
    firstName : string;
    otherNames : string;
    payCode : string;
    streamId : string;
}

