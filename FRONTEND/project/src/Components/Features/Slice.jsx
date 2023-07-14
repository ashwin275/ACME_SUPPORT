import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
const initialState = {
  userInfo: {
    name:null
  },
  
};


const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
      
        setCredentials:(state,action)=>{
            state.userInfo = action.payload.userInfo
        },

        logout:(state,action) =>{
            state.userInfo = {name:null}
            Cookies.remove('Tokens')
        }
    }
})


export const {setCredentials,logout} = authSlice.actions;
export default authSlice.reducer;