import { Routes, Route, Navigate } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import Layout from './components/Layout'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Learn from './pages/Learn'
import HowItWorks from './pages/HowItWorks'
import Cart from './pages/Cart'
import Wishlist from './pages/Wishlist'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import Compare from './pages/Compare'
import Login from './pages/Login'
import ProductDetail from './pages/ProductDetail'

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/about" element={<Navigate to="/how-it-works" replace />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/login" element={<Login />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
        </Route>
      </Routes>
    </>
  )
}
