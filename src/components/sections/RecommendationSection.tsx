
"use client";

import { useEffect, useState } from 'react';
import { personalizedProductRecommendations, type PersonalizedProductRecommendationsOutput } from '@/ai/flows/personalized-product-recommendations';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { products } from '@/app/lib/products';
import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Link from 'next/link';

export function RecommendationSection() {
  const [recommendations, setRecommendations] = useState<PersonalizedProductRecommendationsOutput | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const result = await personalizedProductRecommendations({
        userId: 'user_123',
        browsingHistory: ['مجذول ملكي', 'صناديق فاخرة'],
        pastPurchases: [
          { productId: 'p1', quantity: 2, purchaseDate: '2023-12-01' }
        ],
        availableProducts: products.map(p => ({
          id: p.id,
          name: p.name,
          description: p.description,
          category: p.category,
          price: p.variants[0].price
        }))
      });
      setRecommendations(result);
    } catch (error) {
      console.error("Failed to fetch recommendations", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
          <div className="text-center md:text-right">
            <h2 className="text-4xl font-headline font-bold mb-3">اخترنا لك بعناية</h2>
            <p className="text-muted-foreground text-lg">اقتراحات ذكية بناءً على ذوقك الرفيع في اختيار التمور.</p>
          </div>
          <Button 
            onClick={fetchRecommendations} 
            disabled={loading}
            className="flex items-center gap-3 px-8 py-6 rounded-xl shadow-lg bg-primary hover:scale-105 transition-transform"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            <span className="font-bold">تحديث المقترحات</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {!recommendations && !loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-20 text-center bg-background rounded-3xl border-2 border-dashed border-primary/20"
            >
              <p className="text-muted-foreground italic text-xl">اضغط على الزر لعرض توصيات مخصصة لك بالذكاء الاصطناعي.</p>
            </motion.div>
          )}
          
          {loading && Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-72 bg-card animate-pulse rounded-3xl border border-border"></div>
          ))}

          {recommendations?.recommendedProducts.map((rec, index) => (
            <motion.div
              key={rec.productId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden border-none shadow-xl bg-card hover:scale-[1.03] transition-transform duration-500 rounded-3xl p-4">
                <CardHeader className="pb-4">
                  <div className="bg-primary/10 text-primary w-fit px-4 py-1.5 rounded-full text-[10px] font-black mb-4 flex items-center gap-2">
                    <Sparkles className="w-3 h-3" />
                    توصية ذكية
                  </div>
                  <CardTitle className="font-headline text-2xl mb-2">{rec.productName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base text-muted-foreground leading-relaxed italic">
                    "{rec.reason}"
                  </p>
                  <Button variant="link" asChild className="p-0 mt-8 text-primary font-black text-sm">
                    <Link href="/catalog">عرض التفاصيل ←</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
