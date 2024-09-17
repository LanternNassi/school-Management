import Idefaults from "./IDefault";

import { IFeesStructureSchema } from "./IFeesStructureSchema";


export interface ITransactionsSchema extends Idefaults{
    id : string;
    studentFeesStructureId : string;
    amount : number;
    studentFeesStructure : IFeesStructureSchema | null;
}

export interface IPostITransactionsSchema{
    studentFeesStructureId : string;
    amount : number;
}