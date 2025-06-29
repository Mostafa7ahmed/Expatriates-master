import Home from "./HomePage/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import News from "./NewsPage/News"
import AddNews from "./NewsPage/AddNews";
import EditNews from "./NewsPage/EditNews";
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
        <Route path="/news/edit/:id" element={<EditNews />} />
        <Route path="/details/:id" element={<Details />} />
        <Route path="/contactUs" element={<ContactUs />} />
        <Route path="/collage" element={<Collage />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer />
      
      {/* Toast Container for notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Router>
  );
}

export default App;
