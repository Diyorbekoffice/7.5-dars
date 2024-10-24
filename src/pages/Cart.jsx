import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../App';

function Card() {
  const { cart, setCart } = useContext(CartContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // login holatini saqlash
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const navigate = useNavigate();

  // Mahsulotlar miqdorini yangilash
  const handleQuantityChange = (id, newQuantity) => {
    const updatedProducts = cart.map((item) =>
      item.id === id ? { ...item, count: newQuantity } : item
    );
    setCart(updatedProducts);
    localStorage.setItem('cart', JSON.stringify(updatedProducts));
  };

  // Mahsulotni savatdan olib tashlash
  const handleRemoveProduct = (id, color) => {
    const updatedProducts = cart.filter(
      (item) => !(item.id === id && item.color === color)
    );
    setCart(updatedProducts);
    localStorage.setItem('cart', JSON.stringify(updatedProducts));

    setNotificationMessage('Item removed from cart');
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  // Savatdagi jami narxni hisoblash
  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + item.data.attributes.price * item.count, 0);
  };

  const shipping = 5.00; // doimiy yetkazib berish narxi
  const taxRate = 0.10; // soliq foizi, 10% deb qabul qilamiz
  const tax = calculateSubtotal() * taxRate; // soliqni hisoblash
  const orderTotal = calculateSubtotal() + shipping + tax; // umumiy narx

  // Login tekshiruvi (oddiy misol uchun localStorage-da tokenni tekshiramiz)
  useEffect(() => {
    const token = localStorage.getItem('authToken'); // login tokenni saqlash
    if (token) {
      setIsLoggedIn(true); // agar token bo'lsa, login bo'lgan deb qabul qilamiz
    }
  }, []);

  // Checkout tugmasiga bosilganda
  const handleCheckout = () => {
    if (!isLoggedIn) {
      setNotificationMessage('Please log in to proceed');
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      navigate('/login'); // login sahifasiga yo'naltirish
    } else {
      // Foydalanuvchi login qilgan bo'lsa, checkout sahifasiga o'tkazish
      navigate('/checkout');
    }
  };

  return (
    <div className='container mx-auto p-8'>
      <h1 className='text-4xl font-bold text-center mb-10'>Your Cart</h1>

      {showNotification && (
        <div className="fixed top-5 right-5 bg-red-500 text-white p-4 rounded-lg shadow-lg flex items-center">
          <svg className="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          <span>{notificationMessage}</span>
        </div>
      )}

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
        {cart.length > 0 ? (
          cart.map((item, index) => (
            <div key={index} className='shadow-lg rounded-xl overflow-hidden'>
              <img
                src={item.data.attributes.image}
                alt={item.data.attributes.title}
                className='w-full h-64 object-cover'
              />
              <div className='p-5 text-center'>
                <h3 className='text-xl font-bold capitalize'>{item.data.attributes.title}</h3>
                <div className='flex items-center justify-center mt-2'>
                  <label className='mr-2'>Color:</label>
                  <span
                    className='block w-6 h-6 rounded-full mr-2'
                    style={{ backgroundColor: item.color }}
                  />
                  <span className='text-lg text-gray-600'>{item.color}</span>
                </div>
                <div className="flex items-center justify-center mt-2">
                  <label htmlFor={`quantity-${index}`} className="mr-2">Quantity:</label>
                  <select
                    id={`quantity-${index}`}
                    value={item.count}
                    onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                    className="border rounded px-2 py-1"
                  >
                    {[...Array(20).keys()].map(number => (
                      <option key={number + 1} value={number + 1}>{number + 1}</option>
                    ))}
                  </select>
                </div>
                <p className='text-lg text-gray-600 mt-2'>
                  ${(item.data.attributes.price * item.count).toFixed(2)}
                </p>
                <button
                  onClick={() => handleRemoveProduct(item.id, item.color)}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  DELETE
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className='text-center'>No items in your cart</p>
        )}
      </div>

      {/* Subtotal, Shipping, Tax, Order Total qismini qo'shish */}
      {cart.length > 0 && (
        <div className='mt-10 bg-blue-50 p-5 rounded-lg shadow-lg'>
          <p className='text-xl'>
            <strong>Subtotal:</strong> ${calculateSubtotal().toFixed(2)}
          </p>
          <p className='text-xl'>
            <strong>Shipping:</strong> ${shipping.toFixed(2)}
          </p>
          <p className='text-xl'>
            <strong>Tax:</strong> ${tax.toFixed(2)}
          </p>
          <hr className='my-3'/>
          <p className='text-2xl font-bold'>
            <strong>Order Total:</strong> ${orderTotal.toFixed(2)}
          </p>

          {/* Login bo'lmagan holatda "PLEASE LOGIN", login qilingandan keyin "PROCEED TO CHECKOUT" tugmasi */}
          <button
            onClick={handleCheckout}
            className="mt-4 px-6 py-3 bg-green-600 text-white text-xl rounded hover:bg-green-700 w-full"
          >
            {isLoggedIn ? 'PROCEED TO CHECKOUT' : 'PLEASE LOGIN'}
          </button>
        </div>
      )}
    </div>
  );
}

export default Card;
