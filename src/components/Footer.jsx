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
    <footer className="bg-[#1A1917] text-white">
      <div className="px-4 pt-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-1">
              <h3 className="text-2xl font-black text-[#FF690F]">travel</h3>
              <h3 className="text-2xl font-black text-[#FF690F]">.journey</h3>
            </div>
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
                    className="text-gray-400 transition-colors duration-200 hover:text-[#FF690F]"
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
              <h3 className="text-sm font-semibold tracking-wider text-[#FF690F] uppercase">
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
              <h3 className="text-sm font-semibold tracking-wider text-[#FF690F] uppercase">
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
            <h3 className="text-sm font-semibold tracking-wider text-[#FF690F] uppercase">
              Contact Us
            </h3>
            <ul className="mt-4 space-y-4">
              <li className="flex items-center group">
                <MapPin className="w-5 h-5 mr-2 text-gray-400 group-hover:text-[#FF690F]" />
                <span className="text-gray-400 transition-colors duration-200 group-hover:text-white">
                  Jl. Jendral Sudirman, Jakarta
                </span>
              </li>
              <li className="flex items-center group">
                <Phone className="w-5 h-5 mr-2 text-gray-400 group-hover:text-[#FF690F]" />
                <span className="text-gray-400 transition-colors duration-200 group-hover:text-white">
                  +(62) 81 2345 6789
                </span>
              </li>
              <li className="flex items-center group">
                <Mail className="w-5 h-5 mr-2 text-gray-400 group-hover:text-[#FF690F]" />
                <span className="text-gray-400 transition-colors duration-200 group-hover:text-white">
                  support@travel-journey.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 mt-12 border-t border-gray-800">
          <p className="text-sm text-center text-gray-400">
            © {currentYear}{" "}
            <span className="text-[#FF690F]">travel.journey</span>. Create By
            Aldy Bio.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
