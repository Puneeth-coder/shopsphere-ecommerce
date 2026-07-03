import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/admin.css";
import "../styles/auth.css"; // Reuse form-group and inputs

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Smartphones");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      // Check if products array is inside response.data.products or is the root array
      if (response.data.products) {
        setProducts(response.data.products);
      } else {
        setProducts(response.data);
      }
    } catch (err) {
      console.error("Failed to load products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Upload image handler
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);
    setError("");

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const { data } = await api.post("/upload", formData, config);
      setImage(data.image);
      
      // DYNAMIC URL FOR IMAGE PREVIEW:
      const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";
      setImagePreview(`${serverUrl}${data.image}`);
      
      setSuccess("Image uploaded successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to upload image. Make sure server uploads folder is writeable.");
    } finally {
      setUploading(false);
    }
  };

  // Submit product creation handler
  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!image) {
      setError("Please upload an image first.");
      return;
    }

    try {
      await api.post("/products", {
        name,
        price: Number(price),
        description,
        category,
        stock: Number(stock),
        image,
      });

      setSuccess("Product created successfully!");
      // Reset form
      setName("");
      setPrice("");
      setDescription("");
      setCategory("Smartphones");
      setStock("");
      setImage("");
      setImagePreview("");
      setShowAddForm(false);
      
      // Reload list
      fetchProducts();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create product.");
    }
  };

  const deleteHandler = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await api.delete(`/products/${id}`);
      setSuccess("Product deleted successfully!");
      fetchProducts();
    } catch (err) {
      console.error(err);
      setError("Failed to delete product.");
    }
  };

  const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1 className="admin-title">Products Management</h1>
        <button
          className="admin-btn-toggle"
          onClick={() => {
            setShowAddForm(!showAddForm);
            setError("");
            setSuccess("");
          }}
        >
          {showAddForm ? "View Product List" : "Add New Product"}
        </button>
      </div>

      {success && <div className="auth-success" style={{ marginBottom: "24px" }}>{success}</div>}
      {error && <div className="auth-error" style={{ marginBottom: "24px" }}>{error}</div>}

      {showAddForm ? (
        <div className="admin-card">
          <h2 className="admin-card-title">Create Product Listing</h2>
          <form onSubmit={submitHandler}>
            <div className="form-group">
              <label className="form-label" htmlFor="prod-name">Product Name</label>
              <input
                id="prod-name"
                className="form-input"
                type="text"
                placeholder="Enter product title"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="prod-price">Price (₹)</label>
                <input
                  id="prod-price"
                  className="form-input"
                  type="number"
                  placeholder="Enter price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="prod-stock">Initial Stock Quantity</label>
                <input
                  id="prod-stock"
                  className="form-input"
                  type="number"
                  placeholder="Enter stock quantity"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="prod-category">Category</label>
                <select
                  id="prod-category"
                  className="form-input"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="Smartphones">Smartphones</option>
                  <option value="Laptops">Laptops</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Audio">Audio</option>
                  <option value="Wearables">Wearables</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="prod-image">Product Image File</label>
                <input
                  id="prod-image"
                  className="form-input"
                  type="file"
                  onChange={uploadFileHandler}
                  accept="image/*"
                />
                {uploading && <p style={{ fontSize: "0.85rem", marginTop: "4px" }}>Uploading image file...</p>}
                {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Upload preview" />
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="prod-desc">Product Description</label>
              <textarea
                id="prod-desc"
                className="form-input"
                style={{ minHeight: "100px", resize: "vertical" }}
                placeholder="Enter detailed description of the product features..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <button className="btn-primary" type="submit" style={{ width: "100%", marginTop: "12px" }}>
              Publish Product
            </button>
          </form>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "40px" }}>
                    No products added yet. Click "Add New Product" to seed one!
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <div className="admin-product-item">
                        <img
                          src={`${serverUrl}${product.image}`}
                          alt={product.name}
                          className="admin-product-thumb"
                        />
                        <span className="admin-product-name">{product.name}</span>
                      </div>
                    </td>
                    <td>{product.category || "General"}</td>
                    <td>₹{product.price}</td>
                    <td>
                      <span className={`admin-badge ${product.stock > 0 ? "admin-badge-stock" : "admin-badge-out"}`}>
                        {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn-action-delete"
                        onClick={() => deleteHandler(product._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;