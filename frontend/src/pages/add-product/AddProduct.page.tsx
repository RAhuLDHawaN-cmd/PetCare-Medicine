import React from "react";
import "../product-form.scss";
import { TextField, Button } from "@mui/material";
import { IProduct } from "../../types/global.typing";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../constants/url.constant";

const AddProduct: React.FC = () => {
   const [product, setProduct] = React.useState<Partial<IProduct>>({ title: "", description: "", brand: "", quantity: 1 });
   const [image, setImage] = React.useState<File | null>(null);
   const [imagePreview, setImagePreview] = React.useState<string | null>(null);
   const redirect = useNavigate();

   React.useEffect(() => {
      if (!image) {
         setImagePreview(null);
         return;
      }
      const previewUrl = URL.createObjectURL(image);
      setImagePreview(previewUrl);
      return () => URL.revokeObjectURL(previewUrl);
   }, [image]);

   const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
      setProduct({
         ...product,
         [event.target.name]: event.target.name === "quantity" ? Number(event.target.value) : event.target.value,
      });
   };

   const handleSaveBtnClick = () => {
      if (!product.title?.trim() || !product.brand?.trim() || !Number.isInteger(product.quantity) || (product.quantity ?? 0) < 1) {
         alert("Enter a title, brand, and a quantity of at least 1.");
         return;
      }
      if (image && image.size > 5 * 1024 * 1024) {
         alert("Choose an image smaller than 5 MB.");
         return;
      }

      const data = new FormData();
      data.append("brand", product.brand);
      data.append("title", product.title);
      data.append("description", product.description ?? "");
      data.append("quantity", String(product.quantity ?? 1));
      if (image) data.append("image", image);
      axios
         .post(`${baseUrl}/upload`, data)
         .then((resposne) => redirect("/products", { state: { message: "Product Created Successfully" } }))
         .catch((error) => alert("Error"));
   };

   const handleBackBtnClick = () => {
      redirect("/products");
   };

   return (
      <div className="add-product">
         <h2>Add New Product</h2>
         <TextField
            autoComplete="off"
            label="Brand"
            variant="outlined"
            name="brand"
            value={product.brand}
            onChange={changeHandler}
         />
         <div className="image-upload-field">
            <span className="image-upload-label">Product image <small>Optional</small></span>
            <label className="image-upload-control">
               {imagePreview ? <img src={imagePreview} alt="Selected product preview" /> : <span className="image-upload-placeholder">＋</span>}
               <span className="image-upload-copy"><strong>{image ? image.name : "Choose a product photo"}</strong><small>JPG, PNG or WebP · up to 5 MB</small></span>
               <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setImage(event.target.files?.[0] ?? null)} />
            </label>
         </div>
         <TextField
            type="number"
            inputProps={{ min: 1, step: 1 }}
            label="Quantity"
            variant="outlined"
            name="quantity"
            value={product.quantity ?? 1}
            onChange={changeHandler}
         />
         <TextField
            autoComplete="off"
            label="Title"
            variant="outlined"
            name="title"
            value={product.title}
            onChange={changeHandler}
         />
         <TextField
            multiline
            minRows={3}
            autoComplete="off"
            label="Description"
            variant="outlined"
            name="description"
            value={product.description ?? ""}
            onChange={changeHandler}
         />
         <div>
            <Button variant="outlined" color="primary" onClick={handleSaveBtnClick}>
               Save
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleBackBtnClick}>
               Back
            </Button>
         </div>
      </div>
   );
};

export default AddProduct;
