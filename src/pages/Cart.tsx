import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Item from '../types/Item';
import { useLocation } from 'wouter';

const supabase_url = import.meta.env.VITE_SUPABASE_URL;
const supabase_key = import.meta.env.VITE_SUPABASE_KEY;

const supabase = createClient(supabase_url, supabase_key);

function Cart() {
  const [items, setItems] = useState([] as Item[]);
  const [cart, setCart] = useState([]) as any;
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [location, navigate] = useLocation();

  const getCart = async () => {
    const { data, error } = (await supabase.from('cart').select('*')) as any;

    if (error) {
      console.log(error);
      return;
    }

    setCart(data);
    setLoading(false);

    const { data: itemData, error: itemError } = (await supabase
      .from('items')
      .select('*')) as any;

    if (itemError) {
      console.log(itemError);
      return;
    }

    const cartItems = itemData.filter((item: Item) => {
      return data.some((cartItem: any) => cartItem.item_id === item.id);
    });

    setItems(cartItems);

    const totalPrice = cartItems.reduce((acc: number, item: Item) => {
      const cartItem = data.find(
        (cartItem: any) => cartItem.item_id === item.id
      );

      return acc + item.price * cartItem.quantity;
    }, 0);

    setPrice(totalPrice);
  };

  const removeFromCart = async (item: Item) => {
    const { data, error } = (await supabase
      .from('cart')
      .select('*')
      .eq('item_id', item.id)) as any;

    if (error) {
      console.log(error);
      return;
    }

    if (data.length === 0) {
      return;
    }

    if (data[0].quantity <= 1) {
      const { data: deleteData, error: deleteError } = (await supabase
        .from('cart')
        .delete()
        .eq('item_id', item.id)) as any;

      if (deleteError) {
        console.log(deleteError);
        return;
      }

      setCart((prevCart: any) => {
        return prevCart.filter((cartItem: any) => cartItem.item_id !== item.id);
      });
    } else {
      const { data: updateData, error: updateError } = (await supabase
        .from('cart')
        .update({ quantity: data[0].quantity - 1 })
        .eq('item_id', item.id)) as any;

      if (updateError) {
        console.log(updateError);
        return;
      }

      if (
        cart.length > 0 &&
        cart.find((cartItem: any) => cartItem.item_id === item.id)
      ) {
        setCart((prevCart: any) => {
          return prevCart.map((cartItem: any) => {
            if (cartItem && cartItem.item_id === item.id) {
              if (cartItem.quantity <= 1) {
                return null;
              }

              return { ...cartItem, quantity: cartItem.quantity - 1 };
            }

            return cartItem;
          });
        });
      }
    }

    window.location.reload();
  };

  const buyItems = () => {
    navigate('/checkout');
  };

  useEffect(() => {
    getCart();
  }, []);

  return (
    <div className="text-center text-white">
      <h1>Cart</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {items && items.length > 0 ? (
            <div className="grid xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-x-12 gap-y-8 m-24 bg-teal-300 p-10 text-black">
              {items.map((item: Item) => (
                <div key={item.id} className="bg-white rounded-lg p-5">
                  <h1 className="text-2xl font-bold">{item.title}</h1>
                  <img
                    className="w-80 h-80"
                    src={item.image}
                    alt={item.title}
                  />
                  {cart && <p className="text-lg font-bold">${item.price}</p>}
                  {cart.length > 0 && (
                    <p className="text-lg font-bold">
                      Quantity:{' '}
                      {
                        cart.find(
                          (cartItem: any) => cartItem.item_id === item.id
                        ).quantity
                      }
                    </p>
                  )}

                  <button
                    onClick={buyItems}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-4 rounded w-32 mr-2"
                  >
                    Buy
                  </button>

                  <button
                    onClick={() => {
                      removeFromCart(item);
                    }}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold p-4 rounded w-32"
                  >
                    Remove
                  </button>
                </div>
              ))}

              <div className="bg-pink-300 rounded-lg p-5">
                <h1 className="text-2xl font-bold">Total</h1>
                <p className="text-lg font-bold">${price}</p>
                <button
                  onClick={buyItems}
                  className="bg-cyan-500 hover:bg-cyan-700 text-white font-bold p-4 rounded w-32 mr-2"
                >
                  Buy Now
                </button>
              </div>
            </div>
          ) : (
            <div className="text-white">No items in cart</div>
          )}
        </div>
      )}
    </div>
  );
}

export default Cart;
