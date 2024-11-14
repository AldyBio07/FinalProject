import React from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const Footer = ({ role = "user" }) => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
  ];

  const userLinks = [
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ];

  const adminLinks = [
    { name: "Dashboard", href: "/admin" },
    { name: "User Management", href: "/users" },
    { name: "System Logs", href: "/logs" },
    { name: "Settings", href: "/settings" },
  ];

  const currentLinks = role === "admin" ? adminLinks : userLinks;

  return (
    <footer className="text-gray-300 bg-gray-900">
      <div className="px-4 pt-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold text-white">TravelLog</h3>
            <p className="mt-4 text-sm text-gray-400">
              Share your travel experiences with the world. Create memories that
              last forever.
            </p>
            <div className="flex mt-6 space-x-6">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="text-gray-400 transition-colors duration-200 hover:text-white"
                  >
                    <Icon className="w-6 h-6" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-semibold tracking-wider text-white uppercase">
                Quick Links
              </h3>
              <ul className="mt-4 space-y-4">
                {currentLinks.slice(0, 2).map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-400 transition-colors duration-200 hover:text-white"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-wider text-white uppercase">
                Support
              </h3>
              <ul className="mt-4 space-y-4">
                {currentLinks.slice(2).map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-400 transition-colors duration-200 hover:text-white"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-white uppercase">
              Contact Us
            </h3>
            <ul className="mt-4 space-y-4">
              <li className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-gray-400" />
                <span>123 Travel Street, Adventure City</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-2 text-gray-400" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-2 text-gray-400" />
                <span>support@travellog.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 mt-12 border-t border-gray-800">
          <p className="text-sm text-center text-gray-400">
            © {currentYear} TravelLog. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
