import { Link } from "react-router-dom";
import React from "react";

export default function Home() {
  return (
    <div className="w-full flex flex-col items-center bg-[#f7f8fa]">
      {/* HERO SECTION */}
      <section className="w-full max-w-7xl px-6 lg:px-12 py-20 grid md:grid-cols-2 gap-12 items-center">
        {/* LEFT */}
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            The Future of <br /> Library Management
          </h1>

          <p className="mt-4 text-gray-600 text-lg">
            An intelligent, all-in-one system for modern libraries.
          </p>

          <Link
            to="/signup"
            className="mt-8 inline-block bg-blue-600 text-white font-medium px-7 py-3 rounded-md hover:bg-blue-700 transition"
          >
            Get Started
          </Link>
        </div>

        {/* RIGHT */}
        <div className="flex justify-center">
          <img
            src="/library.png"
            alt="Library"
            className="rounded-xl w-[360px] h-[360px] object-cover shadow-md"
          />
        </div>
      </section>

      {/* FEATURES */}
      <section className="w-full bg-white py-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Discover the Power of SmartLibX
          </h2>

          <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-base">
            Our system is designed to streamline your library's operations,
            making management effortless and efficient for staff and patrons
            alike.
          </p>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* CARD 1 */}
            <div className="bg-gray-100 p-6 rounded-xl text-left shadow-sm border border-gray-200">
              <span className="text-blue-600 text-3xl">🔍</span>
              <h3 className="text-xl font-semibold mt-3">
                Effortless Book Search
              </h3>
              <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                Find any book in seconds with our powerful and intuitive smart
                search functionality.
              </p>
            </div>

            {/* CARD 2 */}
            <div className="bg-gray-100 p-6 rounded-xl text-left shadow-sm border border-gray-200">
              <span className="text-blue-600 text-3xl">💳</span>
              <h3 className="text-xl font-semibold mt-3">Seamless Checkouts</h3>
              <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                A streamlined process for borrowing and returning books,
                reducing wait times for everyone.
              </p>
            </div>

            {/* CARD 3 */}
            <div className="bg-gray-100 p-6 rounded-xl text-left shadow-sm border border-gray-200">
              <span className="text-blue-600 text-3xl">📚</span>
              <h3 className="text-xl font-semibold mt-3">Digital Cataloging</h3>
              <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                Easily manage your entire collection with our automated digital
                cataloging system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="w-full py-20 px-6 text-center bg-[#f7f8fa]">
        <p className="text-xl italic text-gray-700 max-w-3xl mx-auto">
          "SmartLibX has transformed how we manage our library. It's intuitive,
          powerful, and has saved us countless hours of administrative work."
        </p>
        <p className="mt-6 font-semibold text-gray-900">
          Jane Doe, Head Librarian
        </p>
      </section>
    </div>
  );
}
