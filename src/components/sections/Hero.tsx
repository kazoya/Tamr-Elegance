
"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/app/lib/placeholder-images';
import { motion } from 'framer-motion';
import { ChevronDown, BookOpen } from 'lucide-react';

export function Hero() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-dates');

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative h-[95vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={heroImage?.imageUrl || ''}
          alt="تمور السلامات الفاخرة"
          fill
          className="object-cover brightness-[0.4]"
          priority
          data-ai-hint="premium dates"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10 text-right">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-3xl"
        >
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="text-primary font-bold tracking-[0.2em] uppercase text-sm mb-6 block border-r-4 border-primary pr-4"
          >
            إرث عائلة السلامات الأصيل
          </motion.span>
          <h1 className="text-6xl md:text-8xl font-headline font-bold text-foreground mb-8 leading-[1.1]">
            نختار <span className="text-primary italic">الأفضل</span> <br />
            لمائدتكم الفاخرة
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed max-w-xl font-medium">
            من قلب مزارعنا إلى بيوتكم، نقدم لكم تشكيلة تمور السلامات التي تجمع بين بركة الأرض ورقي التغليف.
          </p>
          <div className="flex flex-wrap gap-6">
            <Button 
              onClick={() => scrollToSection('collection')}
              size="lg" 
              className="h-auto px-10 py-6 text-xl font-bold shadow-2xl hover:scale-105 transition-transform rounded-2xl flex items-center gap-3"
            >
              تصفح مجموعتنا
              <ChevronDown className="w-6 h-6 animate-bounce" />
            </Button>
            <Button 
              onClick={() => scrollToSection('story')}
              size="lg" 
              variant="outline" 
              className="h-auto px-10 py-6 text-xl border-primary text-primary hover:bg-primary/5 font-bold rounded-2xl flex items-center gap-3"
            >
              <BookOpen className="w-5 h-5 text-primary/80" />
              قصة السلامات
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
