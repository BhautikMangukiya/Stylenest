import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchProductsByFilters, deleteProduct } from '../../../../redux/slices/productsSlice';
import { toast } from 'sonner';
import './ProductManagement.css';

function ProductManagement() {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProductsByFilters({}));
  }, [dispatch]);

  const handleDelete = (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (confirmDelete) {
      dispatch(deleteProduct(id))
        .unwrap()
        .then(() => toast.success('Product deleted successfully!'))
        .catch((err) => toast.error(err || 'Failed to delete product'));
    }
  };

  return (
    <div className="product-management-container">
      <div className="product-management-header">
        <h1>Product Management</h1>
        <Link to="/admin/products/add" className="add-product-btn">+ Add Product</Link>
      </div>

      {loading && <div className="loading-text">Loading products...</div>}
      {error && <div className="error-message">Error: {error}</div>}

      {!loading && !error && (
        <div className="product-table-wrapper">
          <table className="product-table">
            <thead>
              <tr>
                <th>Preview</th>
                <th>Name</th>
                <th>Brand</th>
                <th>Category</th>
                <th>Price (₹)</th>
                <th>Stock</th>
                <th>SKU</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>

            <tbody>
              {products && products.length > 0 ? (
                products.map((product) => (
                  <tr key={product._id}>
                    <td>
                      {product.images?.length > 0 ? (
                        <img
                          src={product.images[0].url || product.images[0]}
                          alt={product.name}
                          className="thumbnail"
                        />
                      ) : (
                        <div className="no-image">No Image</div>
                      )}
                    </td>
                    <td>{product.name}</td>
                    <td>{product.brand || '-'}</td>
                    <td>{product.category || '-'}</td>
                    <td>₹{product.price.toFixed(2)}</td>
                    <td>{product.countInStock}</td>
                    <td>{product.sku || 'N/A'}</td>
                    <td className="actions-cell">
                      <Link
                        to={`/admin/products/${product._id}/edit`}
                        className="btn action-btn edit"
                        title="Edit"
                      >
                        Edit
                      </Link>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="btn action-btn delete"
                        title="Delete"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="no-products-msg">
                    No products available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ProductManagement;
