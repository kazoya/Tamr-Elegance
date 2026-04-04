"use client";

import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Building2, Package, Truck, PhoneCall, Send } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function WholesalePage() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    quantity: '',
    details: ''
  });

  const handleWholesaleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    let text = "مرحباً، أود الاستفسار عن طلب كميات جملة لتمور السلامات:\n\n";
    text += `👤 الاسم: ${formData.name}\n`;
    if (formData.company) text += `🏢 الشركة/المتجر: ${formData.company}\n`;
    text += `📞 الهاتف: ${formData.phone}\n`;
    text += `📦 الكمية المتوقعة: ${formData.quantity}\n`;
    if (formData.details) text += `📝 تفاصيل إضافية: ${formData.details}\n`;

    const phone = '962799967433';
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-headline font-bold mb-6 text-primary">طلبات الجملة والتوريد</h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              نوفر تمور السلامات الفاخرة بكميات تجارية للفنادق، والمطاعم، ومتاجر التجزئة بأسعار تنافسية وجودة لا تُضاهى.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
            {/* Form Section */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-card p-8 md:p-10 rounded-[2.5rem] border border-border/50 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none" />
              
              <h2 className="text-2xl font-headline font-bold mb-8 relative z-10 flex items-center gap-3">
                <Building2 className="w-6 h-6 text-primary" />
                نموذج طلب توريد
              </h2>

              <form onSubmit={handleWholesaleRequest} className="space-y-5 relative z-10">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground ml-1">اسم المسؤول المباشر <span className="text-destructive">*</span></label>
                  <input required type="text" placeholder="مثال: أحمد السلامات" className="w-full bg-background border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground ml-1">اسم المتجر أو الشركة</label>
                  <input type="text" placeholder="مثال: فنادق الماريوت" className="w-full bg-background border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground ml-1">رقم التواصل <span className="text-destructive">*</span></label>
                  <input required type="tel" placeholder="رقم الهاتف أو الواتساب" className="w-full bg-background border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-left" dir="ltr" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground ml-1">الكمية التقديرية <span className="text-destructive">*</span></label>
                  <select required className="w-full bg-background border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none cursor-pointer" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})}>
                    <option value="" disabled>اختر الكمية التقديرية</option>
                    <option value="50 إلى 100 كيلوغرام">من 50 إلى 100 كغ</option>
                    <option value="100 إلى 500 كيلوغرام">من 100 إلى 500 كغ</option>
                    <option value="أكثر من 500 كيلوغرام">أكثر من نصف طن (500+ كغ)</option>
                  </select>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="text-sm font-bold text-muted-foreground ml-1">ملاحظات أو أسئلة إضافية</label>
                  <textarea rows={3} placeholder="أي معلومات تفصيلية عن طلبات التغليف وغيرها..." className="w-full bg-background border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none" value={formData.details} onChange={e => setFormData({...formData, details: e.target.value})} />
                </div>

                <Button type="submit" className="w-full h-auto py-5 mt-4 rounded-xl text-lg font-bold flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02] transition-transform">
                  <Send className="w-5 h-5" />
                  إرسال الطلب للاستشارة
                </Button>
              </form>
            </motion.div>

            {/* Info Section */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col justify-center space-y-10"
            >
              <div className="flex gap-4 items-start">
                <div className="bg-primary/10 p-4 rounded-full text-primary shrink-0">
                  <Package className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-headline font-bold mb-2">تخزين وتغليف فاخر</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    نمتلك خطوط تعبئة وتغليف تضمن بقاء التمور في أقصى درجات الطزاجة حتى تصل لعملائك بالشكل المرموق.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-primary/10 p-4 rounded-full text-primary shrink-0">
                  <Truck className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-headline font-bold mb-2">شحن مبرد وآمن</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    أسطولنا مجهز بأحدث تقنيات التبريد لنضمن لك استلام طلبيات الجملة بالجودة التي قطفت بها.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="bg-primary/10 p-4 rounded-full text-primary shrink-0">
                  <PhoneCall className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-headline font-bold mb-2">دعم ومتابعة مستمرة</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    نقدم تسعيراً خاصاً ومتابعة دورية مع شركائنا في توريد التمور لنبني علاقة ثقة طويلة الأمد. الأولوية الدائمة لكم.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
