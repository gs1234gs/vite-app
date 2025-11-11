interface PageType<T>{
    pageNum:number,
    pageSize:number,
    condition:T
}
export type {PageType}