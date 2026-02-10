interface PageType<T>{
    pageNum:number,
    pageSize:number,
    condition?:T
}
interface RequestCursorPage<T>{
    lastId:string;
    pageSize:number;
    order:string;//排序
    condition?:T
}

export type {PageType,RequestCursorPage}
