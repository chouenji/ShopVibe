import { useEffect, useState } from 'react';
import './App.css';
import Item from './types/Item';
import Items from './components/Items';
import { Route } from 'wouter';
import Home from './pages/Home';
import ItemDetail from './pages/ItemDetail';
import Navbar from './components/Navbar';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Route path="/" component={Home} />
      <Route path="/item/:id" component={ItemDetail} />
      <Route path="/cart" component={Cart} />
      <Route path="/checkout" component={Checkout} />
    </div>
  );
}

export default App;
