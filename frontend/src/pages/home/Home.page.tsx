import "./home.scss";
import { ArrowForward, Pets } from "@mui/icons-material";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import kitten from "../../assets/images/kitten.jpg";

const Home = () => (
   <main className="home">
      <section className="hero">
         <div className="hero-copy">
            <span className="eyebrow"><Pets fontSize="small" /> A happier life, together</span>
            <h1>Little things<br />for <em>big</em> love.</h1>
            <p>Thoughtful finds for every wag, purr and happy little moment. Meet your pet’s new favorite things.</p>
            <Button component={Link} to="/products" className="hero-button" variant="contained" endIcon={<ArrowForward />}>Browse products</Button>
            <div className="hero-note"><span>♡</span> Made for the ones who make a house a home</div>
         </div>
         <div className="hero-art">
            <div className="photo-halo" />
            <img src={kitten} alt="Curious kitten ready to explore" />
            <div className="floating-note"><span>✦</span><div><strong>Good things</strong><small>for good pets</small></div></div>
            <span className="art-sparkle sparkle-one">✳</span><span className="art-sparkle sparkle-two">✦</span>
         </div>
      </section>
   </main>
);

export default Home;
