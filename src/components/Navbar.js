import {React,useEffect} from 'react'
import { Link, useLocation } from 'react-router-dom'


function Navbar() {
    let location =useLocation();
    useEffect(()=>{
    //    console.log(location) ;
       console.log(location.pathname) ;
    },[location]);

  return (
   

    <nav className=" navbar navbar-expand-lg navbar-dark bg-dark">
        <Link className="navbar-brand" to="/">iNotebook</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="/navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className={`nav-item ${location.pathname==="/" ? "active":""}`}>
              <Link className="nav-link" to="/">Home <span className="sr-only">(current)</span></Link>
            </li>
            <li className="active">
              <a className="nav-link" href="/about">About</a>
            </li>
            
           
          </ul>
          
        </div>
      </nav>
      
  )
}

export default Navbar
