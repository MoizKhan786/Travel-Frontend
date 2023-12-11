import axios from "axios";
import { useEffect, useState } from "react";
import Login from "../pages/Login";
import { useNavigate } from "react-router-dom";

const TourApp = () => {
  const [tours, setTours] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

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
        const response = await axios.get("http://34.242.163.239/check-auth", {
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

  const fetchTours = async () => {
    const res = await axios.get("http://34.242.163.239/tours");
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
    const res = await axios.post("http://34.242.163.239/tour", form);
    setForm({
      title: "",
      description: "",
      image: "",
      price: "",
    });
    setTours([...tours, res.data.tour]);
  };

  const deleteTour = async (_id) => {
    const res = await axios.delete(`http://34.242.163.239/tour/${_id}`);
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
      `http://34.242.163.239/tour/${updatedForm._id}`,
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
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  return authenticated ? (
    <div className="container mx-auto p-8">
      <div>
        <h1 className="text-3xl font-semibold mb-4">Tours:</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded mt-2"
        >
          Logout
        </button>

        {tours &&
          tours.map((tour) => (
            <div
              key={tour._id}
              className="mb-4 p-4 border border-gray-300 rounded"
            >
              {tour.image && (
                <img
                  src={tour.image}
                  alt={tour.title}
                  className="w-full h-40 object-cover mb-2 rounded"
                />
              )}
              <h1 className="text-xl font-semibold mb-2">{tour.title}</h1>
              <p className="text-gray-700 mb-2">{tour.description}</p>
              <p className="text-blue-500 font-bold">{tour.price}€</p>
              <button
                onClick={() => deleteTour(tour._id)}
                className="bg-red-500 text-white px-4 py-2 rounded mt-2"
              >
                Delete Tour
              </button>
              <button
                onClick={() => toggleUpdate(tour)}
                className="bg-blue-500 text-white px-4 py-2 rounded ml-2 mt-2"
              >
                Update Tour
              </button>
            </div>
          ))}
      </div>

      {/* Only admin access create tour */}
      {!updatedForm._id && (
        <div className="mb-4 p-4 border border-gray-300 rounded">
          <h1 className="text-3xl font-semibold mb-4">Create a Tour Package</h1>
          <form onSubmit={createTour}>
            <input
              onChange={updateForm}
              value={form.title}
              name="title"
              placeholder="Title"
              className="w-full p-2 mb-2 border border-gray-300 rounded"
            />
            <textarea
              onChange={updateForm}
              name="description"
              value={form.description}
              placeholder="Description"
              className="w-full p-2 mb-2 border border-gray-300 rounded"
            />
            <input
              type="number"
              onChange={updateForm}
              value={form.price}
              name="price"
              placeholder="Price"
              className="w-full p-2 mb-2 border border-gray-300 rounded"
            />
            <input
              onChange={updateForm}
              value={form.image}
              name="image"
              placeholder="Image URL"
              className="w-full p-2 mb-2 border border-gray-300 rounded"
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

      {/* Only admin access update tour */}
      {updatedForm._id && (
        <div className="mb-4 p-4 border border-gray-300 rounded">
          <h1 className="text-3xl font-semibold mb-4">Update a Tour Package</h1>
          <form onSubmit={handleUpdateTour}>
            <input
              onChange={updateTour}
              value={updatedForm.title}
              name="title"
              placeholder="Title"
              className="w-full p-2 mb-2 border border-gray-300 rounded"
            />
            <textarea
              onChange={updateTour}
              name="description"
              value={updatedForm.description}
              placeholder="Description"
              className="w-full p-2 mb-2 border border-gray-300 rounded"
            />
            <input
              type="number"
              onChange={updateTour}
              value={updatedForm.price}
              name="price"
              placeholder="Price"
              className="w-full p-2 mb-2 border border-gray-300 rounded"
            />
            <input
              onChange={updateTour}
              value={updatedForm.image}
              name="image"
              placeholder="Image URL"
              className="w-full p-2 mb-2 border border-gray-300 rounded"
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
    </div>
  ) : (
    <Login />
  );
};
export default TourApp;
