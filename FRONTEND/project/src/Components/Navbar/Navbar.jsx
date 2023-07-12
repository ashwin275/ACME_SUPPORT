import React from 'react'
import './Navbar.css'
function Navbar() {
  return (
    <div>
      <nav className="navbar navbar-expand-lg shadow p-3 mb-5">
  <div className="container-fluid">
  <a className="navbar-brand ms-5" href="#">
    <img src="/src/images/logo.png" width="100" height="30" alt=""/>
  </a>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse " id="navbarNav">
      <ul className="navbar-nav ms-auto">
        <li className="nav-item">
          <a className="nav-link active" aria-current="page" href="#">Home</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">Features</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">Pricing</a>
        </li>
        <li className="nav-item">
          <a className="nav-link disabled" href="#" tabIndex="-1" aria-disabled="true">Disabled</a>
        </li>
      </ul>
    </div>
  </div>
</nav>
    </div>
  )
}

export default Navbar
