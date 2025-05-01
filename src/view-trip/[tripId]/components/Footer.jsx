import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-100 py-6 mt-10">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-600">Trip Trekker</h2>
        <nav className="mt-4 md:mt-0">
          <ul className="flex space-x-4 text-sm text-gray-500">
            <li><a href="/about" className="hover:text-gray-800">About</a></li>
            <li><a href="/contact" className="hover:text-gray-800">Contact</a></li>
            <li><a href="/privacy" className="hover:text-gray-800">Privacy</a></li>
          </ul>
        </nav>
      </div>
      <div className="text-center text-xs text-gray-400 mt-4">
        © {new Date().getFullYear()} Trip Trekker. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
