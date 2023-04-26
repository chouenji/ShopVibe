import { useEffect, useState } from 'react';
import { useRoute } from 'wouter';
import Item from '../types/Item';
import { createClient } from '@supabase/supabase-js';
import StarRatings from 'react-star-ratings';

const supabase_url = import.meta.env.VITE_SUPABASE_URL;
const supabase_key = import.meta.env.VITE_SUPABASE_KEY;

const supabase = createClient(supabase_url, supabase_key);

function ItemDetail() {
  const [match, params] = useRoute('/:category/:id');
  ('');

  const [item, setItem] = useState({} as Item);
  const [selectedRating, setSelectedRating] = useState(0);

  if (!match) return null;

  const fetchItem = async () => {
    const { data } = (await supabase
      .from('items')
      .select('*')
      .eq('id', params.id)) as any;
    setItem(data[0]);
  };

  const updateRating = async (rating: number) => {
    const oldRating = item.rating.rate;
    const oldCount = item.rating.count;
    const newCount = oldCount + 1;
    const newRating = (oldRating * oldCount + rating) / newCount;

    const { data, error } = (await supabase
      .from('items')
      .update({ rating: { rate: newRating, count: newCount } })
      .eq('id', params.id)) as any;

    if (error) {
      console.log(error);
      return;
    }

    setItem({ ...item, rating: { rate: newRating, count: newCount } });
  };

  const addReview = async (review: string) => {
    const reviews = item.reviews || []; // if reviews is undefined, set it to an empty array
    const { data, error } = (await supabase
      .from('items')
      .update({ reviews: [...reviews, review] }) // add the new review to the existing reviews array
      .eq('id', params.id)) as any;

    if (error) {
      console.log(error);
      return;
    }

    setItem({ ...item, reviews: [...reviews, review] });
  };

  useEffect(() => {
    fetchItem();
  }, []);

  return (
    <div className="text-white text-center flex flex-col justify-center">
      <h1>Item Detail</h1>
      <p>Id: {params.id}</p>

      <p>Name: {item.title}</p>
      <img className="mx-auto w-96 h-96" src={item.image} alt={item.title} />
      <p>Category: {item.category}</p>
      <br />
      <p>Price: ${item.price}</p>
      <br />
      {item.rating && (
        <StarRatings
          rating={item?.rating.rate}
          starRatedColor="yellow"
          starDimension="20px"
          starSpacing="4px"
        />
      )}
      <p>Review Count: {item.rating?.count}</p>
      <br />
      <p>Description: {item.description}</p>
      <br />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateRating(selectedRating);
        }}
      >
        <label htmlFor="rating">Rate it: </label>
        <select
          className="text-black"
          name="rating"
          id="rating"
          value={selectedRating}
          onChange={(e) => setSelectedRating(parseInt(e.target.value))}
        >
          <option value="1">1 Star</option>
          <option value="2">2 Stars</option>
          <option value="3">3 Stars</option>
          <option value="4">4 Stars</option>
          <option value="5">5 Stars</option>
        </select>
        <button
          type="submit"
          className="bg-black text-white  rounded-md mt-4 ml-3 p-2 mb-4"
        >
          Submit
        </button>
      </form>
      <form
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          addReview(e.currentTarget.review.value);
        }}
      >
        <label htmlFor="review">Review: </label>
        <input
          className="text-black"
          type="text"
          name="review"
          id="review"
          placeholder="Write a review"
          required
        />
        <button
          type="submit"
          className="bg-black text-white  rounded-md mt-4 ml-3 p-2"
        >
          Submit
        </button>
      </form>

      <p>Reviews:</p>
      <ul className="bg-white text-black w-80 mx-auto mb-4">
        {item.reviews?.map((review, index) => (
          <>
            <li key={index}>{review}</li>
            <hr />
          </>
        ))}
      </ul>
    </div>
  );
}

export default ItemDetail;
