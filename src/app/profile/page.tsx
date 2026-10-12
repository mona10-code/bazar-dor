'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createAuthClient } from 'better-auth/react';
import Link from 'next/link';

const authClient = createAuthClient();

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending, refetch } = authClient.useSession();
  
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isPending) {
      if (!session?.user) {
        router.push('/signin');
      } else {
        setName(session.user.name || '');
        setLoading(false);
      }
    }
  }, [session, isPending, router]);

  // Handle Profile Update (Name update)
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authClient.updateUser({
        name: name,
      }, {
        onSuccess: () => {
          setMessage('প্রোফাইল সফলভাবে আপডেট হয়েছে!');
          setIsEditing(false);
          refetch(); // Session refresh
        },
        onError: (ctx) => {
          setMessage(ctx.error.message || 'আপডেট করতে সমস্যা হয়েছে');
        }
      });
    } catch (err) {
      setMessage('কিছু সমস্যা হয়েছে, আবার চেষ্টা করুন');
    }
  };

  // Handle Sign Out
  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/');
        },
      },
    });
  };

  if (isPending || loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 text-lg animate-pulse">লোড হচ্ছে...</p>
      </div>
    );
  }

  const user = session?.user;

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-sm space-y-8">
        
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-gray-100">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-4xl shadow-md">
              {user?.name?.[0] || 'U'}
            </div>
            <div className="text-center sm:text-left space-y-1">
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                {user?.name || 'ব্যবহারকারী'}
              </h1>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <span className="inline-block bg-green-50 text-green-600 text-xs font-semibold px-3 py-1 rounded-full mt-2">
                ভেরিফাইড অ্যাকাউন্ট
              </span>
            </div>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="bg-red-50 text-red-600 hover:bg-red-100 px-5 py-2.5 rounded-xl font-semibold text-sm transition"
          >
            সাইন আউট
          </button>
        </div>

        {message && (
          <div className="bg-green-50 text-green-700 text-sm p-3 rounded-xl text-center font-medium">
            {message}
          </div>
        )}

        {/* Profile Details or Edit Form */}
        {!isEditing ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-1">
                <p className="text-xs text-gray-400 font-semibold">পূর্ণ নাম</p>
                <p className="text-base font-bold text-gray-800">{user?.name || 'দেওয়া হয়নি'}</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-1">
                <p className="text-xs text-gray-400 font-semibold">ইমেল ঠিকানা</p>
                <p className="text-base font-bold text-gray-800">{user?.email || 'দেওয়া হয়নি'}</p>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-gray-900 text-white py-3 px-6 rounded-xl font-semibold text-sm shadow-sm hover:bg-black transition"
              >
                প্রোফাইল এডিট করুন
              </button>
              <Link
                href="/"
                className="bg-green-600 text-white py-3 px-6 rounded-xl font-semibold text-sm shadow-sm hover:bg-green-700 transition flex items-center justify-center"
              >
                হোম পেজে ফিরে যান
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-xl">
            <h3 className="text-lg font-bold text-gray-800">প্রোফাইল তথ্য হালনাগাদ করুন</h3>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">আপনার নাম</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-600"
                required
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="bg-green-600 text-white py-2.5 px-6 rounded-xl font-semibold text-sm shadow-sm hover:bg-green-700 transition"
              >
                সংরক্ষণ করুন
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-100 text-gray-700 py-2.5 px-6 rounded-xl font-semibold text-sm hover:bg-gray-200 transition"
              >
                বাতিল
              </button>
            </div>
          </form>
        )}

      </div>
    </main>
  );
}