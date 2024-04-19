import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState(null);
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://x22201785-env.eba-dzzw5zpu.us-east-1.elasticbeanstalk.com/captcha/random"
        );
        setCaptcha(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const newCaptcha = async () => {
    try {
      const response = await axios.get(
        "http://x22201785-env.eba-dzzw5zpu.us-east-1.elasticbeanstalk.com/captcha/random"
      );
      setCaptcha(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const postData = async () => {
    try {
      const captchaId = captcha.id;
      const userInputKey = answer;

      const dataToSend = {
        user_input_key: userInputKey,
      };

      const url = `http://x22201785-env.eba-dzzw5zpu.us-east-1.elasticbeanstalk.com/captcha/${captchaId}/verify`;

      const response = await axios.post(url, dataToSend);

      console.log("Response:", response.data);

      return response.data;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const handleLogin = async () => {
    try {
      // postData()
      //   .then((responseData) => {
      //     console.log(responseData);
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //   });

      if (captcha.key_content !== answer) {
        alert("Invalid Captcha");
      } else {
        const response = await axios.post("http://travel-backend.us-east-1.elasticbeanstalk.com/login", {
          email,
          password,
        });

        const authToken = response.data.token;

        localStorage.setItem("token", authToken);

        navigate("/");
        window.location.reload();
      }
    } catch (error) {
      console.error("Login failed", error);
      alert(error);
    }
  };

  const handleInputChange = (event) => {
    setAnswer(event.target.value);
  };

  return (
    <div className="flex bg-gradient-to-b from-blue-400 to-indigo-600 items-center justify-center h-screen">
      <div className="w-96 p-8 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
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

        {/* Captcha */}

        {captcha && (
          <div>
            <h1>Solve the captcha</h1>
            <img src={captcha.image_url} />
            <input
              type="text"
              value={answer}
              onChange={handleInputChange}
              className="border-2"
            />
            <span
              className="text-sm text-blue-400 ml-5 cursor-pointer"
              onClick={() => newCaptcha()}
            >
              RELOAD
            </span>
          </div>
        )}
        <button
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none"
          onClick={handleLogin}
        >
          Login
        </button>
        <h1
          className=" text-blue-500 cursor-pointer"
          onClick={() => {
            navigate("/signup");
          }}
        >
          New User? Signup
        </h1>
        {console.log(captcha)}
      </div>
    </div>
  );
};

export default Login;
