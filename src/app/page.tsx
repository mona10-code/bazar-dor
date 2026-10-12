'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from "next/link";

interface Product {
  id: number;
  slug: string;
  nameBn: string;
  categoryIcon: string;
  unit: string;
  today: number;
  section: 'up' | 'down' | 'all';
  change: {
    dir: 'up' | 'down' | 'flat';
    pct: string;
  };
}

const fallbackProducts: Product[] = [
  // --- ১. আজ দাম বেড়েছে (Up Section) ---
  { id: 1, slug: 'peyaj', nameBn: 'পেঁয়াজ', categoryIcon: '🧅', unit: 'প্রতি কেজি', today: 58, section: 'up', change: { dir: 'up', pct: '12.5' } },
  { id: 2, slug: 'ada', nameBn: 'আদা', categoryIcon: '🫚', unit: 'প্রতি কেজি', today: 85, section: 'up', change: { dir: 'up', pct: '9.0' } },
  { id: 3, slug: 'begun', nameBn: 'বেগুন', categoryIcon: '🍆', unit: 'প্রতি কেজি', today: 44, section: 'up', change: { dir: 'up', pct: '4.8' } },
  { id: 4, slug: 'rui-mach', nameBn: 'রুই মাছ', categoryIcon: '🐟', unit: 'প্রতি কেজি', today: 46, section: 'up', change: { dir: 'up', pct: '4.5' } },
  { id: 5, slug: 'dim', nameBn: 'ডিম', categoryIcon: '🥚', unit: 'প্রতি ডজন', today: 158, section: 'up', change: { dir: 'up', pct: '3.9' } },
  { id: 6, slug: 'makhhan', nameBn: 'মাখন (১০০ গ্রাম)', categoryIcon: '🧈', unit: 'প্রতি পিস', today: 145, section: 'up', change: { dir: 'up', pct: '3.6' } },

  // --- ২. আজ দাম কমেছে (Down Section) ---
  { id: 7, slug: 'kachamorich', nameBn: 'কাঁচামরিচ', categoryIcon: '🌶️', unit: 'প্রতি কেজি', today: 92, section: 'down', change: { dir: 'down', pct: '-12.4' } },
  { id: 8, slug: 'rosun', nameBn: 'রসুন', categoryIcon: '🧄', unit: 'প্রতি কেজি', today: 125, section: 'down', change: { dir: 'down', pct: '-7.4' } },
  { id: 9, slug: 'alu', nameBn: 'আলু', categoryIcon: '🥔', unit: 'প্রতি কেজি', today: 30, section: 'down', change: { dir: 'down', pct: '-6.2' } },
  { id: 10, slug: 'katla-mach', nameBn: 'কাতলা মাছ', categoryIcon: '🐟', unit: 'প্রতি কেজি', today: 43, section: 'down', change: { dir: 'down', pct: '-4.4' } },
  { id: 11, slug: 'hanser-mangsho', nameBn: 'হাঁসের মাংস', categoryIcon: '🦆', unit: 'প্রতি কেজি', today: 285, section: 'down', change: { dir: 'down', pct: '-3.4' } },
  { id: 12, slug: 'khasir-mangsho', nameBn: 'খাসির মাংস', categoryIcon: '🍖', unit: 'প্রতি কেজি', today: 1290, section: 'down', change: { dir: 'down', pct: '-3' } },

  // --- ৩. সব পণ্য (All Section - Total 33 items) ---
  { id: 1, slug: 'sorno-machi-chal', nameBn: 'স্বর্ণমাছি চাল', categoryIcon: '🍚', unit: 'প্রতি কেজি', today: 148, section: 'all', change: { dir: 'up', pct: '2.1' } },
  { id: 2, slug: 'miniket-chal', nameBn: 'মিনিকেট চাল', categoryIcon: '🍚', unit: 'প্রতি কেজি', today: 99, section: 'all', change: { dir: 'down', pct: '-2.9' } },
  { id: 3, slug: 'nazir-chal', nameBn: 'নাজির চাল', categoryIcon: '🍚', unit: 'প্রতি কেজি', today: 74, section: 'all', change: { dir: 'flat', pct: '0.0' } },
  { id: 4, slug: 'batam-size-chal', nameBn: 'বাটাম সাইজ চাল', categoryIcon: '🍚', unit: 'প্রতি কেজি', today: 66, section: 'all', change: { dir: 'up', pct: '3.1' } },
  { id: 5, slug: 'mosur-dal', nameBn: 'মসুর ডাল', categoryIcon: '🫘', unit: 'প্রতি কেজি', today: 142, section: 'all', change: { dir: 'up', pct: '2.9' } },
  { id: 6, slug: 'mug-dal', nameBn: 'মুগ ডাল', categoryIcon: '🫘', unit: 'প্রতি কেজি', today: 135, section: 'all', change: { dir: 'flat', pct: '0.0' } },
  { id: 7, slug: 'chola', nameBn: 'ছোলা', categoryIcon: '🫘', unit: 'প্রতি কেজি', today: 120, section: 'all', change: { dir: 'down', pct: '-2.4' } },
  { id: 8, slug: 'amon-dal', nameBn: 'আমন ডাল (খোসাসিলা)', categoryIcon: '🫘', unit: 'প্রতি কেজি', today: 156, section: 'all', change: { dir: 'up', pct: '2.6' } },
  { id: 9, slug: 'sorishar-tel', nameBn: 'সরিষার তেল', categoryIcon: '🛢️', unit: 'প্রতি লিটার', today: 192, section: 'all', change: { dir: 'up', pct: '2.1' } },
  { id: 10, slug: 'palm-tel', nameBn: 'পাম তেল', categoryIcon: '🛢️', unit: 'প্রতি লিটার', today: 168, section: 'all', change: { dir: 'down', pct: '-2.3' } },
  { id: 11, slug: 'ghani-bhanga-tel', nameBn: 'ঘানি ভাঙা সরিষার তেল', categoryIcon: '🛢️', unit: 'প্রতি লিটার', today: 215, section: 'all', change: { dir: 'up', pct: '2.4' } },
  { id: 12, slug: 'alu-all', nameBn: 'আলু', categoryIcon: '🥔', unit: 'প্রতি কেজি', today: 30, section: 'all', change: { dir: 'down', pct: '-6.2' } },
  { id: 13, slug: 'peyaj-all', nameBn: 'পেঁয়াজ', categoryIcon: '🧅', unit: 'প্রতি কেজি', today: 54, section: 'all', change: { dir: 'up', pct: '12.5' } },
  { id: 14, slug: 'kachamorich-all', nameBn: 'কাঁচামরিচ', categoryIcon: '🌶️', unit: 'প্রতি কেজি', today: 92, section: 'all', change: { dir: 'down', pct: '-12.4' } },
  { id: 15, slug: 'begun-all', nameBn: 'বেগুন', categoryIcon: '🍆', unit: 'প্রতি কেজি', today: 44, section: 'all', change: { dir: 'up', pct: '4.8' } },
  { id: 16, slug: 'dhenders-all', nameBn: 'ঢেঁড়স', categoryIcon: '🟢', unit: 'প্রতি কেজি', today: 38, section: 'all', change: { dir: 'flat', pct: '0.0'}},
  { id: 17, slug: 'rui-mach-all', nameBn: 'রুই মাছ', categoryIcon: '🐟', unit: 'প্রতি কেজি', today: 46, section: 'all', change: { dir: 'up', pct: '4.5' } },
  { id: 18, slug: 'telapia-mach', nameBn: 'তেলাপিয়া', categoryIcon: '🐟', unit: 'প্রতি কেজি', today: 36, section: 'all', change: { dir: 'flat', pct: '0.0' } },
  { id: 19, slug: 'ilish-mach', nameBn: 'ইলিশ মাছ', categoryIcon: '🐠', unit: 'প্রতি কেজি', today: 1850, section: 'all', change: { dir: 'up', pct: '3.4' } },
  { id: 20, slug: 'katla-mach-all', nameBn: 'কাতলা মাছ', categoryIcon: '🐟', unit: 'প্রতি কেজি', today: 43, section: 'all', change: { dir: 'down', pct: '-4.4' } },
  { id: 21, slug: 'chingri-mach', nameBn: 'চিংড়ি মাছ (খোলা)', categoryIcon: '🦐', unit: 'প্রতি কেজি', today: 330, section: 'all', change: { dir: 'up', pct: '3.1' } },
  { id: 22, slug: 'murgi-mangsho', nameBn: 'মুরগির মাংস', categoryIcon: '🍗', unit: 'প্রতি কেজি', today: 225, section: 'all', change: { dir: 'down', pct: '-1.3' } },
  { id: 23, slug: 'gorur-mangsho', nameBn: 'গরুর মাংস', categoryIcon: '🥩', unit: 'প্রতি কেজি', today: 490, section: 'all', change: { dir: 'down', pct: '-1.2' } },
  { id: 24, slug: 'khasir-mangsho-all', nameBn: 'খাসির মাংস', categoryIcon: '🍖', unit: 'প্রতি কেজি', today: 1290, section: 'all', change: { dir: 'down', pct: '-3' } },
  { id: 25, slug: 'hasher-mangsho-all', nameBn: 'হাঁসের মাংস', categoryIcon: '🦆', unit: 'প্রতি কেজি', today: 285, section: 'all', change: { dir: 'down', pct: '-3.4' } },
  { id: 26, slug: 'dim-all', nameBn: 'ডিম', categoryIcon: '🥚', unit: 'প্রতি ডজন', today: 158, section: 'all', change: { dir: 'up', pct: '3.9' } },
  { id: 27, slug: 'dudh', nameBn: 'দুধ', categoryIcon: '🥛', unit: 'প্রতি লিটার', today: 110, section: 'all', change: { dir: 'up', pct: '2.0' } },
  { id: 28, slug: 'doi', nameBn: 'দই', categoryIcon: '🥣', unit: 'প্রতি লিটার', today: 92, section: 'all', change: { dir: 'flat', pct: '0.0' } },
  { id: 29, slug: 'makhhan-all', nameBn: 'মাখন (১০০ গ্রাম)', categoryIcon: '🧈', unit: 'প্রতি পিস', today: 145, section: 'all', change: { dir: 'up', pct: '3.6' } },
  { id: 30, slug: 'ada-all', nameBn: 'আদা', categoryIcon: '🫚', unit: 'প্রতি কেজি', today: 85, section: 'all', change: { dir: 'up', pct: '9' } },
  { id: 31, slug: 'rosun-all', nameBn: 'রসুন', categoryIcon: '🧄', unit: 'প্রতি কেজি', today: 125, section: 'all', change: { dir: 'down', pct: '-7.4' } },
  { id: 32, slug: 'morich-gura', nameBn: 'মরিচ গুঁড়া', categoryIcon: '🌶️', unit: 'প্রতি কেজি', today: 245, section: 'all', change: { dir: 'down', pct: '-2' } },
  { id: 33, slug: 'dhonepata-gura', nameBn: 'ধনেপাতা গুঁড়া', categoryIcon: '🍃', unit: 'প্রতি কেজি', today: 265, section: 'all', change: { dir: 'flat', pct: '0.0' } }
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>(fallbackProducts);

  useEffect(() => {
    const saved = localStorage.getItem('bazar_dor_products_v4');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) {
          setProducts(parsed);
        }
      } catch (e) {
        setProducts(fallbackProducts);
      }
    } else {
      localStorage.setItem('bazar_dor_products_v4', JSON.stringify(fallbackProducts));
    }
  }, []);

  const upProducts = products.filter(p => p.section === 'up');
  const downProducts = products.filter(p => p.section === 'down');
  const allProducts = products.filter(p => p.section === 'all');

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      {/* Top Banner Section with public/bazar-hero.png */}
      <section className="bg-[#EBF3EC] border border-[#d6e7d8] rounded-3xl p-8 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
        <div className="space-y-4 max-w-xl z-10">
          <span className="bg-white/80 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full shadow-2xs">
            শনিবার, ১০ অক্টোবর, ২০২৬
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            আজকের বাজারের দাম এক নজরে
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            চাল, আলু, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গত, সর্বোচ্চ এবং সর্বনিম্ন পরিবর্তনের এক জায়গায়।
          </p>
          <div>
            <Link href="#all-products" className="inline-block bg-[#1B5E20] hover:bg-emerald-800 py-3 px-6 rounded-xl transition shadow-sm cursor-pointer text-white font-medium">
  সব পণ্য দেখুন
</Link>
          </div>
        </div>

        <div className="relative w-48 h-48 md:w-60 md:h-60 shrink-0 flex items-center justify-center">
          <Image 
            src="/bazar-hero.png" 
            alt="Bazar Hero Banner" 
            width={240}
            height={240}
            className="object-contain"
          />
        </div>
      </section>

      {/* Today Price Increased Section */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <span className="text-red-500">▲</span> আজ দাম বেড়েছে
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {upProducts.map((item) => (
            <Link href={`/product/${item.id}`} key={item.id}>
            <div key={item.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-3xl bg-gray-50 p-3 rounded-2xl border border-gray-100">{item.categoryIcon}</span>
                <div className="space-y-0.5">
                  <h3 className="font-bold text-gray-900 text-base">{item.nameBn}</h3>
                  <p className="text-xs text-gray-400">{item.unit}</p>
                  <div className="pt-1">
                    <p className="text-xs text-gray-400">আজকের দাম</p>
                    <p className="text-base font-extrabold text-gray-900">{item.today} টাকা</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-xs font-bold text-red-500 bg-red-50 px-2.5 py-1 rounded-lg">
                  ▲ {item.change.pct}%
                </span>

              </div>
            </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Today Price Decreased Section */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <span className="text-emerald-600">▼</span> আজ দাম কমেছে
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {downProducts.map((item) => (
            
  <Link href={`/product/${item.id}`} key={item.id}>
      
            <div key={item.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-3xl bg-gray-50 p-3 rounded-2xl border border-gray-100">{item.categoryIcon}</span>
                <div className="space-y-0.5">
                  <h3 className="font-bold text-gray-900 text-base">{item.nameBn}</h3>
                  <p className="text-xs text-gray-400">{item.unit}</p>
                  <div className="pt-1">
                    <p className="text-xs text-gray-400">আজকের দাম</p>
                    <p className="text-base font-extrabold text-gray-900">{item.today} টাকা</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  ▼ {item.change.pct}%
                </span>

              </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* All Products Section */}
      <section id="all-products" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">সব পণ্য</h2>
          <span className="text-xs font-medium text-gray-500">মোট ৩৩ টি পণ্য দেখানো হচ্ছে</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {allProducts.map((item) => (
              <Link href={`/product/${item.id}`} key={item.id}>
            <div key={item.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-3xl bg-gray-50 p-3 rounded-2xl border border-gray-100">{item.categoryIcon}</span>
                <div className="space-y-0.5">
                  <h3 className="font-bold text-gray-900 text-base">{item.nameBn}</h3>
                  <p className="text-xs text-gray-400">{item.unit}</p>
                  <div className="pt-1">
                    <p className="text-xs text-gray-400">আজকের দাম</p>
                    <p className="text-base font-extrabold text-gray-900">{item.today} টাকা</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                  item.change.dir === 'up' 
                    ? 'text-red-500 bg-red-50' 
                    : item.change.dir === 'down' 
                    ? 'text-emerald-600 bg-emerald-50' 
                    : 'text-gray-500 bg-gray-50'
                }`}>
                  {item.change.dir === 'up' ? `▲ ${item.change.pct}%` : item.change.dir === 'down' ? `▼ ${item.change.pct}%` : '▬ স্থির'}
                </span>
                
              </div>
            </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}