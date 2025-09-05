// components/OrderDetail.js
import { FiChevronLeft, FiTruck, FiCheckCircle, FiXCircle, FiPackage, FiUser, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

export default function OrderDetail({ order, onBack, onStatusUpdate }) {
  const statusOptions = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
  const subtotal = order.itemsDetail.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Processing': return <FiPackage className="h-5 w-5 text-yellow-500" />;
      case 'Shipped': return <FiTruck className="h-5 w-5 text-purple-500" />;
      case 'Delivered': return <FiCheckCircle className="h-5 w-5 text-green-500" />;
      case 'Cancelled': return <FiXCircle className="h-5 w-5 text-red-500" />;
      default: return <FiPackage className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={onBack}
          className="flex items-center text-indigo-600 hover:text-indigo-800"
        >
          <FiChevronLeft className="mr-1" /> Back to Orders
        </button>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">Change Status:</span>
          <select 
            value={order.status}
            onChange={(e) => onStatusUpdate(order.id, e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {statusOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Order Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">ORDER #{order.id}</h2>
          <div className="flex items-center mt-2">
            <span className={`px-3 py-1 inline-flex items-center text-sm font-semibold rounded-full ${getStatusColor(order.status)}`}>
              {getStatusIcon(order.status)}
              <span className="ml-1">{order.status}</span>
            </span>
            <span className="ml-4 text-sm text-gray-500">Placed on {order.date}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-gray-600">Total Amount:</p>
          <p className="text-2xl font-bold text-gray-800">${total.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Customer Information */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
            <FiUser className="mr-2" /> Customer Information
          </h3>
          <div className="space-y-2">
            <p className="font-medium">{order.customer}</p>
            <p className="text-gray-600 flex items-center">
              <FiMail className="mr-2" /> {order.email}
            </p>
            <p className="text-gray-600 flex items-center">
              <FiPhone className="mr-2" /> +1 (555) 123-4567
            </p>
            <p className="text-gray-600 flex items-start">
              <FiMapPin className="mr-2 mt-1 flex-shrink-0" /> 
              123 Main Street, Apt 4B<br />
              New York, NY 10001<br />
              United States
            </p>
          </div>
        </div>

        {/* Shipping Information */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
            <FiTruck className="mr-2" /> Shipping Information
          </h3>
          <div className="space-y-2">
            <p className="font-medium">Standard Shipping</p>
            <p className="text-gray-600">Estimated delivery: 3-5 business days</p>
            {order.status === 'Shipped' && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-800">Tracking Number:</p>
                <p className="text-sm text-indigo-600">1Z999AA10123456784</p>
                <p className="text-xs text-gray-500 mt-2">Shipped via: UPS Ground</p>
              </div>
            )}
            {order.status === 'Delivered' && (
              <div className="mt-4">
                <p className="text-sm font-medium text-green-800 flex items-center">
                  <FiCheckCircle className="mr-1" /> Delivered on April 18, 2023
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Payment Information</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method:</span>
              <span className="font-medium">Credit Card</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Card Number:</span>
              <span className="font-medium">**** **** **** 1234</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Status:</span>
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                order.payment === 'Paid' ? 'bg-green-100 text-green-800' : 
                order.payment === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {order.payment}
              </span>
            </div>
            {order.payment === 'Paid' && (
              <div className="flex justify-between mt-4 pt-2 border-t border-gray-200">
                <span className="text-gray-600">Paid On:</span>
                <span className="font-medium">April 15, 2023</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Order Items</h3>
        <div className="bg-gray-50 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Product</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Price</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Quantity</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {order.itemsDetail.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">${item.price.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.quantity}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-100">
              <tr>
                <td colSpan="3" className="px-4 py-3 text-sm font-medium text-gray-700 text-right">Subtotal</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-700">${subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan="3" className="px-4 py-3 text-sm font-medium text-gray-700 text-right">Tax (8%)</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-700">${tax.toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan="3" className="px-4 py-3 text-sm font-medium text-gray-700 text-right">Total</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-700">${total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Order Timeline */}
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-4">Order History</h3>
        <div className="border-l-2 border-gray-200 ml-4 pb-10">
          <div className="relative mb-6 pl-6">
            <div className="absolute -left-2.5 top-0 h-4 w-4 rounded-full bg-green-500"></div>
            <h4 className="text-sm font-medium text-gray-800">Order Delivered</h4>
            <p className="text-sm text-gray-500">April 18, 2023 at 2:30 PM</p>
            <p className="text-sm text-gray-600 mt-1">Your order has been delivered</p>
          </div>
          <div className="relative mb-6 pl-6">
            <div className="absolute -left-2.5 top-0 h-4 w-4 rounded-full bg-blue-500"></div>
            <h4 className="text-sm font-medium text-gray-800">Out for Delivery</h4>
            <p className="text-sm text-gray-500">April 18, 2023 at 8:15 AM</p>
            <p className="text-sm text-gray-600 mt-1">Your order is out for delivery</p>
          </div>
          <div className="relative mb-6 pl-6">
            <div className="absolute -left-2.5 top-0 h-4 w-4 rounded-full bg-blue-500"></div>
            <h4 className="text-sm font-medium text-gray-800">Order Shipped</h4>
            <p className="text-sm text-gray-500">April 16, 2023 at 3:45 PM</p>
            <p className="text-sm text-gray-600 mt-1">Your order has been shipped</p>
          </div>
          <div className="relative pl-6">
            <div className="absolute -left-2.5 top-0 h-4 w-4 rounded-full bg-blue-500"></div>
            <h4 className="text-sm font-medium text-gray-800">Order Placed</h4>
            <p className="text-sm text-gray-500">April 15, 2023 at 10:30 AM</p>
            <p className="text-sm text-gray-600 mt-1">Your order was placed</p>
          </div>
        </div>
      </div>
    </div>
  );
}