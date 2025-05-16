import React from 'react';
import './ProductManagement.css';
import { Link } from 'react-router-dom';

function ProductManagement() {
const products = [
  { _id: 123123, name: 'Shirt', price: 500, sku: 'StyleNest123' },
  { _id: 456456, name: 'Jeans', price: 1200, sku: 'StyleNest456' },
  { _id: 789789, name: 'Jacket', price: 2500, sku: 'StyleNest789' },
  { _id: 111222, name: 'T-Shirt', price: 400, sku: 'StyleNest111' },
  { _id: 333444, name: 'Hoodie', price: 1500, sku: 'StyleNest333' },
  { _id: 555666, name: 'Sweater', price: 900, sku: 'StyleNest555' },
  { _id: 777888, name: 'Shorts', price: 700, sku: 'StyleNest777' },
  { _id: 999000, name: 'Cap', price: 300, sku: 'StyleNest999' },
  { _id: 121314, name: 'Scarf', price: 350, sku: 'StyleNest121' },
  { _id: 151617, name: 'Socks', price: 150, sku: 'StyleNest151' },
  { _id: 181920, name: 'Gloves', price: 450, sku: 'StyleNest181' },
  { _id: 212223, name: 'Shoes', price: 2800, sku: 'StyleNest212' },
  { _id: 242526, name: 'Sandals', price: 1300, sku: 'StyleNest242' },
  { _id: 272829, name: 'Boots', price: 3200, sku: 'StyleNest272' },
  { _id: 303132, name: 'Belt', price: 600, sku: 'StyleNest303' },
  { _id: 333435, name: 'Watch', price: 4000, sku: 'StyleNest333' },
  { _id: 363738, name: 'Sunglasses', price: 2200, sku: 'StyleNest363' },
  { _id: 394041, name: 'Blazer', price: 5000, sku: 'StyleNest394' },
  { _id: 424344, name: 'Kurta', price: 900, sku: 'StyleNest424' },
  { _id: 454647, name: 'Suit', price: 6500, sku: 'StyleNest454' },
];


  const handleDelete = (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (confirmDelete) {
      console.log(`Product with id ${id} deleted`);
      // API delete logic would go here
    }
  };

  return (
    <div className="product-management-container">
      {/* Header */}
      <div className="product-management-header">
        <h1 className="product-page-title">Product Management</h1>

        {/* Top-right Add Button */}
        <div className="add-product-btn-container">
          <button className="add-product-btn">+ Add New Product</button>
        </div>
      </div>

      {/* Table Section */}
      <div className="product-table-section">
        <table className="product-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Price (₹)</th>
              <th>SKU Code</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.sku}</td>
                  <td>
                    <Link to={`/admin/products/${product._id}/edit`} className="btn edit-btn">
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="btn delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-products-msg">
                  No products available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductManagement;
