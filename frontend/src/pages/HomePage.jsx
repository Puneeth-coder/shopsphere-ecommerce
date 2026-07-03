import { useEffect, useState } from "react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import "../styles/home.css";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  
  // Filter/Sort State
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest");
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await api.get(
          `/products?page=${page}&keyword=${keyword}&category=${category}&sort=${sort}`
        );

        setProducts(response.data.products);
        setPages(response.data.pages);
        if (response.data.categories) {
          setCategories(response.data.categories);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, keyword, category, sort]);

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(1);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
    setPage(1);
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <h1 className="home-title">Discover Our Products</h1>
        <p className="home-subtitle">Find high-quality products curated just for you.</p>
      </div>

      <div className="controls-panel">
        <div className="search-wrapper">
          <input
            className="search-input"
            type="text"
            placeholder="Search products..."
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="filters-wrapper">
          <div className="filter-group">
            <label className="filter-label" htmlFor="category-select">
              Category
            </label>
            <select
              id="category-select"
              className="filter-select"
              value={category}
              onChange={handleCategoryChange}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label" htmlFor="sort-select">
              Sort By
            </label>
            <select
              id="sort-select"
              className="filter-select"
              value={sort}
              onChange={handleSortChange}
            >
              <option value="newest">Newest</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="ratingDesc">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <h2>Loading products...</h2>
        </div>
      ) : (
        <>
          <div className="products-grid">
            {products.length === 0 ? (
              <div className="no-products">
                <h3>No Products Found</h3>
                <p>Try adjusting your filters or search keywords.</p>
              </div>
            ) : (
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            )}
          </div>

          {pages > 1 && (
            <div className="pagination-container">
              <button
                className="pagination-btn"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                ◀ Previous
              </button>

              <span className="pagination-info">
                Page {page} of {pages}
              </span>

              <button
                className="pagination-btn"
                disabled={page === pages}
                onClick={() => setPage(page + 1)}
              >
                Next ▶
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HomePage;