import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../App';

function Card() {
  const { cart, setCart } = useContext(CartContext);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const navigate = useNavigate();

  

  

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

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + item.data.attributes.price * item.count, 0);
  };

  const shipping = 5.00;
  const taxRate = 0.10;
  const subtotal = calculateSubtotal();
  const tax = subtotal * taxRate;
  const orderTotal = subtotal + shipping + tax;

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
    }
  }, [token]);

  const handleCheckout = () => {
    if (token) {
      navigate('/checkout');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-10 pb-4 text-left">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row justify-between gap-48">
        <div className="lg:w-2/3 space-y-6">
          {cart.length > 0 ? (
            cart.map((item, index) => (
              <div key={index} className="flex justify-between items-center border-b pb-6">
                <img src={item.data.attributes.image} alt={item.data.attributes.title} className="w-48 h-48 object-cover rounded-lg" />
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-gray-800">{item.data.attributes.title}</h3>
                  <p className="text-sm text-gray-600">Color: <span style={{ backgroundColor: item.color }} className="inline-block w-4 h-4 rounded-full"></span> {item.color}</p>
                  <div className="mt-2">
                    <label htmlFor={`quantity-${index}`} className="text-gray-600 text-sm">Amount:</label>
                    <select id={`quantity-${index}`} value={item.count} onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))} className="ml-2 bg-gray-100 border rounded-lg px-2 py-1">
                      {[...Array(20).keys()].map(number => (
                        <option key={number + 1} value={number + 1}>{number + 1}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-800">${(item.data.attributes.price * item.count).toFixed(2)}</p>
                  <button onClick={() => handleRemoveProduct(item.id, item.color)} className="text-sm text-red-600 mt-4 underline">remove</button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-lg text-gray-600">No items in your cart</p>
          )}
        </div>

        {cart.length > 0 && (
          <div className="card bg-base-400 p-6 lg:w-1/3">
            <div className="card-body bg-white rounded-2xl p-8 text-lg">
              <p className="flex justify-between text-base font-semibold border-b border-base-300 pb-4">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </p>
              <p className="flex justify-between text-base font-semibold border-b border-base-300 pb-4">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </p>
              <p className="flex justify-between text-base font-semibold border-b border-base-300 pb-4">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </p>
              <p className="flex justify-between text-lg mt-6 font-bold pb-4">
                <span>Order Total</span>
                <span>${orderTotal.toFixed(2)}</span>
              </p>
              <div className="mt-10">
                <button onClick={handleCheckout} className="btn btn-primary btn-block text-white py-3">
                  {token ? "PROCEED TO CHECKOUT" : "PLEASE LOGIN"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showNotification && (
        <div className="notification">
          {notificationMessage}
        </div>
      )}
    </div>
  );
}

export default Card;
