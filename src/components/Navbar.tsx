'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { createAuthClient } from 'better-auth/react';
import toast, { Toaster } from 'react-hot-toast';

const authClient = createAuthClient();

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success('সফলভাবে সাইন আউট করা হয়েছে!');
            setDropdownOpen(false);
            router.push('/');
            router.refresh();
          },
          onError: () => {
            toast.error('সাইন আউট করতে সমস্যা হয়েছে!');
          }
        }
      });
    } catch (error) {
      toast.error('সাইন আউট করতে সমস্যা হয়েছে!');
    }
  };

  const categories = [
    { name: 'চাল', slug: 'chal', icon: '🍚' },
    { name: 'ডাল', slug: 'dal', icon: '🫘' },
    { name: 'তেল', slug: 'tel', icon: '🛢️' },
    { name: 'সবজি', slug: 'sobji', icon: '🥬' },
    { name: 'মাছ', slug: 'mach', icon: '🐟' },
    { name: 'মাংস', slug: 'mangsho', icon: '🍗' },
    { name: 'ডিম ও দুধ', slug: 'dim-dui', icon: '🥛' },
    { name: 'মসলা', slug: 'mosla', icon: '🌶️' },
  ];

  const tickerItems = [
    { name: '🍚 স্বর্ণমাছি চাল', price: '১৪৮ টাকা/কেজি', trend: '▲ ২.১%', up: true },
    { name: '🍚 মিনিকেট চাল', price: '৯৯ টাকা/কেজি', trend: '▼ -২.৯%', up: false },
    { name: '🍚 নাজির চাল', price: '৭৪ টাকা/কেজি', trend: '- 0.0%', up: null },
    { name: '🍚 বাটাম সাইজ চাল', price: '৬৬ টাকা/কেজি', trend: '▲ ৩.১%', up: true },
    { name: '🫘 মসুর ডাল', price: '১৪২ টাকা/কেজি', trend: '▲ ২.৯%', up: true },
    { name: '🫘 মুগ ডাল', price: '১৩৫ টাকা/কেজি', trend: '- ০.০%', up: null },
    { name: '🫘 ছোলা', price: '১২০ টাকা/কেজি', trend: '▼ -২.৪%', up: false },
    { name: '🫘 আমন ডাল (খোসাসিলা)', price: '১৫৬ টাকা/কেজি', trend: '▲ ২.৬%', up: true },
    { name: ' সরিষার তেল', price: '১৯২ টাকা/লিটার', trend: '▲ ২.১%', up: true },
    { name: '🛢️ পাম তেল', price: '১৬৮ টাকা/লিটার', trend: '▼ -২.৩%', up: false },
    { name: '🛢️ ঘানি ভাঙা সরিষার তেল', price: '২১৫ টাকা/লিটার', trend: '▲ ২.৪%', up: true },
    { name: '🥔 আলু', price: '৩০ টাকা/কেজি', trend: '▼ -৬.২%', up: false },
    { name: '🧅 পেঁয়াজ', price: '৫৪ টাকা/কেজি', trend: '▲ ১২.৫%', up: true },
    { name: '🌶️ কাঁচামরিচ', price: '৯২ টাকা/কেজি', trend: '▼ -১২.৪%', up: false },
    { name: '🍆 বেগুন', price: '৪৪ টাকা/কেজি', trend: '▲ ৪.৮%', up: true },
    { name: '🟢 ঢেঁড়স', price: '৩৮ টাকা/কেজি', trend: '▲ 0.0%', up: null },
    { name: '🐟 রুই মাছ', price: '৪৬ টাকা/কেজি', trend: '▲ ৪.৫%', up: true },
    { name: '🐟 তেলাপিয়া', price: '৩৬ টাকা/কেজি', trend: '- 0.0%', up: null },
    { name: '🐠 ইলিশ মাছ', price: '১৮৫০ টাকা/কেজি', trend: '▲ ৩.৪%', up: true },
    { name: '🐠 কাতলা মাছ', price: '৪৩ টাকা/কেজি', trend: '▼ -৪.৪%', up: false },
    { name: '🦐 চিংড়ি মাছ (খোলা)', price: '৩৩০ টাকা/কেজি', trend: '▲ ৩.১%', up: true },
    { name: '🍗 মুরগির মাংস', price: '২২৫ টাকা/কেজি', trend: '▼ -১.৩ %', up: false },
    { name: '🥩 গরুর মাংস', price: '৪৯০ টাকা/কেজি', trend: '▼ -১.২%', up: false },
    { name: '🍖 খাসির মাংস', price: '১২৯০ টাকা/কেজি', trend: '▼ -৩%', up: false },
    { name: '🦆 হাঁসের মাংস', price: '২৮৫ টাকা', trend: '▼ -৩.৪%', up: false },
    { name: '🥚 ডিম', price: '১৫৮ টাকা/ডজন', trend: '▲ ৩.৯%', up: true },
    { name: '🥛 দুধ', price: '১০২ টাকা/লিটার', trend: '▲ ২%', up: true },
    { name: '🥣 দই', price: '৯২ টাকা/কেজি', trend: '- ০.০%', up: null },
    { name: '🧈 মাখন (১০০ গ্রাম)', price: '১৪৫ টাকা/পিস', trend: '▲ ৩.৬%', up: true },
    { name: '🫚 আদা', price: '৮৫ টাকা/কেজি', trend: '▲ ৯%', up: true },
    { name: '🧄 রসুন', price: '১২৫ টাকা/কেজি', trend: '▼ -৭.৪%', up: false },
    { name: '🌶️ মরিচ গুঁড়া', price: '২৪৫ টাকা/কেজি', trend: '▼ -২%', up: false },
    { name: '🍃 ধনেপাতা গুঁড়া', price: '২৬৫ টাকা/কেজি', trend: '- 0.0%', up: null },
  ];

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <Toaster position="top-center" />
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-3 cursor-pointer">
          <div className="relative w-10 h-10 flex items-center justify-center bg-green-600 rounded-2xl border border-green-100 overflow-hidden">
            <Image 
              src="/logo-icon.png"
              alt="Bazar Dor Logo"
              width={28}
              height={28}
              className="object-contain"
            />
          </div>
          <div>
            <span className="text-xl font-extrabold text-gray-900 tracking-tight">বাজার দর</span>
            <p className="text-xs text-gray-500">শনিবার, ১০ অক্টোবর, ২০২৬</p>
          </div>
        </Link>

        {/* User profile / Auth links / Dropdown */}
        <div className="flex items-center gap-4">
          {session?.user ? (
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-full border border-gray-200 transition cursor-pointer select-none"
              >
                <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {session.user.name?.[0] || 'U'}
                </span>
                <span className="text-sm font-semibold text-gray-800">
                  {session.user.name || 'User'}
                </span>
                <span className="text-xs text-gray-400">▼</span>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-xs text-gray-400">Logged in as:</p>
                    <p className="text-sm font-bold text-gray-800 truncate">{session.user.email}</p>
                  </div>

                  <div className="py-1">
                    <Link 
                      href="/profile" 
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium"
                    >
                      আমার প্রোফাইল
                    </Link>
                    <button 
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-semibold cursor-pointer"
                    >
                      সাইন আউট
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/signin" className="text-sm font-semibold text-gray-700 hover:text-green-600 transition">
                সাইন ইন
              </Link>
              <Link href="/signup" className="bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-sm hover:bg-green-700 transition">
                সাইন আপ
              </Link>
            </div>
          )}
        </div>

      </div>

      {/* Category Navigation Bar */}
      <div className="border-t border-gray-100 bg-white overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 py-3 no-scrollbar">
          {categories.map((cat, idx) => {
            const isActive = pathname === `/category/${cat.slug}`;
            return (
              <Link 
                key={idx}
                href={`/category/${cat.slug}`}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${
                  isActive 
                    ? 'bg-green-600 text-white shadow-sm' 
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Running Price Ticker (Marquee Effect) */}
      <div className="bg-green-50/70 border-t border-b border-green-100 py-2 overflow-hidden flex items-center">
        
        <div className="flex overflow-hidden relative w-full">
          <div className="flex gap-8 whitespace-nowrap animate-marquee items-center text-xs font-medium text-gray-700">
            {tickerItems.concat(tickerItems).map((item, index) => (
              <span key={index} className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-green-100 shadow-2xs">
                <span>{item.name}:</span>
                <strong className="text-gray-900">{item.price}</strong>
                <span className={`font-semibold ${item.up === true ? 'text-red-500' : item.up === false ? 'text-green-600' : 'text-gray-500'}`}>
                  {item.trend}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Marquee Animation CSS */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 45s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </header>
  );
}