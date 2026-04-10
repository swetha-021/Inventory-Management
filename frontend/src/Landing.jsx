// import React from 'react'

// const Landing = () => {

  

//   return (
//     <div>
//         <p>Hello World</p>
//         <p>Welcome to the landing page</p>
//     </div>
//   )
// }
// export default Landing
////////////////////////////////////////////////////////////////////////////////

import React from 'react'
import {useState,useEffect} from "react"
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Login from './Login'
import Navbar from './Navbar'


const Landing = () => {



  const navigate = useNavigate();

  const [status,setStatus] = useState("checking..")
  const [user,setUser] = useState(null)

  useEffect(()=>{
    const checkAuth = async() =>{
      const token = localStorage.getItem("token");
      console.log("TOKEN BEING SENT:", token);
      if(!token){
        navigate("/");
        return;
      }

      try{
        const response = await axios.get("http://localhost:5000/protected",{
          headers:{
            Authorization:`Bearer ${token}`
          },

        })

        setStatus(response.data.msg);
        setUser(response.data.user);

      }catch(error){
        navigate("/")
        return;
      }
    }

    checkAuth();

  },[])



  const handleSubmit = ()=>{
    localStorage.removeItem("token");
    navigate("/");
  }


  return (
    
    <div>

      <p>Hello World</p>
      <p>Welcome to the landing page</p>

      <h3>{status}</h3>

      {user && (
        <div>
          <p>User ID: {user.id}</p>
          <p>Email: {user.email}</p>
        </div>
      )}

      {/* <button onClick={handleSubmit}>Logout</button> */}
    </div>

  )
}

export default Landing