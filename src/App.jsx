import React, { createContext, useEffect, useState, useContext } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import ErrorPage from './pages/ErrorPage';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Details from './pages/Details';
import Cart from './pages/Cart';
import MainLayout from './layouts/MainLayout';

export const CartContext = createContext();
export const ThemeContext = createContext();

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);
  const [theme, setTheme] = useState('light');
  const [sum, setSum] = useState(0);

  useEffect(() => {
    if (localStorage.getItem('cart')) {
      setCart(JSON.parse(localStorage.getItem('cart')))
    }
   }, [])
  
   useEffect(() => {
    if (localStorage.getItem('token')) {
      setToken(localStorage.getItem('token'))
    } else{
      if (location.pathname == '/orders' ) {
        navigate('/login');
      }
    }
   }, [navigate])


  function PrivateRoute({ isAuth, children }) {
    const navigate = useNavigate();

    useEffect(() => {
      if (!isAuth) {
        navigate('/login');
      }
    }, [isAuth, navigate]);

    return isAuth ? children : null;
  }

  return (
    <CartContext.Provider value={{ cart, setCart,sum,setSum }}>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <Routes>
          <Route path='/' element={<MainLayout><Home /></MainLayout>} />
          <Route path='/about' element={<MainLayout><About /></MainLayout>} />
          <Route path='/products' element={<MainLayout><Products /></MainLayout>} />
          <Route path='/products/:id' element={<MainLayout><Details /></MainLayout>} />
          <Route path='/cart' element={<MainLayout><Cart /></MainLayout>} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/orders' element={
            <PrivateRoute isAuth={!!token}>
              <MainLayout><Orders /></MainLayout>
            </PrivateRoute>
          } />
          <Route path='/checkout' element={
            <PrivateRoute isAuth={!!token}>
              <MainLayout><Checkout /></MainLayout>
            </PrivateRoute>
          } />
          <Route path='*' element={<ErrorPage />} />
        </Routes>
      </ThemeContext.Provider>
    </CartContext.Provider>
  );
}

export default App;
