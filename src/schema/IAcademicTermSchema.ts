import Idefaults from "./IDefault";

import { IClassSchema } from "./IClassSchema";

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

// Generic response from the server

export interface IAcademicTermResponse {
    meta_data : {
        total_term_fees : number;
        total_paid_fees : number;
        total_unpaid_fees : number;
        total_students : number;
    };
    class_meta_data : {
        id : string;
        class : IClassSchema;
        total_term_fees : number;
        total_paid_fees : number;
        total_unpaid_fees : number;
        total_students : number;
    }[];
    term : IAcademicTermSchema;
}