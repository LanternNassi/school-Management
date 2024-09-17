import Idefaults from "./IDefault";
import { IStudentSchema } from "./IStudentSchema";
import { IAcademicTermSchema } from "./IAcademicTermSchema";

export interface IFeesStructureSchema extends Idefaults{
    id : string;
    studentId : string;
    termId : string;
    amount : number;
    isPaid : boolean;
    student : IStudentSchema;
    term : IAcademicTermSchema;
}

export interface IPostFeesStructureSchema {
    studentId : string;
    termId : string;
    amount : number;
    isPaid : boolean;
}