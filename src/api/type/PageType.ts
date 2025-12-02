interface PageType<T>{
    pageNum:number,
    pageSize:number,
    condition:T
}
interface RequestCursorPage<T>{
    lastId:number;
    pageSize:number;
    order:string;
    condition:T
}

export type {PageType,RequestCursorPage}
