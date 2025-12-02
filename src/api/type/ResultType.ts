export interface PageResult<T>{
    pageNum:number;
    pageSize:number;
    total:number;
    rows:T
}

export interface ResultT<T>{
    code:number;
    msg:string;
    data:T
}