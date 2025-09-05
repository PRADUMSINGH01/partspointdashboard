// components/InvoiceDetail.js
import { useState } from 'react';
import { 
  FiChevronLeft, 
  FiDownload, 
  FiPrinter, 
  FiMail, 
  FiEdit,
  FiSave,
  FiX,
  FiPackage,
  FiAlertCircle
} from 'react-icons/fi';

export default function InvoiceDetail({ invoice, onBack, onUpdateInvoice }) {
  // Mock invoice data with more details
  const [invoiceData, setInvoiceData] = useState({
    id: invoice.id || 'INV-001',
    customer: invoice.customer || 'John Doe',
    customerEmail: invoice.customerEmail || 'john.doe@example.com',
    customerAddress: invoice.customerAddress || '123 Main Street, Suite 456, New York, NY 10001',
    date: invoice.date || '2023-04-15',
    dueDate: invoice.dueDate || '2023-04-22',
    status: invoice.status || 'Pending',
    paymentMethod: invoice.paymentMethod || 'Credit Card',
    notes: invoice.notes || 'Thank you for your business. Payment is due within 7 days of invoice date.',
    items: invoice.items || [
      { 
        id: 1, 
        productId: 'PROD-1001', 
        description: 'MacBook Pro 16"', 
        quantity: 1, 
        price: 2499, 
        total: 2499,
        stock: 15
      },
      { 
        id: 2, 
        productId: 'PROD-1002', 
        description: 'Wireless Mouse', 
        quantity: 2, 
        price: 79, 
        total: 158,
        stock: 42
      },
      { 
        id: 3, 
        productId: 'PROD-1003', 
        description: 'Laptop Sleeve', 
        quantity: 1, 
        price: 49, 
        total: 49,
        stock: 8
      },
    ]
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedItems, setEditedItems] = useState([...invoiceData.items]);

  const subtotal = editedItems.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedItems = editedItems.map(item => {
      if (item.id === id) {
        const updatedQuantity = Math.min(newQuantity, item.stock); // Don't allow more than available stock
        return {
          ...item,
          quantity: updatedQuantity,
          total: updatedQuantity * item.price
        };
      }
      return item;
    });
    
    setEditedItems(updatedItems);
  };

  const handleSave = () => {
    const updatedInvoice = {
      ...invoiceData,
      items: editedItems
    };
    setInvoiceData(updatedInvoice);
    if (onUpdateInvoice) {
      onUpdateInvoice(updatedInvoice);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedItems([...invoiceData.items]);
    setIsEditing(false);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Draft': return 'bg-gray-100 text-gray-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentIcon = (method) => {
    switch(method) {
      case 'Credit Card': return '💳';
      case 'PayPal': return '📱';
      case 'Bank Transfer': return '🏦';
      case 'Cash': return '💵';
      default: return '📄';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      {/* Header with Actions */}
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={onBack}
          className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
        >
          <FiChevronLeft className="mr-1" /> Back to Invoices
        </button>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <button 
                onClick={handleSave}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg font-medium"
              >
                <FiSave className="mr-2" /> Save Changes
              </button>
              <button 
                onClick={handleCancel}
                className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium"
              >
                <FiX className="mr-2" /> Cancel
              </button>
            </>
          ) : (
            <>
              <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium">
                <FiPrinter className="mr-2" /> Print
              </button>
              <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium">
                <FiDownload className="mr-2" /> Download PDF
              </button>
              <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium">
                <FiMail className="mr-2" /> Send Email
              </button>
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium"
              >
                <FiEdit className="mr-2" /> Edit
              </button>
            </>
          )}
        </div>
      </div>

      {/* Invoice Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center">
            <h2 className="text-2xl font-bold text-gray-800">INVOICE</h2>
            <span className="ml-4 px-3 py-1 text-sm font-medium rounded-full bg-indigo-100 text-indigo-800">
              #{invoiceData.id}
            </span>
          </div>
          <p className="text-gray-600 mt-1">Issued on {invoiceData.date}</p>
        </div>
        <div className="text-right">
          <span className={`px-3 py-2 inline-flex text-sm font-semibold rounded-full ${getStatusColor(invoiceData.status)}`}>
            {invoiceData.status}
          </span>
          <p className="text-gray-600 mt-2">Due by {invoiceData.dueDate}</p>
        </div>
      </div>

      {/* Company and Client Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 p-6 bg-gray-50 rounded-lg">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">From:</h3>
          <p className="font-medium text-gray-900">Your Company Inc.</p>
          <p className="text-gray-600">123 Business Avenue</p>
          <p className="text-gray-600">San Francisco, CA 94107</p>
          <p className="text-gray-600">billing@yourcompany.com</p>
          <p className="text-gray-600">+1 (555) 123-4567</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Bill To:</h3>
          <p className="font-medium text-gray-900">{invoiceData.customer}</p>
          <p className="text-gray-600">{invoiceData.customerEmail}</p>
          <p className="text-gray-600">{invoiceData.customerAddress}</p>
        </div>
      </div>

      {/* Payment Method */}
      <div className="mb-8 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center">
          <span className="text-2xl mr-3">{getPaymentIcon(invoiceData.paymentMethod)}</span>
          <div>
            <h4 className="font-medium text-gray-800">Payment Method</h4>
            <p className="text-gray-600">{invoiceData.paymentMethod}</p>
          </div>
        </div>
      </div>

      {/* Invoice Items Table */}
      <div className="mb-8">
        <div className="overflow-hidden border border-gray-200 rounded-lg">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {editedItems.map(item => (
                <tr key={item.id}>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.description}</div>
                      <div className="text-sm text-gray-500">SKU: {item.productId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">${item.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    {isEditing ? (
                      <div className="flex items-center">
                        <button 
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="p-1 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          max={item.stock}
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                          className="mx-2 w-16 text-center border border-gray-300 rounded-lg py-1"
                        />
                        <button 
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="p-1 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
                          disabled={item.quantity >= item.stock}
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-900">{item.quantity}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className={`text-sm ${
                        item.stock < 10 ? 'text-red-600' : 
                        item.stock < 20 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {item.stock} in stock
                      </span>
                      {item.stock < 5 && (
                        <FiAlertCircle className="ml-1 text-red-500" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">${item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-full md:w-1/3">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax (8%):</span>
              <span className="font-medium">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-lg font-semibold">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Notes</h3>
        <p className="text-gray-600">{invoiceData.notes}</p>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
        <p>Thank you for your business. Please make payment within 7 days of receiving this invoice.</p>
        <p className="mt-2">Your Company Inc. • 123 Business Avenue • San Francisco, CA 94107</p>
      </div>
    </div>
  );
}