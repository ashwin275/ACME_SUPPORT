import React, { useEffect, useState } from "react";
import "./user.css";
import axiosInstance from "../../Axios/AxiosToken";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
function AddUsers() {
const navigate = useNavigate()
  const [dept, setdpt] = useState([]);
  const [emailregister, setemailregister] = useState(true);
  const [modifiedData, setModifiedData] = useState({});
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone_number: "",
    role: "",
  });

  useEffect(() => {
    fetchDeptNames();
  }, []);

  const fetchDeptNames = async () => {
    try {
      const response = await axiosInstance.get("department/get-names/");
      setdpt(response.data.payload);
      console.log(response.data.payload);
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setModifiedData((prevState) => ({ ...prevState, [name]: value }));
    setFormData((prevState) => ({ ...prevState, [name]: value }));
    console.log("modified", modifiedData);
  };

  const HandlSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axiosInstance.post(
        "users/register/",
        modifiedData
      );
      console.log(response);
      setModifiedData({});
      setFormData({
        username: "",
        email: "",
        password: "",
        phone_number: "",
        role: "",
      });
      toast.success(response.data.message);
      navigate('/home/users-list')
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.error);
    }
  };
  return (
    <div className="container-user mx-auto  shadow-lg p-5 mb-5 bg-white rounded">
        <div className=" container-inner-first mx-auto text-center  mb-4">
            <p className="text-title-user">ADD USER</p>
        </div>
      <div className="container-inner mx-auto">
        <form onSubmit={HandlSubmit}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              id="username"
              aria-describedby="emailHelp"
              placeholder="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
            />
          </div>

          {
            emailregister?(<> <div className="mb-3">
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div></>):(<>   <div className="mb-3">
            <input
              type="text"
              className="form-control"
              id="phone_number"
              placeholder="Phone number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
            />
          </div></>)
          }

         

       

          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-3">
           
            <select
              className="form-select"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
            >
                <option>Select Department</option>
              {dept.map((item) => (
                <option value={item} key={item}>
                  {item.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
          
            <select
              className="form-select"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
            >
             <option>Choose Role</option>
              <option value="user">USER</option>
              <option value="admin">ADMIN</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
        <div className="container-end text-center mx-auto mt-4">
            <p className="end-text" type="button" onClick={()=>setemailregister(!emailregister)}>{emailregister?"Register with mobile":"Register with email"} </p>
        </div>
      </div>
    </div>
  );
}

export default AddUsers;
