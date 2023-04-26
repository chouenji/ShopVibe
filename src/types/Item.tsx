export default interface Item {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
  quantity: number;
  category: string;
  rating: {
    rate: number;
    count: number;
  };
  reviews: string[];
}
