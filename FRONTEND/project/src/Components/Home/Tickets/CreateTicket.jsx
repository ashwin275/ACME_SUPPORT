
import React, {useState}from "react";
import "../UsersCreate/user.css";
import { useSelector } from "react-redux";
import axiosInstance from "../../Axios/AxiosToken";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
function CreateTicket() {
  const {userInfo} = useSelector((state)=>state.auth)
  // console.log(userInfo)
  // const subdomain = import.meta.env.VITE_SUBDOMAIN;
  // const apiToken = import.meta.env.VITE_API_TOKEN;
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    subject: "",
    body: "",
    priority: "",
    name: userInfo.username,
    email: userInfo.email?userInfo.email:"",
    phone_number: userInfo.phone_number ? userInfo.phone_number : "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevState) => ({ ...prevState, [name]: value }));
    console.log("modified", formData);
  };

  const HandlSubmit = async(event)=>{
    event.preventDefault();
     try{
        const response = await axiosInstance.post('users/create-ticket/',formData)
        
        console.log(response)
        toast.success(response.data.message)
        navigate('/home')
     }catch(error){
      console.log(error)
      toast.error(error.response.data.error)
     }
  }
  return (
    <div className="container-user mx-auto  shadow-lg p-5 mb-5 bg-white rounded">
      <div className=" container-inner-first mx-auto text-center  mb-4">
        <p className="text-title-user">CREATE TICKET</p>
      </div>

      <div className="container-inner mx-auto">
        <form onSubmit={HandlSubmit}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              id="subject"
              aria-describedby="emailHelp"
              placeholder="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-5 mt-5">
            <input
              type="text"
              className="form-control"
              id="body"
              placeholder="Description"
              name="body"
              value={formData.body}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-5 mt-5">
            <input
              type="text"
              className="form-control"
              id="priority"
              placeholder="Priority"
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
            />
          </div>

          <p className="mt-5 labels">*Contact Details</p>

          <div className="mb-3 mt-2">
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              id="phone_number"
              placeholder="phone number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
       
      </div>
    </div>
  );
}

export default CreateTicket;
