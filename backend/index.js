// const express = require("express");
// const cors = require("cors");


// const app = express();

// app.use(cors());
// app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("Backend is running");
// });

// app.post("/login", (req, res) => {
//   const { email, password } = req.body;

//   console.log("Email:", email);
//   console.log("Password:", password);

//   res.json({
//     message: "Login successful (dummy)",
//   });
// });

// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


///////////////////////////////////////////////////////////


const cors = require("cors");
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const pool = require("./db");


const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;
const JWT_SECRET = "jwt_secret_key"

// const user = {
//     id:1,
//     email:"sprakash@gmail.com",
//     password:bcrypt.hashSync("Swetha",10)
// }

//test db + backend connection

app.get("/db-test",async(req,res)=>{
    try{
        const result = await pool.query("SELECT NOW()");
        res.json({"time":result.rows[0]});
    }catch(err){
        console.log(err);
        res.status(401).json({msg:"error connecting database"});
    }
    
})




app.get("/",(req,res)=>{
    res.send("backend is running");  
});

app.post("/login",async(req,res)=>{
    const {email,password} = req.body;
    // if(email != user.email){
    //     return res.status(401).json({"message":"invalid username"})
    // }


    try{
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );
        if(result.rows.length===0){
            return res.status(401).json({ message: "invalid username" });
        }
   
        const user = result.rows[0];

        const isMatch =await bcrypt.compare(password,user.password_hash);
        
        if(!isMatch){
            return res.status(401).json({"message":"invalid password"});
        }

        const token = jwt.sign(
            {id:user.id,email:user.email},
            JWT_SECRET,
            {expiresIn:"1h"},
        )

        res.json({
            "msg":"logged in successfully",
            "token":token,
        })

    }catch (err) {
        console.error(err);
        res.status(500).json({ message: "server error" });
    }


});

app.get("/protected", async(req,res)=>{
    
    console.log("✅ /protected route HIT");
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({"message":"invalid token"})
    }

    const token = authHeader.split(" ")[1];
    console.log("TOKEN RECEIVED:", token);

    try{
        const decode = jwt.verify(token,JWT_SECRET);
        res.json({msg:"authorised login",user: decode})
    }catch(error){
        return res.status(401).json({"message":"invalid token"})
    }

})

app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`);
})