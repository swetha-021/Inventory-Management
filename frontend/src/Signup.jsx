import React, { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import axios from 'axios';
import Login from './Login';

const Signup = () => {

    const [email,setEmail] = useState("");
    const [password,setPassword]= useState("");
    const [error,setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async(e) =>{
        e.preventDefault();
        try{
            const response = await axios.post("http://localhost:5000/signup",{
                email,
                password
            });

            console.log("signup successfull", response.data);
            
            navigate("/");

        }catch(err){
            console.log("error signing up");
            const msg = err.response?.data?.message || "Signup failed. Try again";
            setError(msg);
        }
        


    }

  return (
    <>
    <div className="page">
    <div className="login-card">
        <h3>SIGNUP PAGE</h3>
        <form onSubmit={handleSubmit} action="">
            <label htmlFor="email">Email:</label>
            <input 
                type="email" 
                name="email" 
                value ={email}
                placeholder='Enter email here'
                onChange={(e)=>setEmail(e.target.value)}
            />
            <br/>
            <label htmlFor="pass">Password:</label>
            <input 
                type="password" 
                name="pass" 
                value ={password}
                placeholder='Enter Password here'
                onChange={(e)=>setPassword(e.target.value)}
            />
            <br/>

            {error && <p style={{color:"red"}}> {error} </p>}
            

            <button type='submit'> Signup</button>
            <p>Already have an account? <Link to="/">Login</Link></p>
        </form>

    </div>
    </div>
    </>
  )
}

export default Signup