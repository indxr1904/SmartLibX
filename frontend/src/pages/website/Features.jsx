import React from "react";
import { useState } from "react";

export default function Features() {
  const [activeTab, setActiveTab] = useState("librarian");
  return (
    <div className="w-full">
      {/* ===================== HERO SECTION ===================== */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Section */}
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0d1a3b] leading-tight">
            Modernizing Library <br /> Management for the <br /> Digital Age
          </h1>

          <p className="text-gray-600 mt-4 max-w-lg">
            SmartLibX simplifies operations, enhances user engagement, and
            provides powerful insights to unlock your library’s full potential.
          </p>

          <button className="mt-6 px-6 py-3 bg-teal-500 text-white rounded-lg shadow hover:bg-teal-600">
            Explore a Demo
          </button>
        </div>

        {/* Right Image */}
        <div>
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6HLQEcJvjDRuJK7LpuBaY7KqlV9F38Pe0Cznl0KPM61vl4jsCxAKm9w1SzexqYqV9X-88LsWUYuLvXKy5Lmrhsr-7Rj-b1Xxp-Gif_iOs0PGikVntAL8FLtSWD5SsBU5mnZFe7pTGG22InogGRCBBmr6kezSr71oySxirs3wrDtlEbYz_nxQD1x-xp5aZPV2SFPpDZg1ozmak3Z_FSCmOW9fv5vsGD7xdd_ASRFhZas7b8PO5_bm46WfOAdGfmuiebQ-NFr6ssJR3"
            alt="Feature Illustration"
            className="w-full rounded-xl shadow-lg"
          />
        </div>
      </section>

      {/* ===================== FEATURE CARDS ===================== */}
      <section className="bg-[#f7f9fc] py-20 text-center px-6">
        <h2 className="text-3xl font-bold text-[#0d1a3b]">
          Everything You Need in One Smart System
        </h2>

        <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
          Discover the powerful tools that make SmartLibX the ultimate library
          management solution.
        </p>

        {/* Cards */}
        <div className="max-w-6xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* User Management */}
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <div className="text-3xl mb-3">👤</div>
            <h3 className="font-semibold text-[#0d1a3b]">User Management</h3>
            <p className="text-gray-600 text-sm mt-2">
              Easily manage students, faculty, and staff profiles with
              simplicity and control.
            </p>
          </div>

          {/* Book Tracking */}
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <div className="text-3xl mb-3">📚</div>
            <h3 className="font-semibold text-[#0d1a3b]">Book Tracking</h3>
            <p className="text-gray-600 text-sm mt-2">
              Real-time inventory updates, check-in/out automation, and overdue
              alerts.
            </p>
          </div>

          {/* Assignment Capabilities */}
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <div className="text-3xl mb-3">📝</div>
            <h3 className="font-semibold text-[#0d1a3b]">
              Assignment Capabilities
            </h3>
            <p className="text-gray-600 text-sm mt-2">
              Seamlessly manage book lending with advanced student tracking.
            </p>
          </div>

          {/* Reporting & Analytics */}
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-semibold text-[#0d1a3b]">
              Reporting & Analytics
            </h3>
            <p className="text-gray-600 text-sm mt-2">
              Understand library usage with smart, visual, and actionable data.
            </p>
          </div>
        </div>
      </section>

      {/* ===================== TAILORED FOR EVERY USER ===================== */}
      <>
        {/* ===================== TAILORED FOR EVERY USER ===================== */}
        <section className="py-20 px-6 max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#0d1a3b]">
            Tailored for Every User
          </h2>

          {/* Tabs */}
          <div className="mt-8 flex justify-center gap-8 text-gray-600 text-sm">
            <button
              onClick={() => setActiveTab("librarian")}
              className={`pb-2 transition ${
                activeTab === "librarian"
                  ? "border-b-2 border-[#0d1a3b] font-medium text-[#0d1a3b]"
                  : "hover:text-[#0d1a3b]"
              }`}
            >
              For Librarians
            </button>

            <button
              onClick={() => setActiveTab("student")}
              className={`pb-2 transition ${
                activeTab === "student"
                  ? "border-b-2 border-[#0d1a3b] font-medium text-[#0d1a3b]"
                  : "hover:text-[#0d1a3b]"
              }`}
            >
              For Students
            </button>
          </div>

          {/* ===================== Librarian Section ===================== */}
          {activeTab === "librarian" && (
            <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
              <div className="text-left">
                <h3 className="text-xl font-semibold text-[#0d1a3b]">
                  Streamline Your Workflow
                </h3>

                <p className="text-gray-600 mt-3">
                  SmartLibX automates tedious cataloging and circulation tasks,
                  allowing librarians to focus on community engagement and
                  learning.
                </p>

                <ul className="mt-4 space-y-2 text-gray-700">
                  <li>✔ Automated book check-in/out</li>
                  <li>✔ Detailed reporting & insights</li>
                  <li>✔ Integration with school systems</li>
                </ul>
              </div>

              <div>
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBey-LavNqmD4jeHuvq1_PYdkKvB8KoaZRk0VU2kZcvGhcZ3F_R7AlUcZtmsfYBIGV7Hyw2ijAjPbWTg8_HCAgFy5_jKI_4oLvR7jZP-aLdbnzxhgDhaQ4nrP5hc3frE4wFoKTrYlkXYlw0t51E_WZhTOY4x7ecO4iwr7AYAO66_OVR2p_7eS7JsRcF11omof4tPaz49na-ar6Cat_DmVum72BbceNHMipgL7mHNmevXBufK03FM2zrlYiWw-HcpMRcxD6eAREjio6u"
                  alt="Librarian Illustration"
                  className="rounded-xl shadow-lg"
                />
              </div>
            </div>
          )}

          {/* ===================== Student Section ===================== */}
          {activeTab === "student" && (
            <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
              <div className="text-left">
                <h3 className="text-xl font-semibold text-[#0d1a3b]">
                  Designed for Student Success
                </h3>

                <p className="text-gray-600 mt-3">
                  SmartLibX gives students quick access to library resources,
                  personalized recommendations, and real-time book availability.
                </p>

                <ul className="mt-4 space-y-2 text-gray-700">
                  <li>✔ View assigned books easily</li>
                  <li>✔ Check availability instantly</li>
                  <li>✔ Receive due-date reminders</li>
                </ul>
              </div>

              <div>
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsdmMId6HFlyl8Y8uvMePY3kw9T8Xc_1-MwHCdlHbHB5aPbBwKkfC9Km3df40sqWTEsso7ScNhA3KGc2ILcMF_xzeW13FLqS8nIGbsm5PqxOu8z_1EyVEcNKv2mNEHd8v1nPcSBMWoFAPLBPDG9m5sV773P4pwkdrf4IcXQ4SKnKxDf6oSd9-V-46Jsi40OQ_0GuYb4k2vJRRQqFN3VlwdCVKI3jV8YAJx18sPSDYr7GVHTM7gi9Uc_-bCbbOQ35Y5sh7VPmw90z2-"
                  alt="Student Illustration"
                  className="rounded-xl shadow-lg"
                />
              </div>
            </div>
          )}
        </section>
      </>
      {/* ===================== TESTIMONIALS ===================== */}
      <section className="bg-[#f7f9fc] py-20 px-6">
        <h2 className="text-3xl font-bold text-center text-[#0d1a3b]">
          Trusted by Leading Institutions
        </h2>

        <div className="max-w-6xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-700 text-sm">
              “SmartLibX has revolutionized how we manage our library.”
            </p>

            <div className="flex items-center gap-3 mt-4">
              <img
                src="https://i.pravatar.cc/50?img=12"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h4 className="font-semibold text-[#0d1a3b]">Sarah Johnson</h4>
                <p className="text-gray-500 text-sm">
                  Head Librarian, Northwood Academy
                </p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-700 text-sm">
              “Our students love the new system. The usability is exceptional.”
            </p>

            <div className="flex items-center gap-3 mt-4">
              <img
                src="https://i.pravatar.cc/50?img=32"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h4 className="font-semibold text-[#0d1a3b]">David Chen</h4>
                <p className="text-gray-500 text-sm">
                  Director of Tech, Oakridge District
                </p>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-700 text-sm">
              “This system is powerful, intuitive, and perfect for admins.”
            </p>

            <div className="flex items-center gap-3 mt-4">
              <img
                src="https://i.pravatar.cc/50?img=19"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h4 className="font-semibold text-[#0d1a3b]">Maria Garcia</h4>
                <p className="text-gray-500 text-sm">
                  School Admin, Lakeside Prep
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== CTA SECTION ===================== */}
      <section className="max-w-6xl mx-auto bg-blue-600 text-white rounded-xl px-8 py-12 mt-16 mb-10 text-center">
        <h2 className="text-2xl md:text-3xl font-bold">
          Ready to Modernize Your Library?
        </h2>

        <p className="mt-3 text-blue-100 max-w-2xl mx-auto">
          Discover how SmartLibX can streamline your operations and unlock new
          possibilities.
        </p>

        <button className="mt-6 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold shadow hover:bg-blue-100">
          See SmartLibX in Action
        </button>
      </section>
    </div>
  );
}
