require("dotenv").config();
const express = require("express");
const db = require("./db");
const cors = require("cors");
// const morgan = require("morgan");
const app = express();

app.use(cors());
app.use(express.json());

// Get all Restaurants
app.get("/api/v1/restaurants", async (req, res) => {
  try {
    const restaurantRatingsData = await db.query(
      "select * from restaurants left join (select restaurant_id, COUNT(*), TRUNC(AVG(rating),1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id;"
    );

    res.status(200).json({
      status: "success",
      results: restaurantRatingsData.rows.length,
      data: {
        restaurants: restaurantRatingsData.rows,
      },
    });
  } catch (error) {
    console.log(error);
  }
});

// Get a Restaurant
app.get("/api/v1/restaurants/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const restaurant = await db.query(
      "select * from restaurants left join (select restaurant_id, COUNT(*), TRUNC(AVG(rating),1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id where id = $1",
      [id]
    );

    const reviews = await db.query(
      "SELECT * FROM reviews WHERE restaurant_id = $1;",
      [id]
    );

    console.log(reviews);
    res.status(200).json({
      status: "success",
      data: {
        restaurant: restaurant.rows[0],
        reviews: reviews.rows,
      },
    });
  } catch (error) {
    console.log(error);
  }
});

// Create a Restaurant
app.post("/api/v1/restaurants", async (req, res) => {
  console.log(req.body);
  const { name, location, price_range } = req.body;

  try {
    const results = await db.query(
      "INSERT INTO restaurants (name, location, price_range) VALUES ($1, $2, $3) returning *;",
      [name, location, price_range]
    );

    res.status(201).json({
      status: "success",
      data: {
        restaurant: results.rows[0],
      },
    });
  } catch (error) {
    console.log(error);
  }
});

// Update Restaurants
app.put("/api/v1/restaurants/:id", async (req, res) => {
  const { id } = req.params;
  const { name, location, price_range } = req.body;

  try {
    const results = await db.query(
      "UPDATE restaurants SET name = $1, location= $2, price_range = $3 where id = $4 returning *;",
      [name, location, price_range, id]
    );
    res.status(200).json({
      status: "success",
      data: {
        restaurant: results.rows[0],
      },
    });
  } catch (error) {
    console.log(error);
  }
});

// Delete Restaurant
app.delete("/api/v1/restaurants/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const results = await db.query("DELETE FROM restaurants where id = $1", [
      id,
    ]);
    res.status(204).json({
      status: "success",
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/api/v1/restaurants/:id/addReview", async (req, res) => {
  const { id } = req.params;
  const { name, review, rating } = req.body;

  try {
    const newReview = await db.query(
      "INSERT INTO reviews (restaurant_id, name, review, rating) values ($1, $2, $3, $4) returning *",
      [id, name, review, rating]
    );
    console.log(newReview);

    res.status(201).json({
      status: "success",
      data: {
        review: newReview.rows[0],
      },
    });
  } catch (error) {
    console.log(error);
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
