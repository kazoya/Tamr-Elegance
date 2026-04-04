
"use client";

import { Navbar } from '@/components/layout/Navbar';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/app/lib/placeholder-images';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { useState, useEffect } from 'react';

export default function CartPage() {
  const { items, totalPrice, updateQuantity, removeFromCart, totalItems } = useCart();
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleCheckout = () => {
    if (items.length === 0) return;
    
    let orderText = "مرحباً، أود إتمام هذا الطلب من تمور السلامات الأصيلة:\n\n";
    
    if (user) {
      orderText += `👤 معلومات العميل:\n`;
      orderText += `🔸 الاسم: ${user.displayName || "عميل مميز"}\n`;
      orderText += `🔸 البريد: ${user.email}\n`;
      orderText += `-------------------\n\n`;
    }

    items.forEach((item, index) => {
      orderText += `${index + 1}. ${item.name} (${item.weight}) - الكمية: ${item.quantity}\n`;
    });
    orderText += `\nالإجمالي النهائي: ${totalPrice} دينار أردني\n`;
    orderText += "يرجى تأكيد الطلب، وشكراً.";

    const phone = '962799967433';
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(orderText)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <header className="mb-12 text-right">
            <h1 className="text-4xl md:text-5xl font-headline font-bold mb-4">سلة المشتريات</h1>
            <p className="text-muted-foreground text-lg">لديك {totalItems} منتجات في انتظارك.</p>
          </header>

          {items.length === 0 ? (
            <div className="py-32 text-center bg-card rounded-[3rem] border border-dashed border-primary/20">
              <div className="bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
                <ShoppingBag className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-headline font-bold mb-4">السلة فارغة حالياً</h2>
              <p className="text-muted-foreground mb-12 max-w-md mx-auto">
                يبدو أنك لم تضف أي شيء بعد. استكشف مجموعتنا الفاخرة من التمور لتجد ما يناسب ذوقك.
              </p>
              <Link href="/catalog">
                <Button className="px-12 py-7 rounded-2xl font-bold text-lg">
                  تصفح المتجر
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
              {/* قائمة المنتجات */}
              <div className="lg:col-span-2 space-y-6">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => {
                    const img = PlaceHolderImages.find(i => i.id === item.image);
                    return (
                      <motion.div
                        key={item.variantId}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-card p-6 rounded-3xl border border-border/50 flex flex-col sm:flex-row items-center gap-8 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="relative w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0">
                          <Image
                            src={img?.imageUrl || ''}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        
                        <div className="flex-1 text-center sm:text-right">
                          <h3 className="text-xl font-headline font-bold mb-1">{item.name}</h3>
                          <p className="text-sm text-muted-foreground font-bold mb-4">{item.weight}</p>
                          <div className="flex items-center justify-center sm:justify-end gap-6">
                            <div className="flex items-center bg-muted/50 rounded-xl px-2 py-1 border border-border">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 hover:bg-primary/10"
                                onClick={() => updateQuantity(item.variantId, 1)}
                              >
                                <Plus className="w-4 h-4 text-primary" />
                              </Button>
                              <span className="w-8 text-center font-bold text-lg">{item.quantity}</span>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 hover:bg-primary/10"
                                onClick={() => updateQuantity(item.variantId, -1)}
                              >
                                <Minus className="w-4 h-4 text-primary" />
                              </Button>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-destructive hover:bg-destructive/10"
                              onClick={() => removeFromCart(item.variantId)}
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          </div>
                        </div>

                        <div className="text-center sm:text-left min-w-[100px]">
                          <p className="text-2xl font-headline font-bold text-primary">
                            {item.price * item.quantity} د.أ
                          </p>
                          <p className="text-[10px] text-muted-foreground uppercase font-black mt-1">المجموع</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                
                <Link href="/catalog" className="inline-flex items-center gap-2 text-primary font-bold hover:underline py-4">
                  <ArrowRight className="w-4 h-4" />
                  العودة للتسوق
                </Link>
              </div>

              {/* ملخص الطلب */}
              <div className="bg-card p-10 rounded-[3rem] border border-border/50 shadow-xl space-y-10 sticky top-32">
                <h2 className="text-2xl font-headline font-bold border-b border-border pb-6">ملخص الطلب</h2>
                
                <div className="space-y-4 text-lg">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-medium">عدد المنتجات</span>
                    <span className="font-bold">{totalItems}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-medium">قيمة المشتريات</span>
                    <span className="font-bold">{totalPrice} د.أ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-medium">التوصيل</span>
                    <span className="text-accent font-bold">مجاني</span>
                  </div>
                  <div className="pt-6 border-t border-border flex justify-between items-end">
                    <span className="text-xl font-bold">الإجمالي النهائي</span>
                    <div className="text-right">
                      <span className="text-4xl font-headline font-bold text-primary">{totalPrice}</span>
                      <span className="text-sm font-bold text-primary mr-2">د.أ</span>
                    </div>
                  </div>
                </div>

                <Button onClick={handleCheckout} className="w-full h-auto py-6 rounded-2xl text-xl font-black shadow-2xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-3">
                  <ShoppingBag className="w-6 h-6" />
                  إتمام الطلب عبر واتساب
                </Button>
                
                <div className="pt-6 text-center">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                    ضمان جودة عائلة السلامات
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-muted py-12 border-t mt-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm font-medium">تمور السلامات - تجربة تسوق آمنة وفاخرة.</p>
        </div>
      </footer>
    </div>
  );
}
