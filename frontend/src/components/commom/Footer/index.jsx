// Components/Footer.jsx
import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-4 gap-10 text-gray-700">
        {/* BRAND */}
        <div>
          <div className="flex items-center gap-2">
            {/* <i className="pi pi-book text-blue-600 text-2xl"></i> */}
            <span className="text-xl font-semibold text-gray-900">
              SmartLibX
            </span>
          </div>
          <p className="mt-3 text-sm text-gray-600">
            Modernizing libraries, one click at a time.
          </p>
        </div>

        {/* PRODUCT */}
        <div>
          <h4 className="font-semibold mb-3">PRODUCT</h4>
          <ul className="space-y-2 text-sm">
            <li>Features</li>
            <li>Pricing</li>
            <li>Request a Demo</li>
          </ul>
        </div>

        {/* COMPANY */}
        <div>
          <h4 className="font-semibold mb-3">COMPANY</h4>
          <ul className="space-y-2 text-sm">
            <li>About Us</li>
            <li>Contact</li>
            <li>Careers</li>
          </ul>
        </div>

        {/* LEGAL */}
        <div>
          <h4 className="font-semibold mb-3">LEGAL</h4>
          <ul className="space-y-2 text-sm">
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
          </ul>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="text-center pt-8 text-sm text-gray-600">
        © {new Date().getFullYear()} SmartLibX. All rights reserved.
      </div>
    </footer>
  );
}
