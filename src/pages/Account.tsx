import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, MapPin, ShoppingBag, Heart, Bell, LogOut, Package, Shield, Settings, Plus, Edit2, Trash2, ChevronRight, ExternalLink, Clock, CheckCircle2, AlertCircle, Home as HomeIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuthStore } from '../store/auth';
import { auth, db, doc, getDoc, updateDoc, signOut } from '../firebase';

interface Address {
  id: string;
  type: 'Home' | 'Work' | 'Other';
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  isDefault: boolean;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: 'Delivered' | 'Processing' | 'Shipped' | 'Cancelled';
  items: number;
}

export function Account() {
  const navigate = useNavigate();
  const { user, role, setUser, setRole } = useAuthStore();
  const [activeSection, setActiveSection] = useState('profile');
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([
    { id: '1', type: 'Home', name: 'John Doe', phone: '+971 50 123 4567', addressLine1: 'Villa 12, Street 45', addressLine2: 'Jumeirah 1', city: 'Dubai', isDefault: true },
    { id: '2', type: 'Work', name: 'John Doe', phone: '+971 4 987 6543', addressLine1: 'Office 402, Building 5', addressLine2: 'Dubai Design District', city: 'Dubai', isDefault: false },
  ]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
        navigate('/');
      }
    };
    fetchUserData();
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setRole(null);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone
      });
      alert('Profile updated successfully!');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const orders: Order[] = [
    { id: 'EX-982734', date: 'Mar 15, 2026', total: 1299, status: 'Delivered', items: 2 },
    { id: 'EX-982110', date: 'Mar 10, 2026', total: 450, status: 'Processing', items: 1 },
    { id: 'EX-981552', date: 'Feb 28, 2026', total: 2100, status: 'Shipped', items: 3 },
  ];

  const menuItems = [
    { id: 'profile', icon: User, label: 'Profile Information' },
    { id: 'orders', icon: ShoppingBag, label: 'My Orders' },
    { id: 'addresses', icon: MapPin, label: 'Saved Addresses' },
    { id: 'wishlist', icon: Heart, label: 'Wishlist' },
    { id: 'track', icon: Package, label: 'Track Order' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'security', icon: Shield, label: 'Security Settings' },
  ];

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        if (isLoading) return <div className="flex items-center justify-center py-20"><div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div></div>;
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="w-20 h-20 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center mb-8 shadow-sm border border-violet-100">
              {userData?.photoURL ? (
                <img src={userData.photoURL} alt="" className="w-full h-full rounded-2xl object-cover" referrerPolicy="no-referrer" />
              ) : (
                <User size={32} />
              )}
            </div>
            <h2 className="text-2xl font-black mb-3 text-slate-900 tracking-tight">Profile Information</h2>
            <p className="text-slate-500 mb-10 font-medium leading-relaxed">Manage your personal information, security settings, and communication preferences.</p>
            
            <form className="space-y-6" onSubmit={handleProfileUpdate}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Full Name</label>
                  <input 
                    type="text" 
                    value={userData?.fullName || ''} 
                    onChange={(e) => setUserData({...userData, fullName: e.target.value})}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all text-sm font-medium text-slate-900" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={userData?.email || ''} 
                  onChange={(e) => setUserData({...userData, email: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all text-sm font-medium text-slate-900" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Mobile Number</label>
                <input 
                  type="tel" 
                  value={userData?.phone || ''} 
                  onChange={(e) => setUserData({...userData, phone: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all text-sm font-medium text-slate-900" 
                />
              </div>
              <div className="pt-6 border-t border-slate-100">
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="bg-slate-900 hover:bg-violet-600 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-slate-900/20 hover:shadow-violet-600/30 hover:-translate-y-0.5 disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </motion.div>
        );
      case 'orders':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">My Orders</h2>
                <p className="text-slate-500 font-medium">View and track your past purchases.</p>
              </div>
              <div className="bg-slate-100 px-4 py-2 rounded-xl text-sm font-bold text-slate-600">
                {orders.length} Orders
              </div>
            </div>

            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white border border-slate-100 rounded-2xl p-6 hover:border-violet-200 transition-all group cursor-pointer">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-violet-50 group-hover:text-violet-600 transition-colors">
                        <ShoppingBag size={24} />
                      </div>
                      <div>
                        <p className="font-black text-slate-900">Order #{order.id}</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{order.date} • {order.items} Items</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between md:justify-end gap-8">
                      <div className="text-right">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Amount</p>
                        <p className="font-black text-slate-900">AED {order.total.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                          order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' :
                          order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                          order.status === 'Shipped' ? 'bg-violet-100 text-violet-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {order.status}
                        </span>
                        <ChevronRight size={20} className="text-slate-300 group-hover:text-violet-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );
      case 'addresses':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Saved Addresses</h2>
                <p className="text-slate-500 font-medium">Manage your delivery locations for faster checkout.</p>
              </div>
              <button 
                onClick={() => { setEditingAddress(null); setIsAddressModalOpen(true); }}
                className="flex items-center gap-2 bg-slate-900 hover:bg-violet-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-slate-900/10"
              >
                <Plus size={20} /> Add New
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {addresses.map((addr) => (
                <div key={addr.id} className={`relative p-6 rounded-2xl border-2 transition-all ${addr.isDefault ? 'border-violet-500 bg-violet-50/30' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                  {addr.isDefault && (
                    <div className="absolute -top-3 left-6 bg-violet-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-violet-500/20">
                      Default Address
                    </div>
                  )}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400">
                        {addr.type === 'Home' ? <HomeIcon size={20} /> : addr.type === 'Work' ? <Shield size={20} /> : <MapPin size={20} />}
                      </div>
                      <div>
                        <p className="font-black text-slate-900">{addr.type}</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{addr.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => { setEditingAddress(addr); setIsAddressModalOpen(true); }}
                        className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-all"
                      >
                        <Edit2 size={18} />
                      </button>
                      {!addr.isDefault && (
                        <button 
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1 text-sm font-medium text-slate-600 mb-6">
                    <p>{addr.addressLine1}</p>
                    {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                    <p>{addr.city}, UAE</p>
                    <p className="pt-2 text-slate-400">{addr.phone}</p>
                  </div>
                  {!addr.isDefault && (
                    <button 
                      onClick={() => handleSetDefault(addr.id)}
                      className="text-xs font-black text-violet-600 uppercase tracking-wider hover:underline"
                    >
                      Set as Default
                    </button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        );
      case 'wishlist':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">My Wishlist</h2>
                <p className="text-slate-500 font-medium">Items you've saved for later.</p>
              </div>
              <Link to="/" className="text-violet-600 font-bold text-sm hover:underline">Continue Shopping</Link>
            </div>

            <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-slate-300 mb-6 shadow-sm">
                <Heart size={40} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Your wishlist is empty</h3>
              <p className="text-slate-500 font-medium mb-8">Start adding items you love to your wishlist!</p>
              <Link to="/" className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-slate-900/20 hover:bg-violet-600 transition-all">
                Explore Products
              </Link>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-12">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Account</h1>
          <Settings size={20} className="text-slate-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-4 lg:col-span-3">
            <div className="glass p-6 rounded-2xl sticky top-24">
              <div className="flex items-center gap-4 pb-6 border-b border-slate-200/50 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-blue-500 text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg shadow-violet-500/20 overflow-hidden">
                  {userData?.photoURL ? (
                    <img src={userData.photoURL} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    (userData?.fullName?.charAt(0) || user?.email?.charAt(0).toUpperCase())
                  )}
                </div>
                <div>
                  <p className="font-black text-slate-900 text-lg leading-tight">{userData?.fullName || 'User'}</p>
                  <p className="text-sm font-medium text-slate-500">{user?.email}</p>
                </div>
              </div>

              <nav className="space-y-1.5">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all text-sm font-bold ${
                      activeSection === item.id 
                        ? 'bg-violet-50 text-violet-700' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <item.icon size={18} className={activeSection === item.id ? 'text-violet-600' : 'text-slate-400'} />
                    {item.label}
                  </button>
                ))}
                <div className="pt-4 mt-4 border-t border-slate-100">
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-rose-50 text-rose-600 transition-colors text-sm font-bold"
                  >
                    <LogOut size={18} />
                    Sign Out
                  </button>
                </div>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-8 lg:col-span-9">
            <div className="glass p-8 md:p-12 rounded-[2rem] relative overflow-hidden min-h-[600px]">
              {/* Decorative gradient */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

              <div className="relative z-10">
                {renderSection()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      <AnimatePresence>
        {isAddressModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsAddressModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 md:p-10">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                    {editingAddress ? 'Edit Address' : 'Add New Address'}
                  </h3>
                  <button onClick={() => setIsAddressModalOpen(false)} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                    <Trash2 size={20} />
                  </button>
                </div>

                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsAddressModalOpen(false); }}>
                  <div className="grid grid-cols-3 gap-3">
                    {['Home', 'Work', 'Other'].map((type) => (
                      <button 
                        key={type}
                        type="button"
                        className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${type === 'Home' ? 'border-violet-500 bg-violet-50 text-violet-700' : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Full Name</label>
                      <input type="text" placeholder="e.g. John Doe" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all text-sm font-medium" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Mobile Number</label>
                      <input type="tel" placeholder="+971 50 123 4567" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all text-sm font-medium" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Address Line 1</label>
                      <input type="text" placeholder="Building, Street, Area" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all text-sm font-medium" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">City</label>
                        <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all text-sm font-medium">
                          <option>Dubai</option>
                          <option>Abu Dhabi</option>
                          <option>Sharjah</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Postal Code</label>
                        <input type="text" placeholder="Optional" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all text-sm font-medium" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 flex gap-4">
                    <button type="button" onClick={() => setIsAddressModalOpen(false)} className="flex-1 px-8 py-4 rounded-2xl font-bold text-slate-600 hover:bg-slate-100 transition-all">
                      Cancel
                    </button>
                    <button type="submit" className="flex-1 bg-slate-900 hover:bg-violet-600 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-slate-900/20">
                      {editingAddress ? 'Update Address' : 'Save Address'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
