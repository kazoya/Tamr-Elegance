
"use client";

import Image from 'next/image';
import { Product } from '@/app/lib/products';
import { PlaceHolderImages } from '@/app/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { ShoppingBag } from 'lucide-react';

export function ProductCard({ product }: { product: Product }) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  // حماية إضافية لضمان عدم حدوث خطأ find على undefined
  const imagesArray = PlaceHolderImages || [];
  const image = imagesArray.find(img => img.id === product.image);

  const handleAddToCart = () => {
    addToCart(product, selectedVariant);
    toast({
      title: "تمت الإضافة بنجاح",
      description: `${product.name} (${selectedVariant.weight}) أصبحت في سلتك الآن.`,
      className: "bg-background border-primary text-foreground font-bold",
    });
  };

  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="group flex flex-col bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-border/50"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        {image?.imageUrl ? (
          <Image
            src={image.imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            data-ai-hint={image?.imageHint || 'product'}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs p-4 text-center">
            صورة {product.name} قيد التحميل...
          </div>
        )}
        {product.featured && (
          <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground font-bold px-3 py-1">مختار لك</Badge>
        )}
      </div>
      
      <div className="p-8 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black">{product.category}</span>
          <span className="text-xl font-headline font-bold text-primary">{selectedVariant.price} د.أ</span>
        </div>
        <h3 className="text-2xl font-headline font-bold mb-3 group-hover:text-primary transition-colors">{product.name}</h3>
        <p className="text-sm text-muted-foreground mb-8 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
        
        <div className="mt-auto">
          <div className="flex flex-wrap gap-3 mb-6">
            {product.variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVariant(v)}
                className={`px-4 py-1.5 text-xs rounded-full border transition-all font-bold ${
                  selectedVariant.id === v.id 
                    ? 'border-primary bg-primary text-primary-foreground shadow-lg scale-105' 
                    : 'border-border hover:border-primary text-muted-foreground hover:bg-primary/5'
                }`}
              >
                {v.weight}
              </button>
            ))}
          </div>
          <Button 
            onClick={handleAddToCart}
            className="w-full font-black py-6 rounded-xl shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            إضافة للسلة
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
