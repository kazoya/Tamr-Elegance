
import type {Metadata} from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'تمور السلامات | فخامة التراث العربي الأردني',
  description: 'نقدم أجود أنواع التمور المختارة بعناية من مزارعنا في الغور، بتغليف فاخر يليق بإرث عائلة السلامات ومناسباتكم الراقية.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased selection:bg-primary selection:text-white">
        <CartProvider>
          {children}
          <Toaster />
        </CartProvider>
      </body>
    </html>
  );
}
