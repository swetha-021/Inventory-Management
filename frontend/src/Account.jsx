import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { FaUserCircle,FaCamera  } from "react-icons/fa";

const Account = () => {

  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {

      const token = localStorage.getItem("token");

      if (!token) return;

      try {
        const response = await axios.get(
          "http://localhost:5000/protected",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUser(response.data.user);

      } catch (err) {
        console.error("Failed to load user info");
      }
    };

    fetchUser();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  return (
    <>

      <div className="page">
        <div className="container account">

          <h2>Account Settings</h2>

          <div className="profile-section">

            <div className="pfp">

                <label htmlFor="profileUpload" className="pfp-wrapper">

                    {image ? (
                    <img
                        src={image}
                        alt="profile"
                        className="profile-img"
                    />
                    ) : (
                    <FaUserCircle
                        size={120}
                        color="#D1EEFE"
                        className="profile-icon"
                    />
                    )}

                    <div className="pfp-overlay">
                    <FaCamera size={20} />
                    </div>

                </label>

                <input
                    id="profileUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    hidden
                />

                </div>

            {user && (
              <div className="user-info">
                <p><strong>User ID:</strong> {user.id}</p>
                <p><strong>Email:</strong> {user.email}</p>
              </div>
            )}

          </div>

        </div>
      </div>
    </>
  );
};

export default Account;