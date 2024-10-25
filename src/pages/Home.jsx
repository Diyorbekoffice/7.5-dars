import React, { useEffect, useState } from 'react';
import { http } from "../axios";
import { useNavigate } from 'react-router-dom';
import img1 from '../imges/home1.jpg'
import img2 from '../imges/home2.jpg'

function Home() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await http.get('products?featured=true');
        if (response.status === 200) {
          setProducts(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  function handleProducts() {
    navigate(`/products`)
  }

  function handleRedirect(id) {
    navigate(`/products/${id}`); 
  }

  return (
    <div>
          <div className='flex mb-20 mt-12 text-left'>
                <div>
                    <h1 className='text-7xl ml-10 mr-56 mb-4 font-bold'>We are changing <br /> the way people <br /> shop</h1>
                    <p className='ml-10 text-2xl'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. <br /> Tempore repellat explicabo enim soluta temporibus asperiores <br /> aut obcaecati perferendis porro nobis.</p>
                    <button onClick={handleProducts} className='ml-10 bg-blue-700 p-3 rounded-md text-white mt-4 hover:bg-blue-500'>OUR PRODUCTS</button>
                </div>
                <div className="carousel carousel-center bg-neutral rounded-box max-w-md space-x-4 p-4">
                    <div className="carousel-item">
                        <img
                            src={img1}
                            className="rounded-box h-[420px]" />
                    </div>
                    <div className="carousel-item">
                        <img
                            src={img2}
                            className="rounded-box h-[420px]" />
                    </div>
                </div>
            </div>

      <div className="container mx-auto max-w-7xl mb-64 mt-10">
      <div className="flex  w-full gap-4">
        {products.length > 0 && products.map(product => (
          <div 
            key={product.id} 
            onClick={() => handleRedirect(product.id)} 
            className='shadow-md p-5 rounded-2xl cursor-pointer w-1/3' 
          >
            <img className='rounded-xl h-96 w-full' src={product.attributes.image} alt={product.attributes.title} />
            <h3>{product.attributes.title}</h3>
            <p>${product.attributes.price}</p>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}

export default Home;
