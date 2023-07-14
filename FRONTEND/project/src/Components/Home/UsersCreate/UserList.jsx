import React, { useEffect, useState } from "react";
import axiosInstance from "../../Axios/AxiosToken";
import "../Departments/Dept.css";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function UserList() {
  const [users, setusers] = useState(null);
  const navigate = useNavigate()
  const [show, setShow] = useState(false);
  const [ErrMsg, setErrMsg] = useState("");
  useEffect(() => {
    fetchUserList();
  }, []);

  const fetchUserList = async () => {
    try {
      const response = await axiosInstance.get("users/list/");
      console.log(response.data.payload);
      setusers(response.data.payload);
    } catch (error) {
        if (error.response.status == 403) {
            setErrMsg(error.response.data.detail);
            setShow(true);
          }
    }
  };

  const handlecreateuser=()=>{
      navigate('/home/users-create')
  }

  const handelModalClose = () => {
    setShow(false);
    navigate("/home");
  };
  return (
    <div className="container-dpt mx-auto shadow-lg p-3 mb-5 bg-white rounded">
      <div className="wrapper-first mx-auto text-center p-2">
        <p className="text-head">USERS</p>
      </div>

      <div
        className="wrapper-second ms-5 text-center shadow-lg"
        type="button"
        onClick={handlecreateuser}
      >
        <p className="text-head-sub ">CREATE USER</p>
      </div>

      <div className=" mx-auto wrapper-dpt p-5 mt-5 mb-5 bg-dark">
          {users ? (
            <table className="table table-hover table-dark  ">
              <thead className="">
                <tr>
                  <th scope="col">No</th>
                  <th scope="col">Username</th>
                  <th scope="col">email</th>
                  <th scope="col">Phone no</th>
                  <th scope="col">Role</th>
                
                </tr>
              </thead>
              <tbody>
                {users.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.username}</td>
                    <td>{item.email}</td>
                    <td>{item.phone_number}</td>
                    <td>{item.role}</td>

                  
                   
                   
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <>
              <h1 className="h1-text"> No Users</h1>
            </>
          )}
        </div>

          {/* modal unautherised */}

      <Modal
        show={show}
        onHide={handelModalClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Not an admin</Modal.Title>
        </Modal.Header>
        <Modal.Body>{ErrMsg}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handelModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/*  */}
    </div>
  );
}

export default UserList;
