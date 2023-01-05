export interface TextProps {
    color?:string;
    backgroundColor?:string;
    bold?:boolean;
    italic?:boolean;
    [props:string]:unknown;
}