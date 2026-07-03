import {
  useState,
} from "react";

import api from "../services/api";

const ReviewForm =
({ productId }) => {

  const [rating,
    setRating] =
    useState(5);

  const [comment,
    setComment] =
    useState("");

  const submitHandler =
    async (e) => {

      e.preventDefault();

      await api.post(
        `/products/${productId}/reviews`,
        {
          rating,
          comment,
        }
      );

      alert(
        "Review Added"
      );

      setComment("");
    };

  return (
    <form
      onSubmit={
        submitHandler
      }
    >
      <h3>
        Write Review
      </h3>

      <select
        value={rating}
        onChange={(e) =>
          setRating(
            e.target.value
          )
        }
      >
        <option value="1">
          1 Star
        </option>

        <option value="2">
          2 Stars
        </option>

        <option value="3">
          3 Stars
        </option>

        <option value="4">
          4 Stars
        </option>

        <option value="5">
          5 Stars
        </option>
      </select>

      <br />
      <br />

      <textarea
        value={comment}
        onChange={(e) =>
          setComment(
            e.target.value
          )
        }
      />

      <br />
      <br />

      <button>
        Submit
      </button>
    </form>
  );
};

export default ReviewForm;