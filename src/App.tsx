import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { ProductListing } from './pages/ProductListing';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { AdminDashboard } from './pages/AdminDashboard';
import { Account } from './pages/Account';
import { VendorStorefront } from './pages/VendorStorefront';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsConditions } from './pages/TermsConditions';
import { ReturnPolicy } from './pages/ReturnPolicy';
import { ShippingPolicy } from './pages/ShippingPolicy';
import { TrackOrder } from './pages/TrackOrder';
import { auth, onAuthStateChanged, db, doc, getDoc, setDoc, Timestamp } from './firebase';
import { useAuthStore } from './store/auth';

export default function App() {
  const { setUser, setRole, setLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        try {
          const userRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userRef);
          
          if (userDoc.exists()) {
            setRole(userDoc.data().role);
            // Update last login
            await setDoc(userRef, {
              lastLogin: Timestamp.now(),
              photoURL: user.photoURL || userDoc.data().photoURL
            }, { merge: true });
          } else {
            // Create user document if it doesn't exist (e.g. first time login)
            await setDoc(userRef, {
              uid: user.uid,
              fullName: user.displayName || '',
              email: user.email || '',
              photoURL: user.photoURL || '',
              role: 'customer',
              createdAt: Timestamp.now(),
              lastLogin: Timestamp.now()
            });
            setRole('customer');
          }
        } catch (error) {
          console.error('Error fetching/updating user data:', error);
          setRole('customer');
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setRole, setLoading]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="category/:category" element={<ProductListing />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="account" element={<Account />} />
          <Route path="vendor-dashboard" element={<AdminDashboard />} />
          <Route path="vendor/:vendorId" element={<VendorStorefront />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
          <Route path="terms" element={<TermsConditions />} />
          <Route path="returns" element={<ReturnPolicy />} />
          <Route path="shipping" element={<ShippingPolicy />} />
          <Route path="track-order" element={<TrackOrder />} />
        </Route>
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

