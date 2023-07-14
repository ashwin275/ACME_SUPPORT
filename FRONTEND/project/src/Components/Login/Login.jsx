import React, { useState } from 'react'
import './Login.css'
import axioInstancepublic from '../Axios/AxiosPublic'
import logoimage from'../../images/signin.gif'
import {toast} from 'react-toastify'
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux'
import { setCredentials } from '../Features/Slice'
import { useNavigate } from 'react-router-dom'
function Login() {
    const dispatch = useDispatch()
    const [email,SetEmail] = useState(true)
    const navigate = useNavigate()
    const [formData,setFormData] = useState({
        email:'',
        password:'',
       phone_number:'',
    })


    const handleInputChange = (event)=>{
        const {name,value} = event.target

        setFormData((prevstate)=>({...prevstate,[name]:value}));
        console.log(formData)
    }

    const handleSubmit=async (event)=>{
      event.preventDefault();

      let data; 

      if (email) {
        data = {
          email: formData.email,
          password: formData.password
        };
      } else {
        data = {
          phone_number: formData.phone_number,
          password: formData.password
        };
      }
     
      
      try{
        const response = await axioInstancepublic.post('users/login/',data)
        console.log('badrequst',response)
        toast.success(response.data.message)
        console.log(response.data)
        const userInfo = response.data.payload

        const tokenString = JSON.stringify(response.data.token);
        Cookies.set('Tokens',tokenString)
        dispatch(setCredentials({userInfo}))

         navigate('/home')

      }catch(error){
        console.log(error)
        if(error.response.status == 401){
            toast.error(error.response.data.detail)
        }
        else if(error.response.status == 400){
            toast.error(error.response.data.error)
        }
        
       
      }
    }

    const handleLoginMethod = ()=>{
        SetEmail(!email)
        setFormData({
            email:'',
            password:'',
            phone_number:'',
        })
    }
  return (
    <div>
      

      <section className="Signup" style={{ backgroundColor: "#fff" }}>
        <div className="container  ">
          <div className="row d-flex justify-content-center align-items-center ">
            <div className="col-lg-12 col-xl-11 col-xl-11signup">
              <div className="card card-signup text-black shadow-lg p-3 mb-5 bg-white ">
                <div className="card-body card-bodysignup p-md-5">
                  <div className="row justify-content-center">
                    <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                      <p className="text-center h1  mb-5 mx-1 mx-md-4 mt-4 textsignup">
                        LOGIN
                      </p>
                      
                      
                      

                      <form className="mx-1 mx-md-4" onSubmit={handleSubmit}>


                       {
                        email&& <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                        <div className="form-outline flex-fill mb-0">
                          <input
                            type="email"
                           
                            id="email"
                            name="email"
                            onChange={handleInputChange}
                      
                            className="form-control"
                            placeholder="Email"
                            autoComplete="off"
                            value={formData.email}
                          />
                        
                        </div>
                      </div>
                       }

                      {!email&&  <div className="d-flex flex-row align-items-center mb-4">
                          <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                          <div className="form-outline flex-fill mb-0">
                            <input
                              type="text"
                             
                              id="phone_number"
                              name="phone_number"
                              className="form-control"
                              placeholder="Mobile"
                             
                              onChange={handleInputChange}
                              autoComplete="off"
                              value={formData.phone_number}
                            />
                          
                          </div>
                        </div>}

                        <div className="d-flex flex-row align-items-center mb-4">
                          <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                          <div className="form-outline flex-fill mb-0">
                            <input
                              type="password"
                             
                              name="password"
                              id="password"
                          
                              onChange={handleInputChange}
                              className="form-control"
                              placeholder="Password"
                              autoComplete="off"
                              value={formData.password}
                            />
                           
                          </div>
                        </div>

                        <div className=" justify-content-center mx-4 mb-3 mb-lg-4">
                          <button
                            type="submit"
                            className="btn btn-outline-dark bt-lg"
                          >
                            SignIn
                          </button>

                          <div className="text-center mt-3 ">
                        <p className="text-btn" type="button" onClick={handleLoginMethod}>
                          {email?'login with mobile':'login with email'}
                        </p>
                      </div>
                 

                                    
                        </div>
                      </form>
                    </div>
                    <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2 ">
                      <img
                        src={logoimage}
                        className="img-fluid"
                        alt="Sample image"
                      />
                    </div>
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Login
