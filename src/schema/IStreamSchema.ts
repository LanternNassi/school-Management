import Idefaults from "./IDefault";
import { IPostClassSchema } from "./IClassSchema";

export interface IStreamSchema extends Idefaults{
    id : string;
    name : string;
    more_info : string;
    classId : string;
    class : IPostClassSchema;
}

export interface IPostStreamSchema{
    name : string;
    more_info : string;
    classId : string;
}