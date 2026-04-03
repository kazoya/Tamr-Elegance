
export type ProductVariant = {
  id: string;
  weight: string;
  price: number;
  wholesalePrice: number;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  variants: ProductVariant[];
  featured?: boolean;
};

export const products: Product[] = [
  {
    id: 'p1',
    name: 'مجذول ملكي',
    description: 'ملك التمور من غور الأردن. حبات كبيرة، غنية، وحلوة بشكل طبيعي مع ملمس يشبه الكراميل.',
    category: 'تمور',
    image: 'medjool-classic',
    featured: true,
    variants: [
      { id: 'v1', weight: '500 جم', price: 18, wholesalePrice: 14 },
      { id: 'v2', weight: '1 كجم', price: 32, wholesalePrice: 25 },
      { id: 'v3', weight: '5 كجم بالجملة', price: 140, wholesalePrice: 110 }
    ]
  },
  {
    id: 'p2',
    name: 'عجوة فاخرة',
    description: 'تمور مباركة، معروفة بقوامها الفريد وأهميتها التقليدية العميقة، مختارة بعناية.',
    category: 'تمور',
    image: 'ajwa-luxury',
    featured: true,
    variants: [
      { id: 'v4', weight: '250 جم', price: 22, wholesalePrice: 16 },
      { id: 'v5', weight: '500 جم', price: 40, wholesalePrice: 30 }
    ]
  },
  {
    id: 'p3',
    name: 'سكري ذهبي',
    description: 'تمور طرية تذوب في الفم مع طبقة بلورية ولون ذهبي فاتح جذاب، ضيافة أصيلة.',
    category: 'تمور',
    image: 'sukkari-bulk',
    variants: [
      { id: 'v6', weight: '500 جم', price: 15, wholesalePrice: 11 },
      { id: 'v7', weight: '1 كجم', price: 28, wholesalePrice: 20 }
    ]
  },
  {
    id: 'p4',
    name: 'صندوق السلامات الملكي',
    description: 'صندوق هدايا فاخر مبطن بالمخمل يحتوي على تشكيلة مختارة من أجود تمورنا، يليق بمناسباتكم.',
    category: 'تغليف هدايا',
    image: 'packaging-box',
    featured: true,
    variants: [
      { id: 'v8', weight: 'هدايا', price: 85, wholesalePrice: 65 }
    ]
  }
];
