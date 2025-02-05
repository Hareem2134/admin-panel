"use client";
import AdminLayout from "../../components/AdminLayout";
import { useEffect, useState } from "react";
import { client } from "../sanity/lib/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import RealTimeOrders from "../../components/RealTimeOrders";
import { useUser, SignInButton } from "@clerk/nextjs";

const HomePage = () => {
  const { isSignedIn } = useUser();

  // Fetch statistics
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    productsCount: 0,
    salesData: [] as { month: string; sales: number }[],
  });

  useEffect(() => {
    if (!isSignedIn) return; // ✅ Prevent fetching data if not signed in

    const fetchData = async () => {
      const orders = await client.fetch(`*[_type == "order"]`);
      const products = await client.fetch(`*[_type == "food"]`);
      
      const revenue = orders.reduce((acc: number, order: any) => acc + order.total, 0);
      const pending = orders.filter((order: any) => order.status === 'pending').length;
      
      // Sales data calculation
      const monthlySales = orders.reduce((acc: any, order: any) => {
        const month = new Date(order.date).toLocaleString('default', { month: 'short' });
        acc[month] = (acc[month] || 0) + order.total;
        return acc;
      }, {});

      setStats({
        totalOrders: orders.length,
        totalRevenue: revenue,
        pendingOrders: pending,
        productsCount: products.length,
        salesData: Object.entries(monthlySales).map(([month, sales]) => ({
          month,
          sales: Number(sales),
        })),
      });
    };

    fetchData();
  }, [isSignedIn]); // ✅ Fetch only when signed in


  // ✅ Always return JSX after hooks
  if (!isSignedIn) {
    return (
      <div className="h-screen flex flex-col justify-center items-center">
        <p className="text-xl mb-4">You must sign in to access the admin panel.</p>
        <SignInButton />
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-100 p-4 rounded-lg">
            <h3 className="text-blue-800 text-sm">Total Orders</h3>
            <p className="text-2xl font-bold text-blue-600">{stats.totalOrders}</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg">
            <h3 className="text-green-800 text-sm">Total Revenue</h3>
            <p className="text-2xl font-bold text-green-600">${stats.totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg">
            <h3 className="text-yellow-800 text-sm">Pending Orders</h3>
            <p className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</p>
          </div>
          <div className="bg-purple-100 p-4 rounded-lg">
            <h3 className="text-purple-800 text-sm">Total Products</h3>
            <p className="text-2xl font-bold text-purple-600">{stats.productsCount}</p>
          </div>
        </div>

        {/* Sales Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Monthly Sales</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-sm">Order ID</th>
                  <th className="px-4 py-2 text-left text-sm">Customer</th>
                  <th className="px-4 py-2 text-left text-sm">Amount</th>
                  <th className="px-4 py-2 text-left text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={4} className="text-center py-4">
                    <RealTimeOrders />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default HomePage;