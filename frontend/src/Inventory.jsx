import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  // add item form
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");

  // edit mode state
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editQuantity, setEditQuantity] = useState("");

  // ---------------- FETCH INVENTORY ----------------
  useEffect(() => {
    const fetchInventory = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Not logged in");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/inventory", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setItems(response.data.items);
      } catch {
        setError("Failed to load inventory");
      }
    };

    fetchInventory();
  }, []);

  // ---------------- ADD ITEM ----------------
  const addInventory = async (e) => {
    e.preventDefault();
    setError("");

    if (!itemName || quantity === "") {
      setError("Name and quantity required");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "http://localhost:5000/inventory",
        { name: itemName, quantity: Number(quantity) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setItems([...items, response.data.item]);
      setItemName("");
      setQuantity("");
    } catch {
      setError("Could not add item");
    }
  };

  // ---------------- DELETE ITEM ----------------
  const deleteItem = async (itemId) => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(`http://localhost:5000/inventory/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setItems(items.filter((item) => item.id !== itemId));
    } catch {
      setError("Unable to delete item");
    }
  };

  // ---------------- EDIT MODE ----------------
  const startEdit = (item) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditQuantity(item.quantity);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditQuantity("");
  };

  // ---------------- UPDATE ITEM ----------------
  const updateItem = async (itemId) => {
    const token = localStorage.getItem("token");

    if (!editName || editQuantity === "" || isNaN(editQuantity)) {
      setError("Invalid input");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/inventory/${itemId}`,
        { name: editName, quantity: Number(editQuantity) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setItems(
        items.map((item) =>
          item.id === itemId
            ? { ...item, name: editName, quantity: Number(editQuantity) }
            : item
        )
      );

      cancelEdit();
    } catch {
      setError("Failed to update item");
    }
  };

  //---------------Logout---------------

  const navigate = useNavigate();
  const logout = ()=>{
    localStorage.removeItem("token");
    navigate("/");
  }

  // ---------------- UI ----------------
  // return (
  //   <>
  //     <h3>Inventory Page</h3>
  //     {error && <p style={{ color: "red" }}>{error}</p>}

  //     {/* ADD ITEM FORM */}
  //     <form onSubmit={addInventory}>
  //       <input
  //         type="text"
  //         placeholder="Item name"
  //         value={itemName}
  //         onChange={(e) => setItemName(e.target.value)}
  //       />

  //       <input
  //         type="number"
  //         placeholder="Quantity"
  //         value={quantity}
  //         onChange={(e) => setQuantity(e.target.value)}
  //       />

  //       <button type="submit">Add</button>
  //     </form>

  //     {/* INVENTORY LIST */}
  //     <ul>
  //       {items.map((item) => (
  //         <li key={item.id}>
  //           {editingId === item.id ? (
  //             <>
  //               <input
  //                 type="text"
  //                 value={editName}
  //                 onChange={(e) => setEditName(e.target.value)}
  //               />

  //               <input
  //                 type="number"
  //                 value={editQuantity}
  //                 onChange={(e) => setEditQuantity(e.target.value)}
  //                 style={{ width: "60px", marginLeft: "8px" }}
  //               />

  //               <button onClick={() => updateItem(item.id)}>Update</button>
  //               <button onClick={cancelEdit}>Cancel</button>
  //             </>
  //           ) : (
  //             <>
  //               {item.name} — {item.quantity}
  //               <button onClick={() => startEdit(item)}>Edit</button>
  //               <button onClick={() => deleteItem(item.id)}>Delete</button>
  //             </>
  //           )}
  //         </li>
  //       ))}
  //     </ul>
  //     <button onClick={logout}>Logout</button>
  //   </>
  // );
  return (
  <div className="inventory-page">
    <div className="inventory-card">
      <h2>Inventory Page</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={addInventory} className="inventory-form">
        <input
          type="text"
          placeholder="Item name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <button type="submit">Add</button>
      </form>

      <ul className="inventory-list">
        {items.map((item) => (
          <li key={item.id} className="inventory-item">
            {editingId === item.id ? (
              <>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />

                <input
                  type="number"
                  value={editQuantity}
                  onChange={(e) => setEditQuantity(e.target.value)}
                />

                <div className="item-buttons">
                  <button onClick={() => updateItem(item.id)}>Update</button>
                  <button onClick={cancelEdit}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <span>
                  {item.name} - {item.quantity}
                </span>

                <div className="item-buttons">
                  <button onClick={() => startEdit(item)}>Edit</button>
                  <button onClick={() => deleteItem(item.id)}>Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
{/* 
      <button onClick={logout} className="logout-btn">
        Logout
      </button> */}
    </div>
  </div>
);
};

export default Inventory;
