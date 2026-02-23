import sendRequest from "@/api/axios"
import { POST_METHOD } from "../type/ConstRequestMethods"
import type { ResultT } from "../type/ResultType"



const uploadApi = (data: FormData) : Promise<ResultT<Array<string>>> =>{
    return sendRequest<ResultT<Array<string>>>({
        url:`/api/upload-api/upload/image`,
        method:POST_METHOD,
        data:data
    })
    .then(res=>res.data)
    .catch(err=>{throw err})
}
export {uploadApi}