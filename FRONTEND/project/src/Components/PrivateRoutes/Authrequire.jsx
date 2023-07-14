import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom';

function Authrequire() {
    const {userInfo} = useSelector((state)=>state.auth);

    
    if (userInfo.username){
              return <Outlet/>
    }else{
        return <Navigate to="/login"/>
    }
}

export default Authrequire
