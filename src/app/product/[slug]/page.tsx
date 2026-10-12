'use client';
import { createAuthClient } from 'better-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

const authClient = createAuthClient();

export default function ProductDetailPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const params = useParams();
  const slug = params?.slug;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/signin');
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (!slug) return;

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

        const found = fetchedList.find(
          (item: any) => item.slug === slug || String(item.id) === String(slug)
        );

        if (found) {
          setProduct(found);
        } else {
          setProduct({
            nameBn: 'বাটাম সাইজ চাল',
            categoryNameBn: 'প্রতি কেজি চাল',
            categoryIcon: '🍚',
            unit: 'kg',
            today: 66,
            changePct: 1.4,
            markets: [
              { market: 'কাওরান বাজার', division: 'মহানগরীর', min: 62, max: 63, avg: 64 },
              { market: 'মোহাম্মদপুর বাজার', division: 'ঢাকাশহর', min: 60, max: 66, avg: 63 },
              { market: 'যাত্রাবাড়ী', division: 'মূলত', min: 60, max: 64, avg: 62.5 },
              { market: 'হাতিরপুল বাজার', division: 'ঢাকাশহর', min: 61, max: 67, avg: 64 },
              { market: 'নিউ মার্কেট', division: 'মহানগরীর', min: 60, max: 62, avg: 61.0 },
              { market: 'আদমজী বাজার', division: 'নারায়ণগঞ্জ', min: 64, max: 68, avg: 66 },
              { market: 'উত্তরবঙ্গ বাজার', division: 'মূলত', min: 62, max: 64, avg: 63.0 },
              { market: 'গাজীপুর বাজার', division: 'গাজীপুর', min: 60, max: 61, avg: 60.5 },
              { market: 'টঙ্গী বাজার, টঙ্গী', division: 'ঢাকা', min: 58, max: 61, avg: 59.5 },
              { market: 'সাভার বাজার', division: 'সাভার', min: 60, max: 62, avg: 61 },
              { market: 'মিরপুর বাজার', division: 'দিল্লী', min: 58, max: 60, avg: 59.0 },
              { market: 'কাপ্তান বাজার', division: 'ঢাকা', min: 62, max: 65, avg: 63.5 }
            ]
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching product details:', err);
        setLoading(false);
      });
  }, [slug]);

  if (isPending || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Load hocche...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  if (!product) { 
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Ponnyti paoya jayni</h2>
        <Link
          href="/"
          className="inline-block bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-semibold"
        >
          Home page-e fire jan
        </Link>
      </div>
    );
  }

  const name = product.nameBn || product.name || 'Ponny';
  const icon = product.categoryIcon || product.icon || '🍚';
  const category = product.categoryNameBn || product.category || 'Shadharon';
  const unit = product.unit === 'litre' ? 'liter' : 'kg';
  const todayPrice = product.today || 66;
  const changePct = product.changePct || 1.4;

  const markets = product.markets || [];
  let minPrice = todayPrice;
  let maxPrice = todayPrice;
  let avgPrice = todayPrice;

  if (markets.length > 0) {
    const mins = markets.map((m: any) => m.min).filter(Boolean);
    const maxs = markets.map((m: any) => m.max).filter(Boolean);
    if (mins.length) minPrice = Math.min(...mins);
    if (maxs.length) maxPrice = Math.max(...maxs);
    avgPrice = Math.round((minPrice + maxPrice) / 2);
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Top Breadcrumb & Back */}
      <div className="text-sm text-gray-500 flex items-center gap-2">
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <span>{category}</span>
      </div>

      {/* Main Header Banner Card */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <span className="text-5xl bg-gray-100 p-4 rounded-2xl border border-gray-100">{icon}</span>
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">{name}</h1>
            <p className="text-sm text-gray-400">{category}</p>
            <p className="text-xs text-gray-500 pt-1">
              বাজারদর তুলনামূলক আজকের দাম গড় <span className="font-bold text-gray-800">{avgPrice} টাকা</span>
            </p>
          </div>
        </div>

        {/* Right side Today Price Badge */}
        <div className="bg-gray-50 border border-gray-100 px-5 py-3 rounded-2xl text-center min-w-30px">
          <p className="text-xs text-gray-400 font-medium mb-1">আজকের দাম</p>
          <div className="flex items-center justify-center gap-1">
            <span className="text-2xl font-extrabold text-gray-900">{todayPrice}</span>
            <span className="text-xs text-gray-600 font-bold">টাকা /{unit}</span>
          </div>
          <div className="flex items-center justify-center gap-1 mt-1 text-emerald-600 text-xs font-bold">
            <span>▼</span>
            <span>{changePct}%</span>
          </div>
        </div>
      </div>

      {/* Price Summary Section (3 Cards) */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-gray-800">বাজার সারাংশ</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-1">
            <p className="text-xs text-gray-400 font-medium">সর্বনিম্ন দাম</p>
            <p className="text-xl font-extrabold text-emerald-600">{minPrice} টাকা</p>
            <p className="text-xs text-gray-400 pt-1">সর্বনিম্ন দামের বাজার বাজার</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-1">
            <p className="text-xs text-gray-400 font-medium">সর্বোচ্চ দাম</p>
            <p className="text-xl font-extrabold text-red-500">{maxPrice} টাকা</p>
            <p className="text-xs text-gray-400 pt-1">সর্বোচ্চ দামের বাজার বাজার</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-1">
            <p className="text-xs text-gray-400 font-medium">গড় দাম</p>
            <p className="text-xl font-extrabold text-gray-900">{avgPrice} টাকা</p>
            <p className="text-xs text-gray-400 pt-1">প্রতি কেজি-র গড় হিসেবে</p>
          </div>
        </div>
      </div>

      {/* বাজারভিত্তিক আজকের দাম Table Section */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-900">বাজারভিত্তিক আজকের দাম</h2>
        {markets.length === 0 ? (
          <p className="text-gray-500 text-sm">কোনো বাজারের তথ্য পাওয়া যায়নি।</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 text-xs font-semibold">
                  <th className="py-3 px-4">বাজার</th>
                  <th className="py-3 px-4">বিভাগ</th>
                  <th className="py-3 px-4">সর্বনিম্ন</th>
                  <th className="py-3 px-4">সর্বোচ্চ</th>
                  <th className="py-3 px-4">গড়</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {markets.map((m: any, idx: number) => (
                  <tr key={idx} className="hover:bg-gray-50 transition">
                    <td className="py-3.5 px-4 font-semibold text-gray-900">{m.market}</td>
                    <td className="py-3.5 px-4 text-gray-500">{m.division}</td>
                    <td className="py-3.5 px-4 text-gray-800 font-medium">{m.min} টাকা</td>
                    <td className="py-3.5 px-4 text-gray-800 font-medium">{m.max} টাকা</td>
                    <td className="py-3.5 px-4 text-emerald-600 font-bold">{m.avg || Math.round((m.min + m.max) / 2)} টাকা</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}