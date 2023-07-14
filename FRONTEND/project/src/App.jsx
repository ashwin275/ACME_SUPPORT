import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./Components/Login/Login";
import Navbar from "./Components/Navbar/Navbar";
import { Routes, Route } from "react-router-dom";

import LandingPage from "./Components/LandingPage/LandingPage";
import Authrequire from "./Components/PrivateRoutes/Authrequire";

import UnAuth from "./Components/PrivateRoutes/UnAuth";
import Home from "./Components/Home/Home";
import Depatment from "./Components/Home/Departments/Depatment";
import AddUsers from "./Components/Home/UsersCreate/AddUsers";
import UserList from "./Components/Home/UsersCreate/UserList";
import CreateTicket from "./Components/Home/Tickets/CreateTicket";
import ManageTicket from "./Components/Home/Tickets/ManageTicket";

function App() {
  return (
    <>
      <ToastContainer />

      <Navbar />

      <Routes>
        <Route path="/" exact element={<LandingPage />} />
        <Route element={<UnAuth />}>
          <Route path="/login" element={<Login />} />
        </Route>

        <Route path="/home/*">
          <Route element={<Authrequire />}>
            <Route path="" element={<Home />} />
            <Route path="departments" element={<Depatment/>}/>
            <Route path="users-create" element={<AddUsers/>}/>
            <Route path="users-list" element={<UserList/>}/>
            <Route path="create-tickets" element={<CreateTicket/>}/>
            <Route path="manage-tickets" element={<ManageTicket/>}/>
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
