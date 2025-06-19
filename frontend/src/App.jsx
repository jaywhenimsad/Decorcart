import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './components/Cart';
import Checkout from "./pages/Checkout";
import AdminDashboard from './pages/admin/admindashboard';
import { CartProvider } from './context/CartContext';
import ProfilePage from './pages/ProfilePage';

function App() {
  const location = useLocation();

  // Check if the current route starts with /admin
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <CartProvider>
      {/* Only show Navbar and Footer if not on admin route */}
      {!isAdminRoute && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path='/profile' element={<ProfilePage/>}/>
      </Routes>

      {!isAdminRoute && <Footer />}
    </CartProvider>
  );
}

export default App;
