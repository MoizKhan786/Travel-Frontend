import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      const response = await axios.post("http://travel-backend.us-east-1.elasticbeanstalk.com/signup", {
        email,
        password,
      });

      const authToken = response.data.token;

      localStorage.setItem("token", authToken);

      navigate("/");
    } catch (error) {
      console.error("Signup failed", error);
      alert(error);
    }
  };

  return (
    <div className="flex bg-gradient-to-b from-blue-400 to-indigo-600 items-center justify-center h-screen">
      <div className="w-96 p-8 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-bold mb-6">Signup</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Email
          </label>
          <input
            type="email"
            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Password
          </label>
          <input
            type="password"
            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none"
          onClick={handleSignup}
        >
          Signup
        </button>
      </div>
    </div>
  );
};

export default Signup;
