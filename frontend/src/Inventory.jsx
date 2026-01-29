import React, { useEffect, useState } from 'react'
import axios from 'axios'


const Inventory = () => {

    const [error,setError] = useState("");
    const [items,setItems]= useState([]);
    const [itemName,setItemName] = useState("");
    const [quantity,setQuantity] = useState("");

    useEffect(()=>{
        const fetchInventory=async()=>{
            const token = localStorage.getItem("token");
            if(!token){
                setError("Not logged in");
                return;
            }

            try{
                const response = await axios.get("http://localhost:5000/inventory",{
                    headers:{Authorization: `Bearer ${token}`}
                })

                setItems(response.data.items);
            }catch(err){
                setError("Failed to load inventory");
            }
        }

        fetchInventory();

    },[]);


    const addInventory = async(e) =>{
        e.preventDefault();
        const token = localStorage.getItem("token");
        try{
            await axios.post("http://localhost:5000/inventory",
                {name:itemName,quantity},
                {headers:{Authorization:`Bearer ${token}`},}
            );

            setItemName("");
            setQuantity("");

            const response = await axios.get("http://localhost:5000/inventory",
            {headers:{Authorization:`Bearer ${token}`}}
            )

            setItems(response.data.items);

        }catch(err){
            setError("could not add item");
        }
    }


    return (
    <>
        <h3>Inventory Page</h3>
        {error && <p style={{color:"red"}}>{error}</p>}
        
        <form action="" onSubmit={addInventory}>
            <label htmlFor="itemName">Item Name</label>
            <input 
                type="text" 
                name= "itemName"
                value= {itemName}
                onChange={(e)=> setItemName(e.target.value)}
                placeholder='Enter Item Name here'
            />

            <label htmlFor="quantity">Quantity</label>
            <input 
                type="text" 
                name= "quantity"
                value= {quantity}
                onChange={(e)=> setQuantity(e.target.value)}
                placeholder='Enter Quantity here'
            />

            <button type='submit'>Submit</button>
        </form> 

        <ul>
            {items.map(item =>(
                <li key={item.id}>
                    {item.name} -- {item.quantity}
                </li>
            ))}
        </ul>
    </>
    
  )
}

export default Inventory