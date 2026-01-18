export interface PageResult<T>{
    pageNum:number;
    pageSize:number;
    total:number;
    rows:Array<T>
}

export interface ResultT<T>{
    code:number;
    msg:string;
    data:T
}

export interface CursorPageResult<T>{
    cursor: string;
    hasNext: boolean;
    rows: Array<T>
}