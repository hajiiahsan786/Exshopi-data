import React, { useState } from 'react';
import { Search, Package, Truck, CheckCircle2, Clock, MapPin, ChevronRight, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TrackingStep {
  status: string;
  location: string;
  date: string;
  time: string;
  completed: boolean;
  current: boolean;
}

interface OrderDetails {
  id: string;
  status: 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered';
  estimatedDelivery: string;
  carrier: string;
  trackingNumber: string;
  steps: TrackingStep[];
}

export function TrackOrder() {
  const [orderId, setOrderId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [orderData, setOrderData] = useState<OrderDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setIsSearching(true);
    setError(null);

    // Simulate API call
    setTimeout(() => {
      if (orderId.toLowerCase() === 'error') {
        setError('Order not found. Please check the ID and try again.');
        setOrderData(null);
      } else {
        setOrderData({
          id: orderId.toUpperCase(),
          status: 'Shipped',
          estimatedDelivery: 'March 25, 2026',
          carrier: 'Aramex Express',
          trackingNumber: 'AX-982734120',
          steps: [
            { status: 'Order Placed', location: 'Dubai, UAE', date: 'Mar 22, 2026', time: '10:30 AM', completed: true, current: false },
            { status: 'Processing', location: 'Warehouse - Jebel Ali', date: 'Mar 22, 2026', time: '02:15 PM', completed: true, current: false },
            { status: 'Shipped', location: 'Sorting Facility - Dubai', date: 'Mar 23, 2026', time: '09:00 AM', completed: true, current: true },
            { status: 'Out for Delivery', location: 'Local Hub', date: 'Pending', time: '-', completed: false, current: false },
            { status: 'Delivered', location: 'Customer Address', date: 'Pending', time: '-', completed: false, current: false },
          ]
        });
      }
      setIsSearching(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-violet-100 text-violet-700 text-xs font-black uppercase tracking-wider mb-6 border border-violet-200"
          >
            <Truck size={14} />
            Real-time Tracking
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight"
          >
            Track Your Order
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-lg font-medium"
          >
            Enter your order ID to see the current status of your package.
          </motion.p>
        </div>

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 mb-12"
        >
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Enter Order ID (e.g. EX-123456)"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 font-bold placeholder:text-slate-400 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="bg-slate-900 hover:bg-violet-600 text-white px-10 py-4 rounded-2xl font-black transition-all shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isSearching ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Track Now <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </motion.div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-rose-50 border border-rose-100 p-6 rounded-3xl flex items-center gap-4 text-rose-700 mb-8"
            >
              <div className="bg-rose-100 p-3 rounded-2xl">
                <AlertCircle size={24} />
              </div>
              <p className="font-bold">{error}</p>
            </motion.div>
          )}

          {orderData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Status Header */}
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-1">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Order ID</p>
                    <p className="text-2xl font-black text-slate-900">#{orderData.id}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Status</p>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-black">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      {orderData.status}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Estimated Delivery</p>
                    <p className="text-2xl font-black text-slate-900">{orderData.estimatedDelivery}</p>
                  </div>
                </div>
              </div>

              {/* Tracking Timeline */}
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
                <h3 className="text-xl font-black text-slate-900 mb-10 flex items-center gap-3">
                  <Package className="text-violet-600" /> Shipment Progress
                </h3>

                <div className="relative space-y-12">
                  {/* Vertical Line */}
                  <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-slate-100" />

                  {orderData.steps.map((step, index) => (
                    <div key={index} className="relative flex gap-6 group">
                      <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-all duration-500 ${
                        step.completed ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'
                      }`}>
                        {step.completed ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                        {step.current && (
                          <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-25" />
                        )}
                      </div>

                      <div className="flex-1 pt-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                          <h4 className={`font-black text-lg ${step.completed ? 'text-slate-900' : 'text-slate-400'}`}>
                            {step.status}
                          </h4>
                          <div className="flex items-center gap-4 text-sm font-bold text-slate-500">
                            <span className="flex items-center gap-1.5"><Clock size={14} /> {step.time}</span>
                            <span className="flex items-center gap-1.5"><MapPin size={14} /> {step.location}</span>
                          </div>
                        </div>
                        <p className="text-sm font-medium text-slate-400">{step.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Carrier Info */}
              <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
                    <Truck size={32} className="text-violet-400" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Carrier</p>
                    <p className="text-xl font-black">{orderData.carrier}</p>
                  </div>
                </div>
                <div className="text-center md:text-right">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Tracking Number</p>
                  <p className="text-xl font-black font-mono tracking-wider">{orderData.trackingNumber}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FAQ / Help */}
        {!orderData && !isSearching && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm">
              <h4 className="font-black text-slate-900 mb-2">Where is my order ID?</h4>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                You can find your order ID in the confirmation email sent to you after purchase, or in your account dashboard under 'My Orders'.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm">
              <h4 className="font-black text-slate-900 mb-2">Tracking not updating?</h4>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                Tracking information may take up to 24 hours to appear after your order has been shipped. Please check back later.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
