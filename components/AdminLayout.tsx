import { FC, ReactNode } from "react";
import Link from "next/link";

const AdminLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-5">
        <h2 className="text-xl font-bold mb-5">Admin Panel</h2>
        <nav className="space-y-4">
          <Link href="/dashboard">
            <p className="block py-2 px-4 rounded hover:bg-gray-700">Dashboard</p>
          </Link>
          <Link href="/orders">
            <p className="block py-2 px-4 rounded hover:bg-gray-700">Orders</p>
          </Link>
          <Link href="/products">
            <p className="block py-2 px-4 rounded hover:bg-gray-700">Products</p>
          </Link>
          <Link href="/discounts">
            <p className="block py-2 px-4 rounded hover:bg-gray-700">Discounts</p>
          </Link>
          <Link href="/products/bulk-upload">
          <p className="block py-2 px-4 rounded hover:bg-gray-700">Bulk Upload</p>
          </Link>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6 bg-gray-100">{children}</main>
    </div>
  );
};

export default AdminLayout;
