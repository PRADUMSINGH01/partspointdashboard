"use client";
// pages/index.js (Main Dashboard Page)
import { useState } from 'react';
import Head from 'next/head';
import DashboardLayout from '../components/DashboardLayout';
import SalesSection from '../components/SalesSection';
import PurchaseSection from '../components/PurchaseSection';
import InventorySection from '../components/InventorySection';
import InvoiceSection from '../components/InvoiceSection';
import { FiTrendingUp } from 'react-icons/fi';
import OrderSection from '../components/Ordersection';
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

console.log(process.env.CLI)

  const sampleInvoice = {
  company: {
    name: "Pradum Pvt Ltd",
    address: "123 Business Street, Delhi, India",
    email: "contact@pradum.com",
    phone: "+91 7270854122",
  },
  client: {
    name: "Rahul Sharma",
    address: "56 Client Road, Mumbai, India",
    email: "rahul@example.com",
  },
  invoiceNumber: "INV-2025-001",
  date: "27-08-2025",
  dueDate: "05-09-2025",
  taxRate: 18,
  items: [
    { description: "Web Design Services", quantity: 1, price: 15000 },
    { description: "Hosting (1 year)", quantity: 1, price: 3000 },
    { description: "Domain Name", quantity: 1, price: 800 },
  ],
};
  const renderContent = () => {
    switch (activeTab) {
      case 'sales':
        return <SalesSection />;
      case 'purchases':
        return <PurchaseSection />;
      case 'inventory':
        return <InventorySection />;
        case 'orders':
        return <OrderSection />;
      case 'invoices':
        return <InvoiceSection   />;
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Dashboard summary cards would go here */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Sales</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">$28,450</h3>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <FiTrendingUp className="text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 flex items-center font-medium">
                  <FiTrendingUp className="mr-1" /> 12.5%
                </span>
                <span className="text-gray-500 ml-2">vs last month</span>
              </div>
            </div>
            {/* Additional cards... */}
          </div>
        );
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <Head>
        <title>Inventory Management Dashboard</title>
        <meta name="description" content="Professional inventory management dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {renderContent()}
    </DashboardLayout>
  );
}
