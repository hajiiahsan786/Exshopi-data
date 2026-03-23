import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, CreditCard, Banknote, Truck, MapPin, ChevronRight, CheckCircle2, Lock, Smartphone, SplitSquareHorizontal, ExternalLink, CheckCircle } from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { useCartStore } from '../store/cart';

export function Checkout() {
  const { items, totalPrice, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderId, setOrderId] = useState('');

  const generateInvoice = (id: string) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(139, 92, 246); // Violet
    doc.text('EXSHOPI.', 20, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Invoice Receipt', 20, 30);
    doc.text(`Order ID: #${id}`, 20, 35);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 40);

    // Customer Info
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text('Bill To:', 20, 55);
    doc.setFontSize(10);
    doc.text('John Doe', 20, 62);
    doc.text('Downtown Dubai, Burj Khalifa', 20, 67);
    doc.text('Dubai, UAE', 20, 72);
    doc.text('+971 50 123 4567', 20, 77);

    // Table
    const tableData = items.map(item => [
      item.title,
      item.quantity.toString(),
      `AED ${item.price}`,
      `AED ${item.price * item.quantity}`
    ]);

    (doc as any).autoTable({
      startY: 90,
      head: [['Product', 'Qty', 'Price', 'Total']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillStyle: [139, 92, 246] },
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;
    const shipping = shippingMethod === 'express' ? 25 : 0;
    const cod = paymentMethod === 'cod' ? 15 : 0;
    const total = totalPrice() + shipping + cod;

    doc.text(`Subtotal: AED ${totalPrice()}`, 140, finalY);
    doc.text(`Shipping: AED ${shipping}`, 140, finalY + 7);
    if (cod > 0) doc.text(`COD Fee: AED ${cod}`, 140, finalY + 14);
    doc.setFontSize(14);
    doc.text(`Grand Total: AED ${total}`, 140, finalY + 25);

    doc.save(`EXSHOPI-Invoice-${id}.pdf`);
  };

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newOrderId = `EXS-${Math.floor(Math.random() * 1000000)}`;
    setOrderId(newOrderId);
    generateInvoice(newOrderId);
    setStep(4);
    clearCart();
    setIsPlacingOrder(false);
  };

  if (step === 4) {
    return (
      <div className="min-h-[70vh] bg-slate-50 flex items-center justify-center py-12">
        <div className="container mx-auto px-4 text-center max-w-lg">
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm border border-emerald-200 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full animate-pulse"></div>
            <CheckCircle2 size={48} className="relative z-10" />
          </div>
          <h2 className="text-3xl font-black mb-4 text-slate-900 tracking-tight">Order Placed Successfully!</h2>
          <p className="text-slate-500 mb-4 font-medium leading-relaxed">Thank you for shopping with EXSHOPI. Your order <span className="font-bold text-slate-900">#{orderId}</span> has been confirmed and is being processed.</p>
          <p className="text-sm text-slate-400 mb-8">Your invoice has been downloaded automatically.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => generateInvoice(orderId)}
              className="bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-2xl font-bold transition-all hover:bg-slate-50 flex items-center justify-center gap-2"
            >
              <ExternalLink size={18} /> Download Invoice
            </button>
            <Link to="/" className="bg-slate-900 hover:bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold transition-all inline-block shadow-lg shadow-slate-900/20 hover:shadow-emerald-600/30 hover:-translate-y-0.5">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-12">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Checkout</h1>
          <Lock size={20} className="text-slate-400" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Checkout Steps */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Step 1: Shipping Address */}
            <div className={`glass p-6 md:p-8 rounded-[2rem] transition-all duration-300 ${step === 1 ? 'border-violet-500 shadow-[0_8px_30px_rgba(139,92,246,0.15)]' : 'border-slate-200/50 opacity-70 hover:opacity-100'}`}>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black flex items-center gap-3 text-slate-900">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step === 1 ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20' : 'bg-slate-100 text-slate-500'}`}>1</span>
                  Shipping Address
                </h2>
                {step > 1 && (
                  <button onClick={() => setStep(1)} className="text-sm text-violet-600 font-bold hover:underline">Edit</button>
                )}
              </div>

              {step === 1 ? (
                <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">First Name</label>
                      <input type="text" required className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all text-sm font-medium" placeholder="John" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Last Name</label>
                      <input type="text" required className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all text-sm font-medium" placeholder="Doe" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Mobile Number</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-slate-200 bg-slate-100 text-slate-600 font-bold text-sm">
                        +971
                      </span>
                      <input type="tel" required className="flex-1 p-3.5 bg-slate-50 border border-slate-200 rounded-r-xl focus:bg-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all text-sm font-medium" placeholder="50 123 4567" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Emirate</label>
                    <select required className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all text-sm font-medium appearance-none">
                      <option value="">Select Emirate</option>
                      <option value="dubai">Dubai</option>
                      <option value="abudhabi">Abu Dhabi</option>
                      <option value="sharjah">Sharjah</option>
                      <option value="ajman">Ajman</option>
                      <option value="fujairah">Fujairah</option>
                      <option value="rak">Ras Al Khaimah</option>
                      <option value="uaq">Umm Al Quwain</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Address Details (Area, Street, Building)</label>
                    <textarea required rows={3} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all text-sm font-medium resize-none" placeholder="e.g. Downtown Dubai, Sheikh Mohammed bin Rashid Blvd, Burj Khalifa, Apt 101"></textarea>
                  </div>

                  <div className="pt-6 border-t border-slate-200/50">
                    <button type="submit" className="w-full md:w-auto bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white px-8 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] group">
                      Continue to Payment <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-sm text-slate-600 bg-slate-50 p-5 rounded-2xl flex items-start gap-4 border border-slate-100">
                  <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-100 shrink-0">
                    <MapPin size={20} className="text-violet-600" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-slate-900 text-base">John Doe <span className="text-slate-500 font-medium text-sm ml-2">(+971 50 123 4567)</span></p>
                    <p className="font-medium">Downtown Dubai, Sheikh Mohammed bin Rashid Blvd, Burj Khalifa, Apt 101</p>
                    <p className="font-medium">Dubai, United Arab Emirates</p>
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: Shipping Method */}
            <div className={`glass p-6 md:p-8 rounded-[2rem] transition-all duration-300 ${step === 2 ? 'border-violet-500 shadow-[0_8px_30px_rgba(139,92,246,0.15)]' : 'border-slate-200/50 opacity-70 hover:opacity-100'}`}>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black flex items-center gap-3 text-slate-900">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step === 2 ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20' : 'bg-slate-100 text-slate-500'}`}>2</span>
                  Shipping Method
                </h2>
                {step > 2 && (
                  <button onClick={() => setStep(2)} className="text-sm text-violet-600 font-bold hover:underline">Edit</button>
                )}
              </div>

              {step === 2 ? (
                <div className="space-y-4">
                  <label 
                    onClick={() => setShippingMethod('standard')}
                    className={`flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${shippingMethod === 'standard' ? 'border-violet-500 bg-violet-50/30' : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'}`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${shippingMethod === 'standard' ? 'border-violet-600' : 'border-slate-300'}`}>
                      {shippingMethod === 'standard' && <div className="w-2.5 h-2.5 bg-violet-600 rounded-full"></div>}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-bold text-slate-900 text-base">Standard Delivery</div>
                          <div className="text-sm text-slate-500 mt-1 font-medium">Delivered in 2-3 business days</div>
                        </div>
                        <div className="font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg text-xs uppercase tracking-wider">Free</div>
                      </div>
                    </div>
                  </label>

                  <label 
                    onClick={() => setShippingMethod('express')}
                    className={`flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${shippingMethod === 'express' ? 'border-violet-500 bg-violet-50/30' : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'}`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${shippingMethod === 'express' ? 'border-violet-600' : 'border-slate-300'}`}>
                      {shippingMethod === 'express' && <div className="w-2.5 h-2.5 bg-violet-600 rounded-full"></div>}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-bold text-slate-900 text-base">Express Delivery</div>
                          <div className="text-sm text-slate-500 mt-1 font-medium">Same day delivery (order before 2 PM)</div>
                        </div>
                        <div className="font-black text-slate-900">AED 25.00</div>
                      </div>
                    </div>
                  </label>

                  <div className="pt-6 border-t border-slate-200/50 flex gap-4">
                    <button onClick={() => setStep(3)} className="w-full md:w-auto bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white px-8 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] group">
                      Continue to Payment <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              ) : step > 2 ? (
                <div className="text-sm text-slate-600 bg-slate-50 p-5 rounded-2xl flex items-start gap-4 border border-slate-100">
                  <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-100 shrink-0">
                    <Truck size={20} className="text-violet-600" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-slate-900 text-base">{shippingMethod === 'standard' ? 'Standard Delivery' : 'Express Delivery'}</p>
                    <p className="font-medium">{shippingMethod === 'standard' ? 'Delivered in 2-3 business days' : 'Same day delivery'}</p>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Step 3: Payment Method */}
            <div className={`glass p-6 md:p-8 rounded-[2rem] transition-all duration-300 ${step === 3 ? 'border-violet-500 shadow-[0_8px_30px_rgba(139,92,246,0.15)]' : 'border-slate-200/50 opacity-70 hover:opacity-100'}`}>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black flex items-center gap-3 text-slate-900">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step === 3 ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20' : 'bg-slate-100 text-slate-500'}`}>3</span>
                  Payment Method
                </h2>
              </div>

              {step === 3 && (
                <div className="space-y-4">
                  <label 
                    onClick={() => setPaymentMethod('card')}
                    className={`flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-violet-500 bg-violet-50/30' : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'}`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${paymentMethod === 'card' ? 'border-violet-600' : 'border-slate-300'}`}>
                      {paymentMethod === 'card' && <div className="w-2.5 h-2.5 bg-violet-600 rounded-full"></div>}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-slate-900 flex items-center gap-2 text-base">
                        <CreditCard size={20} className={paymentMethod === 'card' ? 'text-violet-600' : 'text-slate-400'} /> Credit / Debit Card
                      </div>
                      <div className="text-sm text-slate-500 mt-1 font-medium">Pay securely with Visa, Mastercard, or Amex</div>
                    </div>
                  </label>

                  {paymentMethod === 'card' && (
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-5 ml-9">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Card Number</label>
                        <input type="text" className="w-full p-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all text-sm font-medium" placeholder="0000 0000 0000 0000" />
                      </div>
                      <div className="grid grid-cols-2 gap-5">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Expiry Date</label>
                          <input type="text" className="w-full p-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all text-sm font-medium" placeholder="MM/YY" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">CVV</label>
                          <input type="text" className="w-full p-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all text-sm font-medium" placeholder="123" />
                        </div>
                      </div>
                    </div>
                  )}

                  <label 
                    onClick={() => setPaymentMethod('paytabs')}
                    className={`flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'paytabs' ? 'border-violet-500 bg-violet-50/30' : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'}`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${paymentMethod === 'paytabs' ? 'border-violet-600' : 'border-slate-300'}`}>
                      {paymentMethod === 'paytabs' && <div className="w-2.5 h-2.5 bg-violet-600 rounded-full"></div>}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-slate-900 flex items-center gap-2 text-base">
                        <CreditCard size={20} className={paymentMethod === 'paytabs' ? 'text-violet-600' : 'text-slate-400'} /> PayTabs (UAE & GCC)
                      </div>
                      <div className="text-sm text-slate-500 mt-1 font-medium">Fast and secure regional payment gateway</div>
                    </div>
                  </label>

                  <label 
                    onClick={() => setPaymentMethod('telr')}
                    className={`flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'telr' ? 'border-violet-500 bg-violet-50/30' : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'}`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${paymentMethod === 'telr' ? 'border-violet-600' : 'border-slate-300'}`}>
                      {paymentMethod === 'telr' && <div className="w-2.5 h-2.5 bg-violet-600 rounded-full"></div>}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-slate-900 flex items-center gap-2 text-base">
                        <CreditCard size={20} className={paymentMethod === 'telr' ? 'text-violet-600' : 'text-slate-400'} /> Telr
                      </div>
                      <div className="text-sm text-slate-500 mt-1 font-medium">Secure online payments for UAE businesses</div>
                    </div>
                  </label>

                  <label 
                    onClick={() => setPaymentMethod('applepay')}
                    className={`flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'applepay' ? 'border-violet-500 bg-violet-50/30' : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'}`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${paymentMethod === 'applepay' ? 'border-violet-600' : 'border-slate-300'}`}>
                      {paymentMethod === 'applepay' && <div className="w-2.5 h-2.5 bg-violet-600 rounded-full"></div>}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-slate-900 flex items-center gap-2 text-base">
                        <Smartphone size={20} className={paymentMethod === 'applepay' ? 'text-violet-600' : 'text-slate-400'} /> Apple Pay
                      </div>
                      <div className="text-sm text-slate-500 mt-1 font-medium">Fast and secure checkout with Apple Pay</div>
                    </div>
                  </label>

                  <label 
                    onClick={() => setPaymentMethod('tabby')}
                    className={`flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'tabby' ? 'border-violet-500 bg-violet-50/30' : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'}`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${paymentMethod === 'tabby' ? 'border-violet-600' : 'border-slate-300'}`}>
                      {paymentMethod === 'tabby' && <div className="w-2.5 h-2.5 bg-violet-600 rounded-full"></div>}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-slate-900 flex items-center gap-2 text-base">
                        <SplitSquareHorizontal size={20} className={paymentMethod === 'tabby' ? 'text-violet-600' : 'text-slate-400'} /> Split in 4 (Tabby / Tamara)
                      </div>
                      <div className="text-sm text-slate-500 mt-1 font-medium">Pay 25% today, and the rest over 3 months. No interest.</div>
                    </div>
                  </label>

                  <label 
                    onClick={() => setPaymentMethod('cod')}
                    className={`flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-violet-500 bg-violet-50/30' : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'}`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${paymentMethod === 'cod' ? 'border-violet-600' : 'border-slate-300'}`}>
                      {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 bg-violet-600 rounded-full"></div>}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-slate-900 flex items-center gap-2 text-base">
                        <Banknote size={20} className={paymentMethod === 'cod' ? 'text-violet-600' : 'text-slate-400'} /> Cash on Delivery (COD)
                      </div>
                      <div className="text-sm text-slate-500 mt-1 font-medium">Pay with cash when your order is delivered</div>
                    </div>
                  </label>
                </div>
              )}
            </div>

          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="glass-dark border border-white/10 p-8 rounded-[2rem] sticky top-24 shadow-[0_8px_30px_rgba(6,182,212,0.15)] neon-border">
              <h2 className="text-xl font-black mb-8 text-white">Order Summary</h2>
              
              <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="w-16 h-16 bg-white/50 backdrop-blur-sm rounded-xl p-2 border border-slate-100 shrink-0 relative group-hover:bg-violet-50/30 transition-colors">
                      <img src={item.image} alt={item.title} className="w-full h-full object-contain group-hover:scale-110 transition-transform drop-shadow-sm" />
                      <span className="absolute -top-2 -right-2 bg-gradient-to-r from-violet-600 to-cyan-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-slate-300 line-clamp-2 leading-tight group-hover:text-cyan-400 transition-colors">{item.title}</div>
                      <div className="text-sm font-black text-white mt-1">AED {item.price * item.quantity}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 text-sm font-medium mb-8 border-t border-white/10 pt-6">
                <div className="flex justify-between text-slate-300">
                  <span>Subtotal</span>
                  <span className="font-bold text-white">AED {totalPrice()}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Shipping Fee</span>
                  {shippingMethod === 'standard' ? (
                    <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px] bg-emerald-500/20 px-2 py-1 rounded-md">Free</span>
                  ) : (
                    <span className="font-bold text-white">AED 25.00</span>
                  )}
                </div>
                {paymentMethod === 'cod' && (
                  <div className="flex justify-between text-slate-300">
                    <span>COD Fee</span>
                    <span className="font-bold text-white">AED 15.00</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-300">
                  <span>VAT (5%)</span>
                  <span className="font-bold text-white">Included</span>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6 mb-8">
                <div className="flex justify-between items-end">
                  <span className="font-black text-white text-lg">Total</span>
                  <div className="text-right">
                    <span className="text-3xl font-black text-white tracking-tighter">
                      AED {totalPrice() + (paymentMethod === 'cod' ? 15 : 0) + (shippingMethod === 'express' ? 25 : 0)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="w-5 h-5 rounded border border-white/20 group-hover:border-violet-500 transition-colors flex items-center justify-center shrink-0 mt-0.5 bg-white/5">
                    <input type="checkbox" required className="opacity-0 absolute" id="terms" />
                  </div>
                  <span className="text-xs font-medium text-slate-400 group-hover:text-slate-300 transition-colors leading-relaxed">
                    I agree to the <Link to="/terms" className="text-violet-400 hover:underline">Terms & Conditions</Link>, <Link to="/privacy" className="text-violet-400 hover:underline">Privacy Policy</Link>, and <Link to="/returns" className="text-violet-400 hover:underline">Return Policy</Link>.
                  </span>
                </label>
              </div>

              <button 
                onClick={handlePlaceOrder}
                disabled={step !== 3 || isPlacingOrder}
                className={`w-full py-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2 mb-6 shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] ${step === 3 && !isPlacingOrder ? 'bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white' : 'bg-white/5 text-slate-500 cursor-not-allowed shadow-none border border-white/10'}`}
              >
                {isPlacingOrder ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle size={22} />
                    Place Order
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-3 text-xs font-medium text-slate-300 bg-white/5 p-4 rounded-xl border border-white/10">
                <ShieldCheck size={18} className="text-cyan-400 shrink-0" />
                <span>Your payment information is encrypted and secure.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
