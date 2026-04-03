
"use client";

import Image from 'next/image';
import { PlaceHolderImages } from '@/app/lib/placeholder-images';
import { motion } from 'framer-motion';

export function Storytelling() {
  const heritageImg = PlaceHolderImages.find(img => img.id === 'heritage-desert');

  return (
    <section id="story" className="py-32 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative h-[650px] rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.2)] order-2 lg:order-1"
          >
            <Image
              src={heritageImg?.imageUrl || ''}
              alt="مزارع السلامات"
              fill
              className="object-cover"
              data-ai-hint="heritage farm"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-12 right-12 text-white">
              <p className="text-4xl font-headline font-bold mb-2 text-primary">تمور السلامات</p>
              <p className="text-sm font-bold tracking-widest opacity-80 uppercase">منذ أجيال</p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-12 order-1 lg:order-2 text-right"
          >
            <div className="space-y-6">
              <span className="text-accent font-black tracking-[0.4em] uppercase text-xs">حكاية الأرض والعائلة</span>
              <h2 className="text-5xl md:text-7xl font-headline font-bold leading-tight">
                أمانة عائلة <br />
                <span className="text-primary italic">السلامات</span>.
              </h2>
            </div>
            
            <p className="text-2xl text-muted-foreground leading-relaxed font-medium">
              ليست مجرد تجارة، بل هي أمانة توارثتها عائلة السلامات جيلاً بعد جيل. نعتني بكل نخلة كفرد من العائلة، لنضمن وصول الثمرة الأكمل إلى مائدتكم بتغليف يعكس فخامة الضيافة العربية.
            </p>
            
            <div className="grid grid-cols-2 gap-16 pt-10">
              <div className="space-y-4 border-r-2 border-primary/20 pr-8">
                <h4 className="font-headline font-bold text-5xl text-primary tracking-tighter">أصالة</h4>
                <p className="text-xs text-muted-foreground font-black uppercase tracking-[0.2em]">طبيعي 100%</p>
              </div>
              <div className="space-y-4">
                <h4 className="font-headline font-bold text-5xl text-primary tracking-tighter">رقي</h4>
                <p className="text-xs text-muted-foreground font-black uppercase tracking-[0.2em]">تغليف هدايا ملكي</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
