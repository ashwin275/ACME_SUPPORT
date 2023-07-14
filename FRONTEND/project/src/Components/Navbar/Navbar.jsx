import React from 'react'
import './Navbar.css'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../Features/Slice'
import { Link, useNavigate } from 'react-router-dom'
function Navbar() {
  const {userInfo} = useSelector((state)=>state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  console.log('USERINFO',userInfo)

  const handlelogout=()=>{
      dispatch(logout())
      navigate('/login')
  }
  return (
    <div>
      <nav className="navbar navbar-expand-lg shadow p-3 mb-5">
  <div className="container-fluid">
  <Link className="navbar-brand ms-5" to="/">
    <img src="/src/images/logo.png" width="100" height="30" alt=""/>
  </Link>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse " id="navbarNav">
      <ul className="navbar-nav ms-auto list-text mt-2">

        {
          userInfo.role?(
         <> <li className="nav-item ">Welcome &nbsp; <span className='text-uppercase'>{userInfo.username}</span></li> &nbsp;
         &nbsp;
          <p className='logout' type="button" onClick={handlelogout}> LOGOUT</p>
          </>
        ):(<>
       <Link to='/login' className='login'> LOGIN</Link>
        </>)
        }
        
        
      </ul>
    </div>
  </div>
</nav>
    </div>
  )
}

export default Navbar
