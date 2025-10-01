"use client";

import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#2d1457] text-white pt-8">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 pb-6">
        {/* Useful Links */}
        <div>
          <h2 className="font-bold text-lg mb-3">Useful Links</h2>
          <ul className="space-y-1 text-sm">
            <li><a href="#" className="hover:underline">Kent Service</a></li>
            <li><a href="#" className="hover:underline">Pureit Service</a></li>
            <li><a href="#" className="hover:underline">Livpure Service</a></li>
            <li><a href="#" className="hover:underline">Customer Care</a></li>
            <li><a href="#" className="hover:underline"> </a></li>
            <li><a href="#" className="hover:underline">AMC Plans</a></li>
            <li><a href="#" className="hover:underline">Repair Service</a></li>
          </ul>
        </div>
        {/* RO Service Cities */}
        <div>
          <h2 className="font-bold text-lg mb-3">RO Service Cities</h2>
          <ul className="space-y-1 text-sm">
            <li><a href="#" className="hover:underline">Delhi</a></li>
            <li><a href="#" className="hover:underline">Gurgaon</a></li>
            <li><a href="#" className="hover:underline">Noida</a></li>
            <li><a href="#" className="hover:underline">Mumbai</a></li>
            <li><a href="#" className="hover:underline">Bangalore</a></li>
            <li><a href="#" className="hover:underline">Pune</a></li>
            <li><a href="#" className="hover:underline">Hyderabad</a></li>
          </ul>
        </div>

        {/* Kent RO Service Cities */}
        <div>
          <h2 className="font-bold text-lg mb-3">Kent RO Cities</h2>
          <ul className="space-y-1 text-sm">
            <li><a href="#" className="hover:underline">Lucknow</a></li>
            <li><a href="#" className="hover:underline">Chandigarh</a></li>
            <li><a href="#" className="hover:underline">Jaipur</a></li>
            <li><a href="#" className="hover:underline">Indore</a></li>
            <li><a href="#" className="hover:underline">Kolkata</a></li>
            <li><a href="#" className="hover:underline">Ahmedabad</a></li>
            <li><a href="#" className="hover:underline">Surat</a></li>
          </ul>
        </div>

        {/* Address & Social */}
        <div>
          <h2 className="font-bold text-lg mb-3">Contact Us</h2>
          <p className="text-sm leading-5">
            Unit No. 831, 8th Floor, JMD MEGAPOLIS, <br />
            Sector 48, Gurugram, Haryana 122018
          </p>
          {/* Social Media Icons */}
          <div className="flex space-x-3 mt-3">
            <a href="#" className="bg-blue-600 hover:bg-blue-700 p-2 rounded-full">
              <Facebook size={16} />
            </a>
            <a href="#" className="bg-sky-400 hover:bg-sky-500 p-2 rounded-full">
              <Twitter size={16} />
            </a>
            <a href="#" className="bg-blue-700 hover:bg-blue-800 p-2 rounded-full">
              <Linkedin size={16} />
            </a>
            <a href="#" className="bg-pink-600 hover:bg-pink-700 p-2 rounded-full">
              <Instagram size={16} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#1a093a] py-3 px-6 flex flex-col md:flex-row items-center justify-between text-xs">
        <span>Copyright © {new Date().getFullYear()} RO Customer Care</span>
        <div className="flex space-x-4 mt-2 md:mt-0">
          <a href="#" className="hover:underline">Home</a>
          <a href="#" className="hover:underline">Terms</a>
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
