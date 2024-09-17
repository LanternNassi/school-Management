

export default interface ITableHeaderSchema<T = any>{
    id : string;
    numeric : boolean;
    disablePadding : boolean;
    label : string;
    alignment : "left" | "right" | "center";
    resolver : (row : T) => string | number | boolean | null | undefined
}