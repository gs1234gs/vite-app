import sendRequest from "../axios";
import { SYS_API_PREFIX } from "../prefix/PrefixApi";
import { DELETE_METHOD, GET_METHOD, POST_METHOD } from "../type/ConstRequestMethods";
import type { PageType } from "../type/PageType";
import type { TenantType, TenantSaveType, PageTenantCondition } from "./type/TenantType";

const TENANT_PREFIX = `${SYS_API_PREFIX}/tenant`;

const findPage = (data: PageType<PageTenantCondition>) => {
    return sendRequest({
        url: `${TENANT_PREFIX}/findPage`,
        method: POST_METHOD,
        data: data
    })
    .then(res => res)
    .catch(err => { throw err });
};

const findById = (id: number) => {
    return sendRequest({
        url: `${TENANT_PREFIX}/findById/${id}`,
        method: GET_METHOD,
    })
    .then(res => res)
    .catch(err => { throw err });
};

const deleteById = (id: number) => {
    return sendRequest({
        url: `${TENANT_PREFIX}/deleteById/${id}`,
        method: DELETE_METHOD,
    })
    .then(res => res)
    .catch(err => { throw err });
};

const save = (data: TenantSaveType) => {
    return sendRequest({
        url: `${TENANT_PREFIX}/save`,
        method: POST_METHOD,
        data: data
    })
    .then(res => res)
    .catch(err => { throw err });
};

export { findPage, findById, deleteById, save };
