
"use client";

import Link from 'next/link';
import { ShoppingCart, User, Search, Menu, X, Mail, Phone, Command } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithRedirect, onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { totalItems } = useCart();

  useEffect(() => {
    // Listen for Firebase Auth changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
    };
  }, []);

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    try {
      await signInWithRedirect(auth, googleProvider);
      // لن نغلق النافذة أو نوقف التحميل هنا، لأن الصفحة ستتحدث وتنتقل لموقع جوجل آلياً
    } catch (error: any) {
      console.error("Login failed", error);
      alert("عذراً، فشل التحويل لتسجيل الدخول: " + (error.message || "تأكد من إعدادات Firebase"));
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-background/95 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link href="/" className="group flex flex-col">
            <span className="font-headline text-2xl md:text-3xl font-bold text-primary tracking-tighter leading-none">
              تمور السلامات
            </span>
            <span className="text-[10px] text-muted-foreground tracking-[0.3em] font-bold uppercase group-hover:text-accent transition-colors">
              AL-SALAMAT DATES
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8 font-bold">
            <Link href="/catalog" className="text-sm hover:text-primary transition-colors">المتجر</Link>
            <Link href="/#story" className="text-sm hover:text-primary transition-colors">تراثنا</Link>
            <Link href="/wholesale" className="text-sm hover:text-primary transition-colors">طلب الجملة</Link>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)} className="hidden sm:flex hover:bg-primary/10">
            <Search className="w-5 h-5 text-primary" />
          </Button>
          
          {user ? (
            <div className="relative group cursor-pointer" onClick={handleLogout}>
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || "User"} className="w-9 h-9 rounded-full border-2 border-primary/20 transition-transform group-hover:scale-105" />
              ) : (
                <div className="w-9 h-9 flex items-center justify-center bg-primary rounded-full text-primary-foreground font-bold border-2 border-primary/20 transition-transform group-hover:scale-105">
                  {user.displayName?.charAt(0) || <User className="w-5 h-5" />}
                </div>
              )}
              {/* Tooltip hint for logout */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg border border-border">
                تسجيل الخروج
              </div>
            </div>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => setIsAuthOpen(true)} className="hover:bg-primary/10">
              <User className="w-5 h-5 text-primary" />
            </Button>
          )}

          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative hover:bg-primary/10">
              <ShoppingCart className="w-5 h-5 text-primary" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-[10px] flex items-center justify-center text-white rounded-full font-bold animate-in zoom-in duration-300">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-5 h-5 text-primary" />
          </Button>
        </div>
      </div>

      {/* Modals via AnimatePresence */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-start justify-center pt-32 px-4"
          >
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="bg-card w-full max-w-2xl rounded-[2rem] p-4 shadow-2xl relative border border-border"
            >
              <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)} className="absolute left-4 top-1/2 -translate-y-1/2 hover:bg-muted">
                <X className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-4 pr-4 border-r-4 border-primary">
                <Search className="w-6 h-6 text-primary" />
                <input 
                  autoFocus
                  type="text" 
                  placeholder="ابحث عن العجوة، المجدول..." 
                  className="flex-1 bg-transparent border-none text-xl outline-none py-4 text-foreground placeholder:text-muted-foreground font-medium"
                />
              </div>
            </motion.div>
          </motion.div>
        )}

        {isAuthOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-card w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl relative border border-border text-center overflow-hidden"
            >
              <Button variant="ghost" size="icon" onClick={() => setIsAuthOpen(false)} className="absolute left-6 top-6 hover:bg-muted rounded-full">
                <X className="w-5 h-5 text-muted-foreground" />
              </Button>
              
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="w-10 h-10 text-primary" />
              </div>
              
              <h2 className="text-3xl font-headline font-bold mb-2">أهلاً بك في السلامات</h2>
              <p className="text-muted-foreground mb-10">سجل دخولك لتجربة تسوق شخصية وفاخرة.</p>

              <div className="space-y-4">
                <Button 
                  onClick={handleGoogleLogin}
                  disabled={isLoggingIn}
                  className="w-full h-auto py-5 rounded-2xl flex items-center justify-center gap-3 text-lg font-bold shadow-lg hover:scale-[1.02] transition-transform"
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6 bg-white rounded-full p-1"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"></path><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"></path></svg>
                  {isLoggingIn ? "جاري تسجيل الدخول..." : "التسجيل باستخدام Google"}
                </Button>
                
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground font-black">قريباً</span>
                  </div>
                </div>

                <Button variant="outline" disabled className="w-full h-auto py-5 rounded-2xl flex items-center justify-center gap-3 text-lg font-bold opacity-60">
                  <Phone className="w-5 h-5" />
                  الدخول برقم الهاتف
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
