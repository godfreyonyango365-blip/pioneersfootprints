"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";

export default function DonatePage() {
  const mpesaNumber = "0742767609";
  const paybill = "400200";
  const account = "01102953561001";

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied successfully!");
    } catch {
      alert("Failed to copy.");
    }
  };

  return (
    <>
      {/* Header */}
      <Navbar />

      <main className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">

        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-700 via-blue-900 to-indigo-900 text-white py-3">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h1 className="text-5xl font-extrabold mb-6">
              Support Pioneers Footprints
            </h1>

            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Your generous support helps in publishing, medical missionary work, digital media,
              literature evangelism, and missionary outreach across Kenya and
              beyond.
            </p>
          </div>
        </section>

        {/* Donation Cards */}
        <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-8">

          {/* MPESA */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8">

            <div className="text-center mb-8">
              <div className="text-5xl mb-3">📱</div>

              <h2 className="text-3xl font-bold text-green-700 dark:text-green-400">
                M-Pesa
              </h2>

              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Send Money Directly
              </p>
            </div>

            <div className="bg-green-50 dark:bg-green-950 rounded-xl p-5 space-y-4">

              <div>
                <p className="text-gray-500">Phone Number</p>

                <h3 className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {mpesaNumber}
                </h3>
              </div>

            </div>

            <button
              onClick={() => copyToClipboard(mpesaNumber)}
              className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition"
            >
              Copy Phone Number
            </button>

          </div>

          {/* BANK */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8">

            <div className="text-center mb-8">

              <div className="text-5xl mb-3">🏦</div>

              <h2 className="text-3xl font-bold text-blue-700 dark:text-blue-400">
                Bank Paybill
              </h2>

              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Deposit through M-Pesa Paybill
              </p>

            </div>

            <div className="bg-blue-50 dark:bg-blue-950 rounded-xl p-5 space-y-6">

              <div className="flex justify-between">
                <span className="font-semibold">Paybill</span>

                <span className="font-bold text-blue-700 dark:text-blue-300">
                  {paybill}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-semibold">Account Number</span>

                <span className="font-bold text-blue-700 dark:text-blue-300">
                  {account}
                </span>
              </div>

            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">

              <button
                onClick={() => copyToClipboard(paybill)}
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
              >
                Copy Paybill
              </button>

              <button
                onClick={() => copyToClipboard(account)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition"
              >
                Copy Account
              </button>

            </div>

          </div>

        </section>

        {/* Ministry Section */}
        <section className="max-w-6xl mx-auto px-6 pb-20">

          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-10">

            <h2 className="text-4xl font-bold text-center mb-10 text-gray-900 dark:text-white">
              Your Donations Support
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

              <div className="rounded-xl border dark:border-gray-700 p-6">
                <div className="text-4xl mb-3">🖨️</div>
                <h3 className="font-bold text-xl mb-2">
                  Printing Press
                </h3>

                <p className="text-gray-600 dark:text-gray-400">
                  Printing Present Truth literature, books, tracts,
                  health materials and missionary resources.
                </p>
              </div>

              <div className="rounded-xl border dark:border-gray-700 p-6">
                <div className="text-4xl mb-3">📚</div>
                <h3 className="font-bold text-xl mb-2">
                  Publications
                </h3>

                <p className="text-gray-600 dark:text-gray-400">
                  Publishing Adventist pioneer writings,
                  Bible study guides and educational materials.
                </p>
              </div>


              <div className="rounded-xl border dark:border-gray-700 p-6">
                <div className="text-4xl mb-3">🎥</div>
                <h3 className="font-bold text-xl mb-2">
                  Digital Media Ministry
                </h3>

                <p className="text-gray-600 dark:text-gray-400">
                  Producing videos, livestreams,
                  documentaries and online evangelism resources.
                </p>
              </div>

             

            </div>

          </div>

        </section>

      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}