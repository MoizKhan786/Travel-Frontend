import axios from "axios";
import CurrencyConverter from "./CurrencyConverter";
import { useEffect, useState } from "react";
import Login from "../pages/Login";
import { useNavigate } from "react-router-dom";

const TourApp = () => {
  const [tours, setTours] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [city, setCity] = useState("");
  const [aqi, setAqi] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    image: "",
    price: "",
  });
  const [updatedForm, setUpdatedForm] = useState({
    _id: null,
    title: "",
    description: "",
    image: "",
    price: "",
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authToken = localStorage.getItem("token");

        if (!authToken) {
          setAuthenticated(false);
          return;
        }
        const response = await axios.get("http://travel-backend.us-east-1.elasticbeanstalk.com/check-auth", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setAuthenticated(response.data === "OK");
      } catch (error) {
        console.error("Authentication check failed", error);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetchTours();
    }
  }, [authenticated]);

  const searchAQI = async () => {
    try {
      axios
        .get("https://api.api-ninjas.com/v1/airquality?city=" + city, {
          headers: {
            "X-Api-Key": "b87rKAy0eI10HRylQ3S0sg==8sb1TKQ7YbWRh6eq",
          },
        })
        .then((response) => {
          console.log(response.data);
          setAqi(response.data);
        })
        .catch((error) => {
          if (error.response) {
            console.error("Error:", error.response.status, error.response.data);
          } else {
            console.error("Request failed:", error.message);
          }
        });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchTours = async () => {
    const res = await axios.get("http://travel-backend.us-east-1.elasticbeanstalk.com/tours");
    setTours(res.data);
  };
  const updateForm = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const createTour = async (e) => {
    e.preventDefault();
    const res = await axios.post("http://travel-backend.us-east-1.elasticbeanstalk.com/tour", form);
    setForm({
      title: "",
      description: "",
      image: "",
      price: "",
    });
    setTours([...tours, res.data.tour]);
  };

  const deleteTour = async (_id) => {
    const res = await axios.delete(`http://travel-backend.us-east-1.elasticbeanstalk.com/tour/${_id}`);
    console.log(res);
    const newTours = [...tours].filter((tour) => tour._id !== _id);

    setTours(newTours);
  };

  const updateTour = (e) => {
    const { value, name } = e.target;
    setUpdatedForm({
      ...updatedForm,
      [name]: value,
    });
  };

  const handleUpdateTour = async (e) => {
    e.preventDefault();
    const res = await axios.put(
      `http://travel-backend.us-east-1.elasticbeanstalk.com/tour/${updatedForm._id}`,
      updatedForm
    );
    const newTour = [...tours];
    const tourIndex = tours.findIndex((tour) => tour._id === updatedForm._id);
    newTour[tourIndex] = res.data;

    setTours(newTour);

    setUpdatedForm({
      _id: null,
      title: "",
      description: "",
      price: "",
    });
  };

  const toggleUpdate = (tour) => {
    setUpdatedForm({
      _id: tour._id,
      title: tour.title,
      description: tour.description,
      price: tour.price,
    });
    console.log(updatedForm);
  };
  const handleInputChange = (event) => {
    setCity(event.target.value);
  };
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  return authenticated ? (
    <div className="bg-gradient-to-b from-blue-400 to-indigo-600 min-h-screen">
      <div className="container mx-auto p-8">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-semibold text-white">
              Tours Junction
            </h1>
            <input
              type="text"
              value={city}
              onChange={handleInputChange}
              className="border-2"
            />
            <button
              onClick={() => {
                searchAQI();
              }}
              className="text-white bg-red-600 p-3 rounded-lg"
            >
              Get AQI
            </button>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded mt-2"
            >
              Logout
            </button>
          </div>

          {aqi && (
            <div className="text-white flex justify-between">
              <h1>
                {" "}
                CO concentration: <span>{aqi.CO.concentration}</span>
              </h1>
              <h1>
                {" "}
                NO2 concentration: <span>{aqi.NO2.concentration}</span>
              </h1>
              <h1>
                {" "}
                Overall AQI: <span>{aqi.overall_aqi}</span>
              </h1>
            </div>
          )}

          {tours && (
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
              {tours.map((tour) => (
                <div
                  key={tour._id}
                  className="p-4 border border-gray-300 rounded bg-white shadow-md"
                >
                  {tour.image && (
                    <img
                      src={tour.image}
                      alt={tour.title}
                      className="w-full h-40 object-cover mb-4 rounded"
                    />
                  )}
                  <h1 className="text-xl font-semibold mb-2">{tour.title}</h1>
                  <p className="text-gray-700 mb-2">{tour.description}</p>
                  <p className="text-blue-500 font-bold">{tour.price}€</p>
                  <div className="flex mt-4 space-x-2">
                    <button
                      onClick={() => deleteTour(tour._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Delete Tour
                    </button>
                    <button
                      onClick={() => toggleUpdate(tour)}
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      Update Tour
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {!updatedForm._id && (
          <div className="mb-4 p-4 border border-gray-300 rounded bg-white shadow-md">
            <h1 className="text-3xl font-semibold mb-4">
              Create a Tour Package
            </h1>
            <form onSubmit={createTour} className="space-y-4">
              <input
                onChange={updateForm}
                value={form.title}
                name="title"
                placeholder="Title"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <textarea
                onChange={updateForm}
                name="description"
                value={form.description}
                placeholder="Description"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                type="number"
                onChange={updateForm}
                value={form.price}
                name="price"
                placeholder="Price"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                onChange={updateForm}
                value={form.image}
                name="image"
                placeholder="Image URL"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Create a Tour
              </button>
            </form>
          </div>
        )}

        {updatedForm._id && (
          <div className="mb-4 p-4 border border-gray-300 rounded bg-white shadow-md">
            <h1 className="text-3xl font-semibold mb-4">
              Update a Tour Package
            </h1>
            <form onSubmit={handleUpdateTour} className="space-y-4">
              <input
                onChange={updateTour}
                value={updatedForm.title}
                name="title"
                placeholder="Title"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <textarea
                onChange={updateTour}
                name="description"
                value={updatedForm.description}
                placeholder="Description"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                type="number"
                onChange={updateTour}
                value={updatedForm.price}
                name="price"
                placeholder="Price"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                onChange={updateTour}
                value={updatedForm.image}
                name="image"
                placeholder="Image URL"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Update a Tour
              </button>
            </form>
          </div>
        )}

        <CurrencyConverter />
      </div>
    </div>
  ) : (
    <Login />
  );
};
export default TourApp;
