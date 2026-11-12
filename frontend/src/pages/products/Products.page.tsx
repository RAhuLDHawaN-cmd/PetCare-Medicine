import { useEffect, useMemo, useState } from "react";
import "./products.scss";
import axios from "axios";
import { apiOrigin, baseUrl } from "../../constants/url.constant";
import { IProduct } from "../../types/global.typing";
import { Button, CircularProgress, TextField } from "@mui/material";
import { Add, Delete, Edit, Search, Pets } from "@mui/icons-material";
import moment from "moment";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Products: React.FC = () => {
   const [products, setProducts] = useState<IProduct[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");
   const [query, setQuery] = useState("");
   const location = useLocation();
   const navigate = useNavigate();

   useEffect(() => {
      let active = true;
      axios.get<IProduct[]>(baseUrl)
         .then(({ data }) => { if (active) setProducts(data); })
         .catch(() => { if (active) setError("We couldn’t reach the shop right now. Please check that the API is running and try again."); })
         .finally(() => { if (active) setLoading(false); });
      return () => { active = false; };
   }, []);

   useEffect(() => {
      const message = (location.state as { message?: string } | null)?.message;
      if (message) {
         Swal.fire({ icon: "success", title: message, timer: 1800, showConfirmButton: false });
         navigate(location.pathname, { replace: true, state: null });
      }
   }, [location, navigate]);

   const filteredProducts = useMemo(() => products.filter((product) =>
      `${product.title} ${product.brand} ${product.description}`.toLowerCase().includes(query.trim().toLowerCase())
   ), [products, query]);

   return (
      <main className="products">
         <div className="products-heading"><div><span className="eyebrow"><Pets fontSize="small" /> THE COLLECTION</span><h1>Shop all the good stuff</h1><p>Little comforts and everyday favorites for your best friend.</p></div><Button component={Link} to="/products/add" variant="contained" startIcon={<Add />}>Add a product</Button></div>
         <div className="catalog-tools"><span>{products.length} {products.length === 1 ? "find" : "finds"} for your favorite</span><TextField size="small" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" aria-label="Search products" InputProps={{ startAdornment: <Search fontSize="small" /> }} /></div>
         {loading ? <div className="catalog-message"><CircularProgress size={28} /><p>Finding the good stuff…</p></div> : error ? <div className="catalog-message error-message"><p>{error}</p><Button onClick={() => window.location.reload()}>Try again</Button></div> : filteredProducts.length === 0 ? <div className="catalog-message empty-message"><span>♡</span><h2>{query ? "No matches just yet" : "Your shelves are waiting"}</h2><p>{query ? "Try another search, or clear the search field." : "Add a product to start building your collection."}</p>{!query && <Button component={Link} to="/products/add" variant="contained" startIcon={<Add />}>Add a product</Button>}</div> : (
            <div className="product-grid">{filteredProducts.map((product, index) => (
               <article className="product-card" key={product.id}>
                  <div className={`product-art art-${index % 4}`}>{product.imageUrl ? <img className="product-photo" src={`${apiOrigin}${product.imageUrl}`} alt={product.title} /> : <span className="product-icon"><Pets /></span>}<span className="product-tag">A little favorite</span></div>
                  <div className="product-info"><span className="product-brand">{product.brand}</span><h2>{product.title}</h2><p className="product-description">{product.description}</p><p>{product.quantity} {product.quantity === 1 ? "item" : "items"} in stock · Added {moment(product.createdAt).fromNow()}</p><div className="product-actions"><Button component={Link} to={`/products/edit/${product.id}`} startIcon={<Edit />}>Edit</Button><Button component={Link} to={`/products/delete/${product.id}`} color="error" startIcon={<Delete />}>Remove</Button></div></div>
               </article>
            ))}</div>
         )}
      </main>
   );
};

export default Products;
