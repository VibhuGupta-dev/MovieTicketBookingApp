import express from "express";
import { rateMovie , getMovieRating , getMovieReviews , deleteRating } from "../controller/MovieRateingController/movieRatingController.js";
import { attachMovieAndUser } from "../middleware/ratingMiddleware.js";
import { isuserloggedin } from "../middleware/isUserLoggedIn.js";
const router = express.Router();

router.post(
  "/rate/:movieId",
  isuserloggedin,
  attachMovieAndUser,
  rateMovie
);

router.get(
  "/rating/:movieId",
  getMovieRating
);

router.get(
  "/reviews/:movieId",
  getMovieReviews
);

router.delete(
  "/rate/:movieId",
  isuserloggedin,
  attachMovieAndUser,
  deleteRating
);

export default router;