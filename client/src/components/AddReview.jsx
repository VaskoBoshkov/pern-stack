import React, { useState } from "react";
import { useHistory, useLocation, useParams } from "react-router";
import RestaurantFinder from "../apis/RestaurantFinder";

const AddReview = () => {
  const { id } = useParams();
  const history = useHistory();
  const location = useLocation();
  const [name, setName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState("Rating");

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await RestaurantFinder.post(`/${id}/addReview`, {
        name,
        review: reviewText,
        rating,
      });
      history.push("/");
      history.push(location);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='mb-2'>
      <form action=''>
        <div className='form-row' style={{ display: "flex" }}>
          <div className='form-group col-8'>
            <label htmlFor='name'>Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              id='name'
              placeholder='name'
              type='text'
              className='form-control'
            />
          </div>
          <div className='form-group col-4'>
            <label htmlFor='rating' style={{ display: "block" }}>
              Rating
            </label>
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              id='rating'
              className='custom-select'
              style={{ width: "100%", height: "60%", marginLeft: "0.25rem" }}
            >
              <option disabled>Rating</option>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </select>
          </div>
        </div>
        <div className='form-group'>
          <label htmlFor='Review'>Review</label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            id='Review'
            className='form-control'
          ></textarea>
        </div>
        <button
          type='submit'
          onClick={handleSubmitReview}
          className='btn btn-primary'
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddReview;
