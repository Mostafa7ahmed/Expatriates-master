import Home from "./HomePage/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import News from "./NewsPage/News"
import Details from "./NewsDetails/Details";
import ContactUs from "./ContactUsPage/ContactUs"
import Collage from "./Collages/Collages"
import Programs from "./ProgramsPage/Programs";
import Header from "./HomePage/Header/Header";
import Footer from "./HomePage/Footer/Footer";

function App() {
  return (
    <Router>
      <Header  index={2}/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/news" element={<News />} />
        <Route path="/details/:id" element={<Details />} />
        <Route path="/contactUs" element={<ContactUs />} />
        <Route path="/collage" element={<Collage />} />
        <Route path="/programs" element={<Programs />} />
      </Routes>
            <Footer />

    </Router>
    
  );
}

export default App;
