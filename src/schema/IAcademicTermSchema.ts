import Idefaults from "./IDefault";

export interface IAcademicTermSchema extends Idefaults{
    id : string;
    name : string;
    description : string;
    isActive : boolean;
    startDate : string;
    endDate : string;
}

export interface IPostAcademicTermSchema {
    name : string;
    description : string;
    isActive : boolean;
    startDate : string;
    endDate : string;
}