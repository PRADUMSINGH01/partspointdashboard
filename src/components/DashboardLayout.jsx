// components/DashboardLayout.js
import { useState } from 'react';
import AddProductModal from '@/components/AddProductButton'
import {
  FiTrendingUp,
  FiTrendingDown,
  FiPackage,
  FiFileText,
  FiShoppingCart,
  FiDollarSign,
  FiPieChart,
  FiBox,
  FiUsers,
  FiSettings,
  FiSearch,
  FiPlus,
  FiChevronLeft,
  FiChevronRight,

  FiMenu
} from 'react-icons/fi';

export default function DashboardLayout({ children, activeTab, setActiveTab }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-indigo-800 text-white p-4 transform transition-transform duration-200 z-10 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between mt-4 mb-10">
          <div className="flex items-center">
            <FiBox className="h-8 w-8 mr-2 text-indigo-300" />
            <h1 className="text-xl font-bold"> Part point</h1>
          </div>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <FiChevronLeft className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="space-y-1">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'dashboard' ? 'bg-indigo-700 text-white' : 'hover:bg-indigo-700'}`}
          >
            <FiPieChart className="mr-3" />
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('sales')}
            className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'sales' ? 'bg-indigo-700 text-white' : 'hover:bg-indigo-700'}`}
          >
            <FiShoppingCart className="mr-3" />
            Sales
          </button>
          <button 
            onClick={() => setActiveTab('purchases')}
            className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'purchases' ? 'bg-indigo-700 text-white' : 'hover:bg-indigo-700'}`}
          >
            <FiDollarSign className="mr-3" />
            Purchases
          </button>

            <button 
            onClick={() => setActiveTab('orders')}
            className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'purchases' ? 'bg-indigo-700 text-white' : 'hover:bg-indigo-700'}`}
          >
              <FiShoppingCart className="mr-3" />

            Orders
          </button>
          <button 
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'inventory' ? 'bg-indigo-700 text-white' : 'hover:bg-indigo-700'}`}
          >
            <FiPackage className="mr-3" />
            Inventory
          </button>
          <button 
            onClick={() => setActiveTab('invoices')}
            className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'invoices' ? 'bg-indigo-700 text-white' : 'hover:bg-indigo-700'}`}
          >
            <FiFileText className="mr-3" />
            Invoices
          </button>
          <button 
            onClick={() => setActiveTab('customers')}
            className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'customers' ? 'bg-indigo-700 text-white' : 'hover:bg-indigo-700'}`}
          >
            <FiUsers className="mr-3" />
            Customers
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'settings' ? 'bg-indigo-700 text-white' : 'hover:bg-indigo-700'}`}
          >
            <FiSettings className="mr-3" />
            Settings
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center">
            <button className="lg:hidden mr-4" onClick={() => setSidebarOpen(true)}>
              <FiMenu className="h-6 w-6 text-gray-600" />
            </button>
            <h2 className="text-xl font-semibold text-gray-800 capitalize">{activeTab || 'Dashboard'} Overview</h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
              <AddProductModal />
           
          </div>
        </header>

        <main className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 80px)' }}>
          {children}
        </main>
      </div>
    </div>
  );
}