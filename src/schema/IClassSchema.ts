import Idefaults from "./IDefault";
import { IStreamSchema } from "./IStreamSchema";

export interface IClassSchema extends Idefaults {
    id : string;
    name : string;
    more_info : string;
    streams : IStreamSchema[];
    streamCount : number;
}

export interface IPostClassSchema {
    name : string;
    more_info : string;
}

