import Home from "./HomePage/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import News from "./NewsPage/News"
import AddNews from "./NewsPage/AddNews";
import Details from "./NewsDetails/Details";
import ContactUs from "./ContactUsPage/ContactUs"
import Collage from "./Collages/Collages"
import Programs from "./ProgramsPage/Programs";
import Login from "./LoginPage/Login";
import Header from "./HomePage/Header/Header";
import Footer from "./HomePage/Footer/Footer";

function App() {
  return (
    <Router>
      <Header  index={2}/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/add" element={<AddNews />} />
        <Route path="/details/:id" element={<Details />} />
        <Route path="/contactUs" element={<ContactUs />} />
        <Route path="/collage" element={<Collage />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/login" element={<Login />} />
      </Routes>
            <Footer />

    </Router>
    
  );
}

export default App;
