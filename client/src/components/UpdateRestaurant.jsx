import { useEffect } from "react";
import { useState } from "react";
import { useHistory, useParams } from "react-router";
import RestaurantFinder from "../apis/RestaurantFinder";

const UpdateRestaurant = (props) => {
  const { id } = useParams();
  let history = useHistory();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await RestaurantFinder.get(`/${id}`);
        setName(response.data.data.restaurant.name);
        setLocation(response.data.data.restaurant.location);
        setPriceRange(response.data.data.restaurant.price_range);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await RestaurantFinder.put(`/${id}`, {
        name,
        location,
        price_range: priceRange,
      });
      history.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <form action=''>
        <div className='form-group'>
          <label htmlFor='name'>Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            id='name'
            type='text'
            className='form-control'
          />
        </div>

        <div className='form-group'>
          <label htmlFor='location'>Location</label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            id='location'
            type='text'
            className='form-control'
          />
        </div>

        <div className='form-group'>
          <label htmlFor='price_range'>Price Range</label>
          <input
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            id='price_range'
            type='number'
            className='form-control'
          />
        </div>

        <button
          type='submit'
          onClick={handleSubmit}
          className='btn btn-primary'
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default UpdateRestaurant;
