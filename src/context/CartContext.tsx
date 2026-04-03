
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ProductVariant } from '@/app/lib/products';

export type CartItem = {
  productId: string;
  variantId: string;
  name: string;
  image: string;
  weight: string;
  price: number;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (product: Product, variant: ProductVariant) => void;
  removeFromCart: (variantId: string) => void;
  updateQuantity: (variantId: string, delta: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // تحميل السلة من التخزين المحلي عند البداية
  useEffect(() => {
    const savedCart = localStorage.getItem('salamat_cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to load cart", e);
      }
    }
  }, []);

  // حفظ السلة عند كل تغيير
  useEffect(() => {
    localStorage.setItem('salamat_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, variant: ProductVariant) => {
    setItems(prev => {
      const existing = prev.find(i => i.variantId === variant.id);
      if (existing) {
        return prev.map(i => i.variantId === variant.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, {
        productId: product.id,
        variantId: variant.id,
        name: product.name,
        image: product.image,
        weight: variant.weight,
        price: variant.price,
        quantity: 1
      }];
    });
  };

  const removeFromCart = (variantId: string) => {
    setItems(prev => prev.filter(i => i.variantId !== variantId));
  };

  const updateQuantity = (variantId: string, delta: number) => {
    setItems(prev => prev.map(i => {
      if (i.variantId === variantId) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
