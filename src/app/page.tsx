"use client";
import AdminLayout from "../../components/AdminLayout";
import { useEffect, useState } from "react";
import { client } from "../sanity/lib/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Area, Line, AreaChart } from 'recharts';
import RealTimeOrders from "../../components/RealTimeOrders";
import { useUser, SignInButton } from "@clerk/nextjs";
import { ArrowUpRight, ChevronRight, Clock, DollarSign, Package, Utensils } from "lucide-react";

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


  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg text-center space-y-4 border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
            Restaurant Analytics
          </h1>
          <p className="text-gray-600">Sign in to access your dashboard</p>
          <SignInButton>
            <button className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-3 px-6 rounded-xl hover:shadow-lg transition-all">
              Get Started
            </button>
          </SignInButton>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">
            Insights into your restaurant performance
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={<Package className="h-5 w-5" />}
            trend="12.3%"
            color="indigo"
          />
          <StatCard
            title="Revenue"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            icon={<DollarSign className="h-5 w-5" />}
            trend="8.1%"
            color="blue"
          />
          <StatCard
            title="Pending Orders"
            value={stats.pendingOrders}
            icon={<Clock className="h-5 w-5" />}
            trend="2.4%"
            color="amber"
          />
          <StatCard
            title="Menu Items"
            value={stats.productsCount}
            icon={<Utensils className="h-5 w-5" />}
            trend="5.6%"
            color="purple"
          />
        </div>

        {/* Sales Chart */}
        <div className="mt-6 sm:mt-8 bg-white p-4 sm:p-6 rounded-2xl border border-gray-300 shadow-gray-500 shadow-lg hover:shadow-gray-500 hover:shadow-xl transition-shadow">
          {/* Header */}
          <div className="flex items-start sm:items-center justify-between mb-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Sales Performance</h2>
              <p className="text-sm text-gray-500 font-medium">2024 Monthly Revenue</p>
            </div>
            <div className="flex items-center bg-indigo-50 px-3 py-1 rounded-full">
              <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full mr-2"></div>
              <span className="text-sm font-medium text-indigo-800">Actual Sales</span>
            </div>
          </div>

          {/* Enhanced Area Chart */}
          <div className="h-80 relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.salesData}>
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>

                {/* Grid and Axes */}
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  padding={{ left: 20, right: 20 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  width={80}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />

                {/* Tooltip */}
                <Tooltip
                  content={({ active, payload }) => (
                    <div className="bg-white p-3 rounded-lg shadow-xl border border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 mb-2">
                        {payload?.[0]?.payload.month}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                        <span className="text-sm text-gray-600">
                          Sales: <span className="font-medium text-indigo-600">
                            ${(payload?.[0]?.value || 0).toLocaleString()}
                          </span>
                        </span>
                      </div>
                    </div>
                  )}
                />

                {/* Data Visualization */}
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  fill="url(#salesGradient)"
                  fillOpacity={1}
                  dot={{
                    fill: "#4f46e5",
                    stroke: "#fff",
                    strokeWidth: 2,
                    r: 4,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>

            {/* Current Month Indicator */}
            {stats.salesData?.length > 0 && (
              <div className="absolute top-4 right-4 bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-100 flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">
                  {stats.salesData[stats.salesData.length - 1].month}: 
                  <span className="ml-1 text-indigo-600">
                    ${(stats.salesData[stats.salesData.length - 1].sales / 1000).toFixed(1)}k
                  </span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="mt-6 sm:mt-8 bg-white p-4 sm:p-6 rounded-xl border border-gray-300 shadow-gray-500 shadow-lg hover:shadow-gray-500 hover:shadow-xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
              <p className="text-sm text-gray-500">Latest customer transactions</p>
            </div>
            <button className="flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm mt-3 sm:mt-0 transition-colors">
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td colSpan={5} className="p-4">
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

const StatCard = ({ title, value, icon, trend, color }: { 
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  color: 'indigo' | 'blue' | 'amber' | 'purple';
}) => {
  const colors = {
    indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
    amber: { bg: 'bg-amber-100', text: 'text-amber-600' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
  };

  return (
    <div className="bg-white p-4 sm:p-5 rounded-xl border-gray-300 shadow-gray-500 shadow-lg hover:shadow-gray-500 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`${colors[color].bg} p-3 rounded-lg`}>{icon}</div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center text-sm">
          <ArrowUpRight className={`h-4 w-4 mr-1 ${colors[color].text}`} />
          <span className={`${colors[color].text} font-medium`}>{trend}</span>
          <span className="text-gray-500 ml-1">vs last month</span>
        </div>
      )}
    </div>
  );
};

export default HomePage;