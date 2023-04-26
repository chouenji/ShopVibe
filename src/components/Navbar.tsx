import { Link } from 'wouter';

function Navbar() {
  return (
    <div>
      <nav className="flex items-center justify-between flex-wrap bg-teal-500 p-6">
        <div className="flex items-center flex-shrink-0 text-white mr-6">
          <Link to="/">
            <span className="font-semibold text-xl tracking-tight cursor-pointer hover:text-gray-300">
              ShopVibe
            </span>
          </Link>
        </div>
        <div className="block lg:hidden">
          <button className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white">
            <svg
              className="fill-current h-3 w-3"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Menu</title>
              <path d="M0 0h20v20H0z" fill="none" />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M2 5h16v2H2V5zm0 6h16v-2H2v2zm0 6h16v-2H2v2z"
                fill="white"
              />
            </svg>
          </button>
        </div>
        <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
          <div className="text-sm lg:flex-grow">
            <Link to="/">
              <span className="text-white cursor-pointer hover:text-gray-300 mr-4">
                Home
              </span>
            </Link>
            <Link to="/cart">
              <span className="text-white cursor-pointer hover:text-gray-300">
                My Shopping Cart
              </span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
