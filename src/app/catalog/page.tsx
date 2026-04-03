
import { Navbar } from '@/components/layout/Navbar';
import { ProductCard } from '@/components/product/ProductCard';
import { products } from '@/app/lib/products';
import { Button } from '@/components/ui/button';
import { Filter, SlidersHorizontal } from 'lucide-react';

export default function CatalogPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
            <div>
              <h1 className="text-4xl font-headline font-bold mb-2">Our Collection</h1>
              <p className="text-muted-foreground">Discover the finest varieties of dates and luxury packaging.</p>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Category
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                Sort By
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </main>
      
      <footer className="bg-muted py-12 mt-20 border-t">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">Experience the premium taste of heritage.</p>
        </div>
      </footer>
    </div>
  );
}
