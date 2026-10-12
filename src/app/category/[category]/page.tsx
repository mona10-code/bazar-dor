'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = String(params?.category || '').toLowerCase();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    fetch('https://api.api-store.workers.dev/api/bazardor/products')
      .then((res) => res.json())
      .then((data) => {
        let fetchedList = [];
        if (Array.isArray(data)) {
          fetchedList = data;
        } else if (data.products && Array.isArray(data.products)) {
          fetchedList = data.products;
        } else if (data.data && Array.isArray(data.data)) {
          fetchedList = data.data;
        }

        // Specific category filtering logic
        const filtered = fetchedList.filter((item: any) => {
          const itemCat = String(item.category || '').toLowerCase();
          const itemName = String(item.nameBn || item.name || '').toLowerCase();

          if (categorySlug.includes('dim') || categorySlug.includes('দুধ')) {
            // Include items related to dim, dudh, doi, makhon
            return (
              itemCat.includes('dim') ||
              itemCat.includes('dudh') ||
              itemCat.includes('doi') ||
              itemCat.includes('mokhhan') ||
              itemCat.includes('makhon') ||
              itemName.includes('ডিম') ||
              itemName.includes('দুধ') ||
              itemName.includes('দই') ||
              itemName.includes('মাখন')
            );
          }

          return (
            itemCat.includes(categorySlug) ||
            categorySlug.includes(itemCat)
          );
        });

        setProducts(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.log('Error fetching category products:', err);
        setLoading(false);
      });
  }, [categorySlug]);

  // Sorting logic
  const sortedProducts = [...products].sort((a, b) => {
    const priceA = Number(a.today || a.price || 0);
    const priceB = Number(b.today || b.price || 0);
    if (sortBy === 'low-to-high') return priceA - priceB;
    if (sortBy === 'high-to-low') return priceB - priceA;
    return 0;
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 text-lg animate-pulse">লোড হচ্ছে...</p>
      </div>
    );
  }

  if (sortedProducts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি</h2>
        <Link href="/" className="inline-block bg-green-600 text-white px-6 py-2.5 rounded-xl font-semibold">
          হোম পেজে ফিরে যান
        </Link>
      </div>
    );
  }

  // Determine Category Name & Icon
  let categoryName = 'পণ্যসমূহ';
  let categoryIcon = '🛒';

  if (categorySlug.includes('chal') || categorySlug.includes('চাল')) {
    categoryName = 'চাল';
    categoryIcon = '🍚';
  } else if (categorySlug.includes('dal') || categorySlug.includes('ডাল')) {
    categoryName = 'ডাল';
    categoryIcon = '🫘';
  } else if (categorySlug.includes('tel') || categorySlug.includes('তেল')) {
    categoryName = 'তেল';
    categoryIcon = '🛢️';
  } else if (categorySlug.includes('sobji') || categorySlug.includes('সবজি')) {
    categoryName = 'সবজি';
    categoryIcon = '🥬';
  } else if (categorySlug.includes('mach') || categorySlug.includes('মাছ')) {
    categoryName = 'মাছ';
    categoryIcon = '🐟';
  } else if (categorySlug.includes('mangsho') || categorySlug.includes('মাংস')) {
    categoryName = 'মাংস';
    categoryIcon = '🥩';
  } else if (categorySlug.includes('dim') || categorySlug.includes('দুধ') || categorySlug.includes('dim-dui')) {
    categoryName = 'ডিম ও দুধ';
    categoryIcon = '🥚';
  } else if (categorySlug.includes('mosla') || categorySlug.includes('মসলা')) {
    categoryName = 'মসলা';
    categoryIcon = '🌶️';
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Top Banner Box */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
        <span className="text-4xl">{categoryIcon}</span>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">{categoryName}</h1>
          <p className="text-sm text-gray-500 mt-0.5">প্রতি পণ্যের আজকের দাম ও পরিবর্তন</p>
        </div>
      </div>

      {/* Sub Header: Total Count + Sort Control */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <p className="text-sm font-medium text-gray-600">
          মোট {sortedProducts.length}টি পণ্য দেখানো হচ্ছে
        </p>

        {/* Sort Control */}
        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-xs font-semibold text-gray-500">সাজান:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent text-sm font-medium text-gray-800 outline-none cursor-pointer pr-2"
          >
            <option value="default">ডিফল্ট</option>
            <option value="low-to-high">দাম: কম থেকে বেশি</option>
            <option value="high-to-low">দাম: বেশি থেকে কম</option>
          </select>
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedProducts.map((item, idx) => {
          const name = item.nameBn || item.name || 'পণ্য';
          const icon = item.categoryIcon || item.icon || '🛒';
          const price = item.today || item.price || '0';
          const unit = item.unit === 'dozen' ? 'ডজন' : item.unit === 'litre' ? 'লিটার' : 'কেজি';
          const dir = item.change?.dir;
          const pct = item.change?.pct || '0.0';

          let badgeColor = 'text-gray-500';
          let arrowSymbol = '—';
          if (dir === 'up') {
            badgeColor = 'text-red-500';
            arrowSymbol = '▲';
          } else if (dir === 'down') {
            badgeColor = 'text-green-600';
            arrowSymbol = '▼';
          }

          return (
            <Link
              key={idx}
              href={`/product/${item.slug || 'item'}`}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{icon}</span>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{name}</h3>
                  <p className="text-xs text-gray-500">প্রতি {unit}</p>
                </div>
              </div>
              <div className="flex justify-between items-end pt-3 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-400">আজকের দাম</p>
                  <p className="text-xl font-extrabold text-gray-900 mt-0.5">{price} টাকা</p>
                </div>
                <span className={`${badgeColor} font-bold text-sm`}>
                  {arrowSymbol} {pct}%
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}