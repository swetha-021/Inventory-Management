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


import { useEffect, useState } from "react";
import axios from "axios";

const Landing = () => {
  const [status, setStatus] = useState("Checking...");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setStatus("No token found. Not logged in ❌");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/protected", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setStatus(response.data.msg);
        setUser(response.data.user);
      } catch (error) {
        setStatus("Token invalid / expired ❌");
      }
    };

    checkAuth();
  }, []);

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
    </div>
  );
};

export default Landing;
