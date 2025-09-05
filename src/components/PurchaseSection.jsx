// components/PurchaseSection.js
import { useState } from 'react';
import { FiFilter, FiDownload, FiTrendingUp, FiTrendingDown ,FiShoppingCart ,FiDollarSign  } from 'react-icons/fi';

export default function PurchaseSection() {
  const [timeRange, setTimeRange] = useState('monthly');
  const [purchaseData] = useState({
    total: 18750,
    monthly: 4850,
    weekly: 1250,
    change: 3.2,
    trendingUp: false,
    orders: [
      { id: 1, supplier: 'Tech Distributors', product: 'Laptop', date: '2023-04-15', amount: 1200, status: 'Received' },
      { id: 2, supplier: 'Gadget World', product: 'Monitor', date: '2023-04-14', amount: 350, status: 'Received' },
      { id: 3, supplier: 'Accessory Hub', product: 'Keyboard', date: '2023-04-13', amount: 85, status: 'Pending' },
      { id: 4, supplier: 'Peripherals Inc', product: 'Mouse', date: '2023-04-12', amount: 45, status: 'Received' },
      { id: 5, supplier: 'Audio Solutions', product: 'Headset', date: '2023-04-11', amount: 150, status: 'Cancelled' },
    ]
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-800">Purchase Overview</h3>
        <div className="flex space-x-4">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <button className="p-2 rounded-lg border border-gray-300 text-gray-600">
            <FiFilter className="h-5 w-5" />
          </button>
          <button className="p-2 rounded-lg border border-gray-300 text-gray-600">
            <FiDownload className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Purchases</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">${purchaseData.total.toLocaleString()}</h3>
            </div>
            <div className={`p-3 rounded-full ${purchaseData.trendingUp ? 'bg-green-100' : 'bg-red-100'}`}>
              {purchaseData.trendingUp ? 
                <FiTrendingUp className="text-green-600" /> : 
                <FiTrendingDown className="text-red-600" />
              }
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            {purchaseData.trendingUp ? 
              <span className="text-green-600 flex items-center font-medium">
                <FiTrendingUp className="mr-1" /> {purchaseData.change}%
              </span> :
              <span className="text-red-600 flex items-center font-medium">
                <FiTrendingDown className="mr-1" /> {purchaseData.change}%
              </span>
            }
            <span className="text-gray-500 ml-2">vs last {timeRange}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Orders</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{purchaseData.orders.length}</h3>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <FiShoppingCart className="text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-gray-500 text-sm">
              {purchaseData.orders.filter(t => t.status === 'Received').length} received
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">Average Order Value</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">$
                {Math.round(purchaseData.orders.reduce((sum, t) => sum + t.amount, 0) / purchaseData.orders.length)}
              </h3>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <FiDollarSign className="text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-gray-500 text-sm">
              Across all orders
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-medium text-gray-800">Recent Purchase Orders</h3>
          <p className="text-sm text-gray-500">Last 5 purchase orders</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {purchaseData.orders.map(order => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{order.supplier}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.product}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">${order.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.status === 'Received' ? 'bg-green-100 text-green-800' :
                      order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}