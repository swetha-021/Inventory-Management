import {useState} from 'react'
import axios from 'axios'
import {useNavigate} from "react-router-dom"

const Login = () => {

    const navigate = useNavigate();

    const [email,setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async(e) =>{
        e.preventDefault();
        setError("");

        try{
            const response = await axios.post(
                "http://localhost:5000/login",
                {
                    email: email,
                    password: password,
                }
            )
    
            console.log(response.data);
            localStorage.setItem("token", response.data.token);
            navigate("/home")
            
        }catch(error){
            console.error("Login error:", error);
            const msg = error.response?.data?.message || "Login failed. Try again.";
            setError(msg);
        }
    }


  return (
    <>
    <h3>LOGIN PAGE</h3>
    <form onSubmit={handleSubmit} action="">
        <label htmlFor="email"> email:</label>
        <input 
            type="email" 
            value={email}
            name='email'
            placeholder='Enter Email here'
            onChange={(e)=>setEmail(e.target.value)}
        />
        <br />

        <label htmlFor="pass"> password:</label>
        <input 
            type="password" 
            value={password}
            name='pass'
            placeholder='Enter your password'
            onChange={(e)=>setPassword(e.target.value)}
        />
        <br />

        {error && <p style={{ color: "red" }}>{error}</p>}


        <button type='submit' >Submit</button>
    </form>
    </>
  )
}

export default Login