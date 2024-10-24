import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { http } from "../axios";

function Products() {
  const [productCard, setProductCard] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [company, setCompany] = useState('');
  const [order, setOrder] = useState('a-z');
  const [price, setPrice] = useState('');
  const [shipping, setShipping] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Har sahifada ko'rsatiladigan mahsulotlar soni
  const [totalItems, setTotalItems] = useState(0); // Umumiy mahsulotlar soni

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, category, company, order, price, shipping, currentPage]);

  const fetchProducts = () => {
    const query = new URLSearchParams();
    if (searchTerm) query.append('search', searchTerm);
    if (category) query.append('category', category);
    if (company) query.append('company', company);
    if (order) query.append('order', order);
    if (price) query.append('price', price);
    if (shipping) query.append('shipping', 'on');
    query.append('page', currentPage); // Joriy sahifa

    const queryString = query.toString();
    
    http.get(`/products?${queryString}`)
      .then(data => {
        setProductCard(data.data.data);
        setTotalItems(data.data.meta.total); // Umumiy mahsulotlar sonini oling
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function handlePages(id) {
    navigate(`/products/${id}`);
  }

  // Paginatsiya tugmasini bosganimizda
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Umumiy sahifalar sonini hisoblang
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className='container mx-auto p-8 flax'>
      <div className="mb-8 flex items-center justify-between bg-blue-100 p-4 rounded-lg">
        {/* Qidiruv va filtrlar */}
        <input
          type="text"
          placeholder="Search..."
          className="border p-2 mr-2 bg-white rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select className="border p-2 mr-2 bg-white  rounded-md" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="Tables">Tables</option>
          <option value="Chairs">Chairs</option>
          <option value="Beds">Beds</option>
        </select>

        <select className="bg-white border p-2 mr-2 rounded-md" value={company} onChange={(e) => setCompany(e.target.value)}>
          <option value="">All Companies</option>
          <option value="Ikea">Ikea</option>
          <option value="Modenza">Modenza</option>
        </select>

        <select className="bg-white border p-2 mr-2 rounded-md" value={order} onChange={(e) => setOrder(e.target.value)}>
          <option value="a-z">A-Z</option>
          <option value="z-a">Z-A</option>
        </select>

        <input
          type="number"
          placeholder="Max Price"
          className="bg-white border p-2 mr-2 rounded-md"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
        {productCard.length > 0 ? (
          productCard.map(product => (
            <div key={product.id} className='shadow-lg rounded-xl overflow-hidden cursor-pointer ' onClick={() => handlePages(product.id)}>
              <img
                src={product.attributes.image}
                alt={product.attributes.title}
                className='w-full h-64 object-cover p-4 rounded-xl'
              />
              <div className='p-5 text-center'>
                <h3 className='text-xl font-bold capitalize'>{product.attributes.title}</h3>
                <p className='text-lg text-gray-600 mt-2'>${(product.attributes.price / 100).toFixed(2)}</p>
              </div>
            </div>
          ))
        ) : (
          <p className='text-center'>No products available</p>
        )}
      </div>

      {/* Paginatsiya */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={`mx-1 px-3 py-1 border rounded-lg ${currentPage === index + 1 ? 'bg-indigo-500 text-white' : 'bg-white text-indigo-500'}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;
