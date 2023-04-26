import { useEffect, useState } from 'react';
import Item from '../types/Item';
import Items from '../components/Items';
import { createClient } from '@supabase/supabase-js';

const supabase_url = import.meta.env.VITE_SUPABASE_URL;
const supabase_key = import.meta.env.VITE_SUPABASE_KEY;

const supabase = createClient(supabase_url, supabase_key);

function Home() {
  const [items, setItems] = useState([] as Item[]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    const { data } = await supabase.from('items').select('*') as any;
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  if (loading) return <div className="text-center text-white">Loading...</div>;

  return (
    <div className="App">
      <header className="App-header text-center">
        <div className="grid xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-x-12 gap-y-8 m-24 bg-teal-300 p-10">
          {items.length > 0 && <Items items={items} />}
        </div>
      </header>
    </div>
  );
}

export default Home;
