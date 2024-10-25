import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { CartContext } from '../App';
import { useNavigate } from 'react-router-dom';

function Checkout() {
  const { cart } = useContext(CartContext);
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(5.0);
  const [tax, setTax] = useState(0);
  const [orderTotal, setOrderTotal] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
  });
  const navigate = useNavigate(); // Declare navigate

  useEffect(() => {
    const calculatedSubtotal = cart.reduce((total, item) => total + item.data.attributes.price * item.count, 0);
    setSubtotal(calculatedSubtotal);
    const calculatedTax = calculatedSubtotal * 0.10;
    setTax(calculatedTax);
    setOrderTotal(calculatedSubtotal + shipping + calculatedTax);
  }, [cart, shipping]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.address) {
      alert('Please fill in all the required fields.');
      return;
    }

    const orderData = {
      name: formData.name,
      address: formData.address,
      products: cart.length,
      cost: orderTotal.toFixed(2),
      date: new Date().toLocaleString(),
    };

    axios
      .post('/order', formData)
      .then((response) => {
        console.log('Order placed successfully', response.data);
        // Redirect to the Orders page and pass the order data
        navigate('/orders', { state: { order: orderData } });
      })
      .catch((error) => {
        console.error('Error placing order:', error);
      });
  };

 
  const handleChek = () => {
    navigate('/orders');
  };

  return (
    <div className="text-gray-700 mb-64 w-[1140px] container flex justify-center">
      <section className="align-element py-20">
        <div className="border-b border-base-300 pb-5">
          <h2 className="text-3xl font-medium tracking-wider capitalize">Place Your Order</h2>
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-2 items-start">
          <form onSubmit={handleOrderSubmit} className="flex flex-col gap-y-4">
            <h4 className="font-medium text-xl capitalize">Shipping Information</h4>

            <div className="form-control">
              <label htmlFor="name" className="label">
                <span className="label-text capitalize text-black">First Name</span>
              </label>
              <input
                type="text"
                name="name"
                className="input input-bordered bg-white"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-control">
              <label htmlFor="address" className="label">
                <span className="label-text capitalize text-black">Address</span>
              </label>
              <input
                type="text"
                name="address"
                className="input input-bordered bg-white"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mt-4">
              <button onClick={handleChek} type="submit" className="btn btn-primary btn-block text-white">
                Place Your Order
              </button>
            </div>
          </form>

          {cart.length > 0 && (
            <div className="card bg-base-200">
              <div className="card-body bg-white rounded-2xl">
                <p className="flex justify-between text-xs border-b border-base-300 pb-2">
                  <span>Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </p>
                <p className="flex justify-between text-xs border-b border-base-300 pb-2">
                  <span>Shipping</span>
                  <span className="font-medium">${shipping.toFixed(2)}</span>
                </p>
                <p className="flex justify-between text-xs border-b border-base-300 pb-2">
                  <span>Tax</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </p>
                <p className="flex justify-between text-sm mt-4 pb-2">
                  <span >Order Total</span>
                  <span className="font-medium">${orderTotal.toFixed(2)}</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Checkout;
