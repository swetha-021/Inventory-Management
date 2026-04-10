import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { FaHome, FaCog } from "react-icons/fa";

const Navbar = () => {

    const navigate = useNavigate();
    const [open,setOpen] = useState(false);

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };
  return (
    <div className='navbar'>

        <div className="nav-left" onClick={()=>navigate("/home")}>
            <FaHome size={20}/>
        </div>
        <div className='navitem' onClick={()=>navigate("/inventory")}>
            <p>Inventory</p>
        </div>
        <div className='nav-right'>
            <FaCog size={20}  onClick={()=>setOpen(!open)}/>
            {open&&(
                <div className='dropdown'>
                    <p onClick={()=>navigate("/account")}>Account Settings</p>
                    <p onClick={()=>logout}style={{color:"red"}}>Logout</p>
                </div>
                
            )}
        </div>
    </div>
  )
}

export default Navbar