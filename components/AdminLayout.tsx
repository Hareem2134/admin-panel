"use client";
import { FC, ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";

const AdminLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const { isSignedIn } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Detect screen size for proper sidebar handling
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Mobile & Tablet Menu Button (Now visible for 768px - 1023px) */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded-md"
        onClick={() => setSidebarOpen(true)}
      >
        <FiMenu size={24} />
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || isDesktop) && (
          <motion.div
            initial={{ x: -250, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -250, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`fixed lg:fixed inset-y-0 left-0 w-64 bg-gray-800 text-white p-5 flex flex-col h-screen shadow-lg z-40
              ${sidebarOpen ? "translate-x-0" : "hidden md:flex md:translate-x-0"}`}
          >
            {/* Close Button for Mobile & Tablet */}
            <button
              className="lg:hidden absolute top-4 right-4 text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <FiX size={24} />
            </button>

            {/* Sidebar Content */}
            <div className="flex flex-col flex-grow justify-between">
              <div>
                <h2 className="text-xl font-bold mb-5 text-center">Admin Panel</h2>
                <nav className="space-y-4">
                  {[
                    { name: "Dashboard", href: "/" },
                    { name: "Orders", href: "/orders" },
                    { name: "Products", href: "/products" },
                    { name: "Discounts", href: "/discounts" },
                    { name: "Bulk Upload", href: "/products/bulk-upload" },
                  ].map((item) => (
                    <Link key={item.href} href={item.href}>
                      <motion.p
                        whileHover={{ scale: 1.05, backgroundColor: "#374151" }}
                        transition={{ duration: 0.2 }}
                        className="block py-2 px-4 rounded transition-colors hover:text-gray-300"
                      >
                        {item.name}
                      </motion.p>
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Sign In / Sign Out Button - Centered & Sticks to Bottom */}
              <div className="p-4 border-t border-gray-700 flex justify-center">
                {isSignedIn ? <UserButton afterSignOutUrl="/" /> : <SignInButton />}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`flex-1 p-6 bg-gray-100 transition-all ${isDesktop ? "ml-64" : ""}`}
      >
        {children}
      </motion.main>
    </div>
  );
};

export default AdminLayout;
