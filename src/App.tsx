import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Index from "./pages/Index";
import Properties from "./pages/Properties";
import Locations from "./pages/Locations";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <BrowserRouter>
      {/* Header */}
      <header className="bg-gray-900 text-white p-4 shadow-md">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-2xl font-bold text-emerald-400">KenyaHomes</div>
          <ul className="flex gap-6">
            <li>
              <Link to="/" className="hover:text-emerald-300">Home</Link>
            </li>
            <li>
              <Link to="/properties" className="hover:text-emerald-300">Properties</Link>
            </li>
            <li>
              <Link to="/locations" className="hover:text-emerald-300">Locations</Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-emerald-300">About Us</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-emerald-300">Contact</Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* Pages */}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/locations" element={<Locations />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
