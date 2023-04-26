import { useEffect, useState } from 'react';
import Item from '../types/Item';
import StarRatings from 'react-star-ratings';
import { useLocation } from 'wouter';
import { createClient } from '@supabase/supabase-js';

const supabase_url = import.meta.env.VITE_SUPABASE_URL;
const supabase_key = import.meta.env.VITE_SUPABASE_KEY;

const supabase = createClient(supabase_url, supabase_key);

function Items(props: { items: Item[] }) {
  const [items, setItems] = useState<Item[]>([]);
  const [location, navigate] = useLocation();

  const getItems = () => {
    setItems(props.items);
  };

  const addToCart = async (item: Item) => {
    const { data, error } = (await supabase
      .from('items')
      .select('*')
      .eq('id', item.id)) as any;

    if (error) {
      console.log(error);
      return;
    }

    const { data: cartData, error: cartError } = (await supabase
      .from('cart')
      .select('*')
      .eq('item_id', item.id)) as any;

    if (cartError) {
      console.log(cartError);
      return;
    }

    if (cartData.length > 0) {
      const { data: updateData, error: updateError } = (await supabase
        .from('cart')
        .update({ quantity: cartData[0].quantity + 1 })
        .eq('item_id', item.id)) as any;

      if (updateError) {
        console.log(updateError);
        return;
      }

      return;
    }

    const { data: insertData, error: insertError } = (await supabase
      .from('cart')
      .insert([{ item_id: item.id, quantity: 1 }])) as any;

    if (insertError) {
      console.log(insertError);
      return;
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  const redirectToItemDetail = (id: number) => {
    navigate(`/item/${id}`);
  };

  return (
    <>
      {items.map((item) => (
        <div
          className="bg-white p-3 rounded-md cursor-pointer hover:bg-gray-100"
          key={item.id}
        >
          <h1 className="mb-4 font-bold">{item.title}</h1>
          <img
            onClick={() => redirectToItemDetail(item.id)}
            className="mx-auto w-80 h-80"
            src={item.image}
            alt={item.title}
          />
          <p>${item.price}</p>
          <StarRatings
            rating={item.rating.rate}
            starRatedColor="#FF0080"
            numberOfStars={5}
            name="rating"
            starDimension="20px"
            starSpacing="2px"
          />
          <br />
          <button
            onClick={() => {
              addToCart(item);
            }}
            className="bg-black text-white p-4 rounded-md mt-4"
          >
            Add to cart
          </button>
        </div>
      ))}
    </>
  );
}

export default Items;
