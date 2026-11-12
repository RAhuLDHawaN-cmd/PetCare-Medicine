import "./navbar.scss";
import { useState } from "react";
import { Menu, Close, Pets } from "@mui/icons-material";
import { Link, NavLink } from "react-router-dom";

const Navbar: React.FC = () => {
   const [open, setOpen] = useState<boolean>(false);

   const toggleNavBar = () => {
      if (window.innerWidth < 500) {
         setOpen(!open);
      }
   };

   const menuStyle = open ? "menu open" : "menu";

   return (
      <header className="navbar">
         <Link to="/" className="brand"><span className="brand-mark"><Pets /></span><span>little<span className="brand-accent">paws</span><small>THE PET SHOP</small></span></Link>
         <div className="hamburger">
            <Menu onClick={toggleNavBar} aria-label="Open navigation" />
         </div>
         <div className={menuStyle}>
            <ul>
               <Close className="close" onClick={toggleNavBar} />
               <li onClick={toggleNavBar}>
                  <NavLink to="/" end>Home</NavLink>
               </li>
               <li onClick={toggleNavBar}>
                  <NavLink to="/products">Shop</NavLink>
               </li>
               <li onClick={toggleNavBar}>
                  <NavLink to="/products/add" className="nav-add">Add a product</NavLink>
               </li>
            </ul>
         </div>
      </header>
   );
};

export default Navbar;
