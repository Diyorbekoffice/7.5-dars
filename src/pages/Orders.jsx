import React from 'react';
import { useLocation } from 'react-router-dom';

function Orders() {
  const location = useLocation();
  // const { cart, setCart } = useContext(CartContext);
  const order = location.state?.order || {};

  return (
    <div className="container mx-auto my-8">
      <h2 className="text-2xl font-bold">Your Orders</h2>
      <p>Total Orders: 1</p>
      <table className="table-auto w-full border-collapse">
        <thead>
          <tr>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Address</th>
            <th className="border px-4 py-2">Products</th>
            <th className="border px-4 py-2">Cost</th>
            <th className="border px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-4 py-2">{order.name}</td>
            <td className="border px-4 py-2">{order.address}</td>
            <td className="border px-4 py-2">{order.products}</td>
            <td className="border px-4 py-2">${order.cost}</td>
            <td className="border px-4 py-2">{order.date}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Orders;
