

export default interface ITableHeaderSchema{
    id : string;
    numeric : boolean;
    disablePadding : boolean;
    label : string;
    alignment : string;
    resolver : (row : any) => string | number | boolean | null | undefined
}