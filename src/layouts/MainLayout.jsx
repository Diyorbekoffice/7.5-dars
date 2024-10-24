import React, { useContext, useEffect, useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import logo from '../imges/logo-c.png';
import basket from '../imges/basket.png';
import moon from '../imges/moon.png';
import { CartContext } from '../App';

function MainLayout({ children }) { 
  const { cart } = useContext(CartContext);
  const [count, setCount]  = useState(0);
  const [username, setUsername] = useState(null); // Username ni saqlash uchun state
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    let sum = 0;
    cart.forEach(element => {
      sum += Number(element.count);
    });
    setCount(sum);
  }, [cart]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUsername(localStorage.getItem('user.username')); // Username ni localStorage'dan olish
    } else {
      if (location.pathname === '/orders') {
        navigate('/login'); // Agar login qilinmagan bo'lsa, login sahifasiga o'tish
      }
    }
  }, [navigate, location.pathname]);

  const handleLogout = () => {
   setToken("") 
    localStorage.removeItem('token'); 

    navigate('/'); 
  };

  return (
    <div className=" ">
      <div className='bg-neutral-900'>
      <div className='text-right container mx-auto max-w-7xl flex gap-8 justify-end'>
        {token ? 
          <>
            <button onClick={handleLogout} className='text-white bg-blue-800 p-1 m-1 rounded-md hover:bg-blue-600'>Log Out</button> {/* Log out tugmasi */}
          </>
        : 
          <div className='text-white flex gap-12'>
            <Link to='/login'>Sign/Guest</Link>
            <Link to='/register'>Create Account</Link>
          </div>
        }
      </div>
      </div>
      <div className='bg-[#F0F6FF]'>
        <header className="flex justify-between items-center py-4 container mx-auto max-w-7xl">
          <Link to="/">
            <img className='w-12' src={logo} alt="Logo" />
          </Link>
          <nav>
            <NavLink to="/" className="mx-2">Home</NavLink>
            <NavLink to="/about" className="mx-2">About</NavLink>
            <NavLink to="/products" className="mx-2">Products</NavLink>
            <NavLink to="/cart" className="mx-2">Cart</NavLink>
            {
              token?
              <>
              <NavLink to="/checkout" className="mx-2">Checkout</NavLink>
              <NavLink to="/orders" className="mx-2">Orders</NavLink>
              </>
              :
              <>
              </>
            }
          </nav>
          <div className='flex gap-10 items-center'>
            <img className='w-4 h-4' src={moon} alt="Theme toggle" />
            <div className='relative p-3 hover:bg-slate-300 rounded-full'>
              <Link to='/cart'>
                <img className='w-7' src={basket} alt="Basket" />
              </Link>
              <span className="absolute top-1 right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex justify-center items-center">
                {count}
              </span>
            </div>
          </div>
        </header>
      </div>
      
      <main className="container mx-auto max-w-7xl flex flex-wrap gap-6 justify-center text-center">
        {children}
      </main>
    </div>
  );
}

export default MainLayout;
