import React from "react";

export default function About() {
  return (
    <div className="w-full text-gray-800">
      {/* ---------------- HERO SECTION ---------------- */}
      <section
        className="relative mt-10 h-[380px] bg-cover bg-center rounded-2xl mx-4 md:mx-10 lg:mx-20 overflow-hidden"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC6EUSC-xrYrpM48_xq-JgdGeu7G9JW-HYWW3fsFGtYrn6xIbb6keoPw6faQqTF7HyK_aaBAHRRbFFp5waB9ZqQeB1EwdTvTlviypHppbHVuM1H3mcU11bbcin0A_bXnWGuDyuBxgxJqnTjT-D510ZLPVTgNhQNPGbDxT1rujfF9lMrpvAQmSvcktTeTUylq4yuunXo0paWE9_Vdq9VAwkTB27E9NjH0Hyhz6iMLLFU6EybFP8uZ-ZBRQQxrG53jt9tFNhj6DpV3lZe')",
        }}
      >
        <div className="w-full h-full bg-black/40 flex flex-col justify-center items-center text-center px-6 md:px-10">
          <h1 className="text-white text-4xl md:text-5xl font-bold leading-tight">
            Revolutionizing Libraries for the
            <br />
            Digital Age
          </h1>
          <p className="text-gray-200 mt-4 max-w-2xl">
            SmartLibX is a modern library management system designed to empower
            libraries and connect communities with knowledge seamlessly and
            intelligently.
          </p>
        </div>
      </section>

      {/* ---------------- MISSION + VISION ---------------- */}
      <section className="py-16 px-6 md:px-16 max-w-6xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-10">
          Our Mission & Vision
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission */}
          <div className="bg-white rounded-xl shadow p-8 text-left border">
            <div className="text-blue-600 text-3xl mb-4">🎯</div>
            <h3 className="font-semibold text-xl mb-2">Our Mission</h3>
            <p className="text-gray-600">
              To empower libraries of all sizes with intelligent, intuitive, and
              integrated management tools that support learning and community
              engagement.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-white rounded-xl shadow p-8 text-left border">
            <div className="text-blue-600 text-3xl mb-4">👁️</div>
            <h3 className="font-semibold text-xl mb-2">Our Vision</h3>
            <p className="text-gray-600">
              To create a world where every individual has seamless access to
              information—making knowledge universally available and inspiring a
              new generation of learners.
            </p>
          </div>
        </div>
      </section>
      {/* ---------------- OUR STORY ---------------- */}
      <section className="bg-gray-50 py-16 px-6 md:px-16">
        <h2 className="text-2xl md:text-3xl text-center font-bold mb-10">
          Our Story
        </h2>

        <div className="max-w-4xl mx-auto border-l-2 border-gray-300 pl-8 space-y-12">
          {/* 2018 */}
          <div className="relative">
            <span className="absolute -left-4 top-1 w-3 h-3 bg-blue-600 rounded-full"></span>
            <h4 className="font-semibold text-lg">2018</h4>
            <p className="font-medium">Founding of SmartLibX</p>
            <p className="text-gray-600">
              A team of librarians and developers came together with a shared
              vision to modernize library technology.
            </p>
          </div>

          {/* 2020 */}
          <div className="relative">
            <span className="absolute -left-4 top-1 w-3 h-3 bg-green-600 rounded-full"></span>
            <h4 className="font-semibold text-lg">2020</h4>
            <p className="font-medium">Launch of Version 1.0</p>
            <p className="text-gray-600">
              Our first public release with core features like cataloging,
              circulation, and user management.
            </p>
          </div>

          {/* 2023 */}
          <div className="relative">
            <span className="absolute -left-4 top-1 w-3 h-3 bg-purple-600 rounded-full"></span>
            <h4 className="font-semibold text-lg">2023</h4>
            <p className="font-medium">100+ Libraries Served</p>
            <p className="text-gray-600">
              A milestone as we partnered with over 100 institutions to enhance
              their library services.
            </p>
          </div>
        </div>
      </section>
      {/* ---------------- TEAM SECTION ---------------- */}
      <section className="py-20 px-6 md:px-16 max-w-6xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          The Innovators Behind SmartLibX
        </h2>

        <p className="text-gray-600 max-w-3xl mx-auto mb-12">
          We are a team of thinkers, creators, and problem-solvers passionate
          about the future of information access.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Member 1 */}
          <div>
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              className="w-24 h-24 mx-auto rounded-full mb-3 object-cover"
              alt=""
            />
            <h4 className="font-semibold">Alex Johnson</h4>
            <p className="text-sm text-gray-500">Founder & CEO</p>
          </div>

          {/* Member 2 */}
          <div>
            <img
              src="https://randomuser.me/api/portraits/women/44.jpg"
              className="w-24 h-24 mx-auto rounded-full mb-3 object-cover"
              alt=""
            />
            <h4 className="font-semibold">Maria Garcia</h4>
            <p className="text-sm text-gray-500">Lead Developer</p>
          </div>

          {/* Member 3 */}
          <div>
            <img
              src="https://randomuser.me/api/portraits/men/55.jpg"
              className="w-24 h-24 mx-auto rounded-full mb-3 object-cover"
              alt=""
            />
            <h4 className="font-semibold">David Chen</h4>
            <p className="text-sm text-gray-500">Head of Product</p>
          </div>

          {/* Member 4 */}
          <div>
            <img
              src="https://randomuser.me/api/portraits/women/22.jpg"
              className="w-24 h-24 mx-auto rounded-full mb-3 object-cover"
              alt=""
            />
            <h4 className="font-semibold">Emily White</h4>
            <p className="text-sm text-gray-500">UX/UI Designer</p>
          </div>
        </div>
      </section>
      {/* ---------------- CTA SECTION ---------------- */}
      <section className="py-20 px-6 bg-blue-600 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Modernize Your Library?
          </h2>
          <p className="mb-6">
            Discover how SmartLibX can streamline operations, engage your
            community, and unlock new possibilities.
          </p>

          <button className="px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg shadow hover:bg-gray-100">
            See SmartLibX in Action
          </button>
        </div>
      </section>
      {/* ---------------- FOOTER ---------------- */}
      {/* <footer className="py-12 px-6 md:px-16 bg-gray-100 text-gray-600">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">SmartLibX</h4>
            <p className="text-sm">
              The intelligent library management system for the modern age.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>Features</li>
              <li>Pricing</li>
              <li>Updates</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>About Us</li>
              <li>Contact</li>
              <li>Careers</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>Terms of Service</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
        </div>

        <p className="text-center mt-10 text-xs text-gray-500">
          © 2024 SmartLibX. All rights reserved.
        </p>
      </footer> */}
    </div>
  );
}
