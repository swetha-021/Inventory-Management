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

import dotenv from "dotenv";
dotenv.config();

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

//middleware to verify identity

const authenticateToken = (req,res,next) =>{
    const authHeader =  req.headers.authorization;
    if(!authHeader){
        return res.status(401).json({msg:"token not found"});
    }
    const token = authHeader.split(" ")[1];
    try{
        const decode = jwt.verify(token,JWT_SECRET);
        req.user = decode;
        next();
    }catch(err){
        return res.status(401).json({msg:"invalid token"});
    }
}

app.post("/inventory",authenticateToken,async (req,res)=>{
    const {name,quantity} = req.body;
    const userId = req.user.id;

    if (!name || quantity === undefined) {
        return res.status(400).json({ message: "Name and quantity required" });
    }
    try{
        const result = await pool.query(
            `INSERT INTO inventory_items (user_id,name,quantity)
            values ($1, $2, $3)
            RETURNING id, name, quantity`,
            [userId,name,quantity]
        )

        res.status(201).json({message: "Item added",item: result.rows[0],});
    }catch(err){
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
})

app.get("/inventory",authenticateToken, async(req,res)=>{
    const id = req.user.id;
        try{
            const result = await pool.query(
                `SELECT  id, name, quantity, created_at
                 from inventory_items WHERE user_id = $1
                 ORDER BY created_at DESC`,
                [id]
            );
            res.status(200).json({msg:"items listed", items:result.rows})
        
    }catch(err){
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
})

app.delete("/inventory/:id", authenticateToken, async(req,res)=>{
    
    const userId = req.user.id;
    const itemId = req.params.id;


    try{
        const result = await pool.query(
            "DELETE FROM inventory_items WHERE id = $1 and user_id = $2 returning id ",
            [itemId, userId]
        );

        if (result.rows === 0){
            return res.status(404).json({msg:"item couldnt be found"});
        } 

        return res.json({msg:"item deleted successfully"});

    }catch(error){
        return res.status(500).json({msg:"Could not be deleted"})
    }
})


app.put("/inventory/:id", authenticateToken, async (req, res) => {
  const userId = req.user.id;       // WHO
  const itemId = req.params.id;     // WHICH ITEM
  const { name, quantity } = req.body; // WHAT TO UPDATE

  // validation
  if (!name || quantity === "" || isNaN(quantity)) {
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    const result = await pool.query(
      `UPDATE inventory_items
       SET name = $1, quantity = $2
       WHERE id = $3 AND user_id = $4
       RETURNING id, name, quantity`,
      [name, Number(quantity), itemId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Item not found or not authorized",
      });
    }

    res.json({
      message: "Item updated",
      item: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not update item" });
  }
});




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

app.post("/signup",async(req,res)=>{
    const{email,password} = req.body;

    try{
        const EmailExist = await pool.query(
            "SELECT id from users WHERE email = $1",
            [email],
        );

        if(EmailExist.rows.length>0){
            return res.status(409).json({"msg":"Email already exists -> log in"});
        }

        const password_hash = bcrypt.hashSync(password,10);
        
        const result = await pool.query(
            "INSERT INTO users (email, password_hash) VALUES ($1, $2) returning id, email",
            [email, password_hash]
        )

        res.status(201).json({
            "msg":"signup successfull",
            user: result.rows[0],
        })


    }catch(err){
        res.status(500).json({"msg":"server error"})
    }
    




})

app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`);
})