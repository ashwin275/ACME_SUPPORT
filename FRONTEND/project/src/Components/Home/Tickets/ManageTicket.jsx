import React, { useEffect, useState } from 'react'
import axiosInstance from '../../Axios/AxiosToken';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import Spinner from '../../Spinner/Spinner';
function ManageTicket() {
    const [show, setShow] = useState(false);
    const [msg, setMsg] = useState("");
    const[modalTitle,setModelTitle] = useState('')
    const [isLoading,setLoading] = useState(true)
    const[deleteModal,setDeleteModal] = useState(false)
    const[ID,SetID] = useState(null)
    const [tickets,setTickets] = useState(null)
   

    useEffect(()=>{
        fetchTickets();
    },[])

    const fetchTickets=async()=>{

        try{
            const response = await axiosInstance.get('/users/get-tickets/')
            console.log(response.data)
            if (response.status == 200){
                setTickets(response.data.payload)
                setLoading(false)
            }else if(response.status == 204){
                setTickets(null)
                setLoading(false)
                console.log(response.status)
                
            }
                
            
        }catch(error){

        }

    }

    const handleDelete=async()=>{

        try{
       const response = await axiosInstance.delete(`users/delete-ticket/${ID}/`)
       console.log(response)
       toast.success(response.data.message)
       setShow(false);
       fetchTickets()
        }catch(error){
            console.log(error.response.data.detail)
            if(error.response.status == 403){
              setModelTitle('Not An Admin')
              setMsg(error.response.data.detail)
              setShow(true)
            }
        }

    }

    const handleDeleteModel=(TicktID)=>{
        SetID(TicktID)
        setShow(true)
        setDeleteModal(true)
        setModelTitle('Confirm Delete')
        setMsg('Delete this ticket')
    }
    const handelModalClose = () => {
        setShow(false);
        SetID(null)
        setModelTitle('')
        setMsg('')
      
      };
  return (
    <div className='container-dpt mx-auto shadow-lg p-3 mb-5 bg-white rounded'>
        <div className="wrapper-first mx-auto text-center p-2">
             <p className="text-head">Manage Tickets</p>
      </div>


      <div className=" mx-auto wrapper-dpt p-5 mt-5 mb-5 bg-dark">
          {tickets ? (
            <table className="table table-hover table-dark  ">
              <thead className="">
                <tr>
                  
                  <th scope="col">Ticket ID</th>
                  <th scope="col">Subject</th>
                  
                  <th scope="col">Priority</th>
                  <th scope="col">Created at</th>
                  <th scope="col">Delete</th>
                
                </tr>
              </thead>
              <tbody>
                {tickets.map((item) => (
                  <tr key={item.id}>
                   
                    <td>{item.id}</td>
                    <td>{item.subject}</td>
                    
                    <td>{item.priority}</td>
                    <td>{item.created_at}</td>
                    <td>
                    <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => handleDeleteModel(item.id)}
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
            <div className='mx-auto'>
            {isLoading?(<Spinner/>):(<> <h1 className="h1-text text-white"> You dont have any tickets</h1></>)
                
          }

            </div>
           
     
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
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{msg}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handelModalClose}>
            Close
          </Button>

          {deleteModal&&<Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>}
        </Modal.Footer>
      </Modal>

      {/*  */}
    </div>
  )
}

export default ManageTicket
