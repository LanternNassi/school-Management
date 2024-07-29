import Idefaults from "./IDefault";

export interface IStreamSchema extends Idefaults{
    id : string;
    name : string;
    more_info : string;
    classId : string;
}

export interface IPostStreamSchema{
    name : string;
    more_info : string;
    classId : string;
}