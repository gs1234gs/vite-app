import { createSlice } from "@reduxjs/toolkit";
// 创建一个切片
const initialStates =createSlice({
    name:"bread",
    initialState:{
        isCollapsed:false
    },
    reducers:{
        setCollapsed:state=>{
            state.isCollapsed=!state.isCollapsed
        }
    }
})

export const {setCollapsed}=initialStates.actions
export default initialStates.reducer