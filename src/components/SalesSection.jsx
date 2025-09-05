// components/SalesSection.js
import { useState } from 'react';
import { FiFilter, FiDownload, FiTrendingUp, FiTrendingDown ,FiShoppingCart ,FiDollarSign  } from 'react-icons/fi';

export default function SalesSection() {
  const [timeRange, setTimeRange] = useState('monthly');
  const [salesData] = useState({
    total: 28450,
    monthly: 8250,
    weekly: 2250,
    change: 12.5,
    trendingUp: true,
    transactions: [
      { id: 1, product: 'Laptop', customer: 'John Doe', date: '2023-04-15', amount: 1200, status: 'Completed' },
      { id: 2, product: 'Monitor', customer: 'Jane Smith', date: '2023-04-14', amount: 350, status: 'Completed' },
      { id: 3, product: 'Keyboard', customer: 'Acme Corp', date: '2023-04-13', amount: 85, status: 'Pending' },
      { id: 4, product: 'Mouse', customer: 'XYZ Ltd', date: '2023-04-12', amount: 45, status: 'Completed' },
      { id: 5, product: 'Headset', customer: 'Tech Solutions', date: '2023-04-11', amount: 150, status: 'Refunded' },
    ]
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-800">Sales Overview</h3>
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
              <p className="text-gray-500 text-sm font-medium">Total Sales</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">${salesData.total.toLocaleString()}</h3>
            </div>
            <div className={`p-3 rounded-full ${salesData.trendingUp ? 'bg-green-100' : 'bg-red-100'}`}>
              {salesData.trendingUp ? 
                <FiTrendingUp className="text-green-600" /> : 
                <FiTrendingDown className="text-red-600" />
              }
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            {salesData.trendingUp ? 
              <span className="text-green-600 flex items-center font-medium">
                <FiTrendingUp className="mr-1" /> {salesData.change}%
              </span> :
              <span className="text-red-600 flex items-center font-medium">
                <FiTrendingDown className="mr-1" /> {salesData.change}%
              </span>
            }
            <span className="text-gray-500 ml-2">vs last {timeRange}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Orders</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{salesData.transactions.length}</h3>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <FiShoppingCart className="text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-gray-500 text-sm">
              {salesData.transactions.filter(t => t.status === 'Completed').length} completed
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">Average Order Value</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">$
                {Math.round(salesData.transactions.reduce((sum, t) => sum + t.amount, 0) / salesData.transactions.length)}
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
          <h3 className="text-lg font-medium text-gray-800">Recent Transactions</h3>
          <p className="text-sm text-gray-500">Last 5 sales transactions</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {salesData.transactions.map(transaction => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{transaction.product}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.customer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">${transaction.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      transaction.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      transaction.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {transaction.status}
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