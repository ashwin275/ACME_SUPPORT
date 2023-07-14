import React from 'react'
import { PacmanLoader } from 'react-spinners';


function Spinner() {
  return (
    <div className='mx-auto'>
         <div className="spinner-container">
      <PacmanLoader color="#fff" size={60} />
    </div>
      
    </div>
  )
}

export default Spinner
