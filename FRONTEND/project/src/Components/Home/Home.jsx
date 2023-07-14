import React from "react";
import "./Home.css";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
function Home() {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const handledepartment = () => {
    navigate("/home/departments");
  };

  const handleUsers = () => {
    navigate("/home/users-list");
  };

  const handleCreateTicket = () => {
    navigate("/home/create-tickets");
  };

  const handleManageTicket=()=>{
    navigate("/home/manage-tickets")
  }
  return (
    <div className="container">
      <div>
        <div class="card">
          <div class="card-header card-title">Profile</div>
          <ul class="list-group list-group-flush ">
            <li class="list-group-item">Name : {userInfo.username}</li>
            <li class="list-group-item">Email : {userInfo.email}</li>
            <li class="list-group-item">Mobile : {userInfo.phone_number}</li>
            <li class="list-group-item">Role : {userInfo.role}</li>
          </ul>
        </div>
      </div>
      <div className="home-wrapper mx-auto shadow-lg p-3 mb-5 bg-white rounded">
        <div className="home-inner-wrapper">
          <div className="card cards-home  mx-auto">
            <div className="card-body">
              <h5 className="card-title">DEPARTMENT (CRUD)</h5>
              <p className="card-text">Only for Admins.</p>
              <button
                type="button"
                className="btn  btn-outline-warning button"
                onClick={handledepartment}
              >
                Departments
              </button>
            </div>
          </div>
          <div className="card-wrapper">
            <div className="card w-100 mx-auto mt-4">
              <div className="card-body">
                <h5 className="card-title"> USERS (C)</h5>
                <p className="card-text">Only for Admins.</p>
                <button
                  type="button"
                  className="btn btn-outline-warning button"
                  onClick={handleUsers}
                >
                  Users
                </button>
              </div>
            </div>
          </div>
          <div className="card w-100 mx-auto mt-4">
            <div className="card-body">
              <h5 className="card-title"> CREATE TICKET</h5>
              <p className="card-text">Admins and Users</p>
              <button
                type="button"
                className="btn btn-outline-warning button"
                onClick={handleCreateTicket}
              >
                Create Ticket
              </button>
            </div>
          </div>
          <div className="card w-100 mx-auto mt-4">
            <div className="card-body">
              <h5 className="card-title"> MANAGE TICKET</h5>
              <p className="card-text">Admins : Get all the tickets</p>
              <p className="card-text">Users : Get users tickets only</p>
              <p className="card-text">Delete : only admin can delete the tickets</p>
              <button
                type="button"
                className="btn btn-outline-warning button"
                onClick={handleManageTicket}
              >
                Manage Ticket
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
