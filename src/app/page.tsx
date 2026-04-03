
import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/sections/Hero';
import { Storytelling } from '@/components/sections/Storytelling';
import { RecommendationSection } from '@/components/sections/RecommendationSection';
import { ProductCard } from '@/components/product/ProductCard';
import { products } from '@/app/lib/products';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AIVoiceAssistant } from '@/components/ai/AIVoiceAssistant';

export default function Home() {
  const featuredProducts = products.filter(p => p.featured);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      
      {/* التشكيلة المختارة */}
      <section id="collection" className="py-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
            <div className="space-y-6 text-right">
              <h2 className="text-5xl md:text-6xl font-headline font-bold mb-4">اختيارات السلامات</h2>
              <p className="text-muted-foreground max-w-xl text-xl leading-relaxed">
                مجموعة حصرية من أفخر أنواع التمور، تم اختيارها بعناية من محاصيل هذا الموسم لتناسب ذوقكم الرفيع.
              </p>
            </div>
            <Link href="/catalog">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 px-10 py-7 rounded-2xl font-bold text-lg">
                عرض المتجر الكامل
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <Storytelling />
      
      <RecommendationSection />

      {/* المساعد الذكي */}
      <AIVoiceAssistant />

      {/* التذييل */}
      <footer className="bg-foreground text-background py-32 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-24">
            <div className="space-y-10">
              <div className="flex flex-col">
                <h3 className="font-headline text-4xl font-bold text-primary">تمور السلامات</h3>
                <span className="text-[10px] text-muted-foreground tracking-[0.4em] font-bold uppercase mt-2">
                  ESTABLISHED HERITAGE
                </span>
              </div>
              <p className="text-muted-foreground text-lg leading-relaxed">
                نرتقي بتقليد تقديم التمور إلى تجربة أسلوب حياة فاخرة. نحن نبيع التراث في كل قطعة.
              </p>
            </div>
            {/* ... بقية التذييل ... */}
          </div>
        </div>
      </footer>
    </div>
  );
}
