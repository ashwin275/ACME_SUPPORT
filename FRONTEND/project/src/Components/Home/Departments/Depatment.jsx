import React, { useEffect, useState } from "react";
import axiosInstance from "../../Axios/AxiosToken";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./Dept.css";
function Depatment() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [ErrMsg, setErrMsg] = useState("");
  const [departments, setdepartments] = useState(null);
  const [ID, SetId] = useState(null);
  const [showmodel, setShowModel] = useState(false);
  const [showFormModel, setFormModel] = useState(false);
  const [AddDept, SetAddDept] = useState(false);
  const [Detail, SetDetail] = useState(null);
  const [modifiedData, setModifiedData] = useState({});
  const [UserDetail, setUserdetail] = useState({});
  const [UserModel, setUserModel] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get("department/list/");

      setdepartments(response.data.payload);
      console.log(response.data.payload);
    } catch (error) {
      if (error.response.status == 403) {
        setErrMsg(error.response.data.detail);
        setShow(true);
      }
    }
  };
  const handleclose = () => {
    setShowModel(false);
    setFormModel(false);
    setFormData({});
    SetDetail(null);
    setModifiedData({});
    SetAddDept(false);
    setUserModel(false);
    setUserdetail({});
  };
  const handelModalClose = () => {
    setShow(false);
    navigate("/home");
  };

  const handleDelete = (ItemID) => {
    SetId(ItemID);
    setShowModel(true);
  };

  const handelConfirmDelete = async () => {
    try {
      const response = await axiosInstance.delete(`department/delete/${ID}/`);
      console.log("Response", response);
      fetchData();
      setShowModel(false);
      SetId(null);
      toast.success(response.data.message);
    } catch (error) {
      if (error.response.status == 400) {
        toast.error(error.response.data.error);
        setShowModel(false);
      }
      console.log(error);
    }
  };

  const handleAddDepartment = () => {
    SetAddDept(true);
    setFormModel(true);
  };

  const handleEdit = async (ItemID) => {
    SetId(ItemID);
    try {
      const response = await axiosInstance.get(`department/detail/${ItemID}/`);

      SetDetail(response.data.payload);
      setFormData({
        name: Detail.name,
        description: Detail.description,
      });
      setFormModel(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleshowuserdetail = async (userId) => {
    try {
      const response = await axiosInstance.get(`users/detail/${userId}/`);

      setUserdetail(response.data.payload);
      setUserModel(true);
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

    if (AddDept) {
      try {
        const response = await axiosInstance.post(
          `department/create/`,
          modifiedData
        );
        console.log(response);
        fetchData();
        setFormModel(false);
        setFormData({});
        SetAddDept(false);
        setModifiedData({});
        toast.success(response.data.message);
      } catch (error) {
        console.log(error);

        if (error.response.status == 400) {
          toast.error(error.response.data.error);
          try {
            toast.error(`Name  :${error.response.data.name[0]}`);
            toast.error(`Decription :${error.response.data.description[0]}`);
          } catch {
            toast.error(`Decription :${error.response.data.description[0]}`);
            toast.error(`Name  :${error.response.data.name[0]}`);
          }
        }
      }
    } else {
      try {
        const response = await axiosInstance.patch(
          `department/update/${ID}/`,
          modifiedData
        );
        console.log(response);
        fetchData();
        setFormModel(false);
        setFormData({});
        SetDetail(null);
        setModifiedData({});
      } catch (error) {
        console.log(error);

        if (error.response.status == 400) {
          toast.error(error.response.data.error);
          try {
            toast.error(`Name  :${error.response.data.name[0]}`);
            toast.error(`Decription :${error.response.data.description[0]}`);
          } catch {
            toast.error(`Decription :${error.response.data.description[0]}`);
            toast.error(`Name  :${error.response.data.name[0]}`);
          }
        }
      }
    }
  };

  return (
    <>
      <div className="container-dpt mx-auto shadow-lg p-3 mb-5 bg-white rounded">
        <div className="wrapper-first mx-auto text-center p-2">
          <p className="text-head">DEPARTMENT(CRUD)</p>
        </div>
        <div
          className="wrapper-second ms-5 text-center shadow-lg"
          type="button"
          onClick={handleAddDepartment}
        >
          <p className="text-head-sub ">ADD DEPARTMENT</p>
        </div>

        <div className=" mx-auto wrapper-dpt p-5 mt-5 mb-5 bg-dark">
          {departments ? (
            <table className="table table-hover table-dark  ">
              <thead className="">
                <tr>
                  <th scope="col">No</th>
                  <th scope="col">Name</th>
                  <th scope="col">Description</th>
                  <th scope="col">Created On</th>
                  <th scope="col">Last Updated </th>
                  <th scope="col">Created By</th>
                  <th scope="col"></th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {departments.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.description}</td>
                    <td>{new Date(item.created_at).toLocaleString()}</td>
                    <td>{new Date(item.last_updated_at).toLocaleString()}</td>
                    <td>
                      <button
                        type="button"
                        className="btn  btn-outline-warning btn-size"
                        onClick={() => handleshowuserdetail(item.created_by)}
                      >
                        user detail
                      </button>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => handleEdit(item.id)}
                      >
                        Edit
                      </button>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <>
              <h1 className="h1-text"> No Departments </h1>
            </>
          )}
        </div>
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

      {/* warning modal */}

      <Modal
        show={showmodel}
        onHide={handleclose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Deleting this Department will remove it permanently. Proceed with
          deletion?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleclose}>
            Close
          </Button>
          <Button variant="outline-danger" onClick={handelConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      {/*  */}

      {/* form modal */}

      <Modal
        show={showFormModel}
        onHide={handleclose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title className="modal-title">
            {AddDept ? "ADD DEPARTMENT" : "EDIT DEPARTMENT"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={HandlSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="name"
                className="form-control"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Department Name"
                // required={AddDept}
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                name="description"
                className="form-control mt-3"
                id="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Description"
                // required={AddDept}
              />
            </div>

            <button type="submit" className="btn btn-outline-primary mt-5">
              {AddDept ? "ADD" : "UPDATE"}
            </button>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleclose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/*  */}

      {/* user detail modal */}

      <Modal
        show={UserModel}
        onHide={handleclose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div class="card">
            <div class="card-header card-title">User Detail</div>
            <ul class="list-group list-group-flush ">
              <li class="list-group-item">Name : {UserDetail.username}</li>
              <li class="list-group-item">Email : {UserDetail.email}</li>
              <li class="list-group-item">
                Mobile : {UserDetail.phone_number}
              </li>
              <li class="list-group-item">Role : {UserDetail.role}</li>
            </ul>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleclose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {/*  */}
    </>
  );
}

export default Depatment;
