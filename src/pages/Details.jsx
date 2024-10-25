import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { http } from '../axios';
import { CartContext } from '../App';

function Details() {
  const [product, setProduct] = useState({});
  const { id } = useParams();
  const [color, setColor] = useState();
  const [count, setCount] = useState(1);
  const { cart, setCart } = useContext(CartContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Yangi state: xabarnoma
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const savedProduct = localStorage.getItem(`product-${id}`);
    if (savedProduct) {
      // localStorage'dan ma'lumotni olish
      const productData = JSON.parse(savedProduct);
      setProduct(productData);
      setColor(productData.attributes.colors[0]);
      setLoading(false);
    } else {
      // API'dan ma'lumotni olish
      http.get(`products/${id}`)
        .then(response => {
          if (response.status === 200) {
            const productData = response.data.data;
            setProduct(productData);
            setColor(productData.attributes.colors[0]);
            localStorage.setItem(`product-${id}`, JSON.stringify(productData)); // `product`ni localStorage'ga saqlash
          }
        })
        .catch(err => {
          setError('Error fetching product details.');
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  function handleSetCart(e) {
    e.preventDefault();
    let data = {
      count: Number(count), 
      color: color,
      id: product.id,
      data: product 
    };
    
    // localStorage'dan cart'ni olish yoki bo'sh massiv yaratish
    let savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    
    let isExist = savedCart.find(c => c.id === data.id && color === c.color);

    if (!isExist) {
      savedCart.push(data);
    } else {
      savedCart = savedCart.map(value => {
        if (value.id === data.id && value.color === color) {
          value.count += Number(data.count);
        }
        return value;
      });
    }

    // Yangilangan cart'ni localStorage'ga saqlash
    localStorage.setItem('cart', JSON.stringify(savedCart));
    
    // Context cart'ni yangilash
    setCart(savedCart);

    // Xabarnomani ko'rsatish
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000); // 3 sekunddan keyin xabarnoma yashiriladi
  }

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (error) {
    return <div>{error}</div>; 
  }

  const { title, company, price, description, colors, image } = product.attributes || {};

  return (
    <div className='container max-w-[1140px] mx-auto mt-3 mb-48'>
      {showNotification && (
        <div className="fixed top-5 right-5 bg-green-500 text-white p-4 rounded-lg shadow-lg flex items-center">
          <svg className="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          <span>Item added to cart</span>
        </div>
      )}

      <div className="flex items-center space-x-2 text-lg">
        <Link to="/" className="hover:underline">Home</Link>
        <span className="text-gray-500">/</span>
        <Link to="/products" className="hover:underline">Product</Link>
      </div>

      { product.id && (
        <div className="wrapper container mx-auto flex mt-3 gap-10">
          <img className="w-96 h-96 object-cover rounded-lg lg:w-full" src={image} alt={title} />
          <div className='text-left'>
            <h3 className='capitalize text-3xl font-bold text-indigo-950'>{title}</h3>
            <p className="text-xl font-bold mt-2 text-gray-400">{company}</p>
            <p className='mt-3 text-xl'>${price}</p>
            <p className='mt-6 leading-8'>{description}</p>
            <p className="text-md font-medium tracking-wider capitalize mt-6">Colors</p>

            <div className='flex'>
              { colors?.map((c, index) => (
                <button
                  key={index}
                  className={`w-6 h-6 rounded-full mr-2 ${color === c ? 'border-2 border-black' : ''}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                ></button>
              )) }
            </div>

            <div className="mb-4 mt-3">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
                Amount
              </label>
              <div className="relative w-72">
                <select
                  id="amount"
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                  className="block appearance-none w-full bg-white border border-purple-500 text-gray-700 py-2 px-3 pr-8 rounded-lg leading-tight focus:outline-none focus:ring focus:border-purple-500"
                >
                  {[1, 2, 3].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>

            <button onClick={handleSetCart} className='bg-indigo-800 text-zinc-300 font-semibold p-3 rounded-lg'>
              ADD TO BAG
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Details;
