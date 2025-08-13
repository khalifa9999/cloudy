'use client';
import React, { useState, useEffect } from 'react';
import { db } from '../../../lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { 
  FaSearch, 
  FaFilter, 
  FaEye, 
  FaEdit, 
  FaCheck, 
  FaTimes, 
  FaClock,
  FaTruck,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaClipboardList,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt
} from 'react-icons/fa';
import { format } from 'date-fns';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Fetch orders from Firestore
  useEffect(() => {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      }));
      setOrders(ordersData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching orders:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter and sort orders
  const filteredAndSortedOrders = orders
    .filter(order => {
      const matchesSearch = 
        order.customerInfo?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerInfo?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerInfo?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === 'customerInfo') {
        aValue = `${a.customerInfo?.firstName} ${a.customerInfo?.lastName}`;
        bValue = `${b.customerInfo?.firstName} ${b.customerInfo?.lastName}`;
      }
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Get sort icon
  const getSortIcon = (field) => {
    if (sortField !== field) return <FaSort className="w-4 h-4 text-gray-400" />;
    return sortDirection === 'asc' ? 
      <FaSortUp className="w-4 h-4 text-blue-500" /> : 
      <FaSortDown className="w-4 h-4 text-blue-500" />;
  };

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdatingStatus(true);
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        orderStatus: newStatus,
        updatedAt: serverTimestamp()
      });
      setUpdatingStatus(false);
    } catch (error) {
      console.error('Error updating order status:', error);
      setUpdatingStatus(false);
      alert('Failed to update order status');
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: <FaClock className="w-3 h-3" /> },
      processing: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: <FaEdit className="w-3 h-3" /> },
      shipped: { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: <FaTruck className="w-3 h-3" /> },
      delivered: { color: 'bg-green-100 text-green-800 border-green-200', icon: <FaCheckCircle className="w-3 h-3" /> },
      cancelled: { color: 'bg-red-100 text-red-800 border-red-200', icon: <FaTimes className="w-3 h-3" /> }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // View order details
  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  // Get total revenue
  const totalRevenue = orders.reduce((sum, order) => {
    const orderTotal = order.orderItems?.reduce((itemSum, item) => 
      itemSum + (item.price * item.quantity), 0) || 0;
    return sum + orderTotal;
  }, 0);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 bg-white rounded-xl shadow min-h-[300px]">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Order Management</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage and track customer orders</p>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 text-sm">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-blue-600">{orders.length}</div>
              <div className="text-gray-500 text-xs sm:text-sm">Total Orders</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-green-600">${totalRevenue.toFixed(2)}</div>
              <div className="text-gray-500 text-xs sm:text-sm">Total Revenue</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders by customer name, email, or order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
          
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {/* Mobile Cards View */}
        <div className="block lg:hidden">
          {filteredAndSortedOrders.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <FaClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">No orders found</p>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'Orders will appear here once customers start placing them'
                }
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {filteredAndSortedOrders.map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  {/* Order Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900 font-mono">
                        {order.id.slice(0, 8)}...
                      </span>
                      {getStatusBadge(order.orderStatus)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {order.createdAt ? format(order.createdAt, 'MMM dd, yyyy') : 'N/A'}
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FaUser className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {order.customerInfo?.firstName} {order.customerInfo?.lastName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaEnvelope className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{order.customerInfo?.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaPhone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{order.customerInfo?.phone}</span>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-900">
                      {order.totalItems || 0} items
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                      {order.orderItems?.slice(0, 2).map((item, index) => (
                        <div key={index} className="flex justify-between">
                          <span className="truncate max-w-[200px]">{item.name}</span>
                          <span className="ml-2 text-gray-500">x{item.quantity}</span>
                        </div>
                      ))}
                      {order.orderItems?.length > 2 && (
                        <div className="text-gray-500 italic">
                          +{order.orderItems.length - 2} more items
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Payment & Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                      {order.paymentMethod?.toUpperCase() || 'N/A'}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => viewOrderDetails(order)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-colors"
                      >
                        <FaEye className="w-3 h-3" />
                        View
                      </button>
                      <select
                        value={order.orderStatus}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        disabled={updatingStatus}
                        className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block">
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200 table-fixed">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-20 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <span>Order ID</span>
                      <button 
                        onClick={() => handleSort('id')}
                        className="hover:text-gray-700"
                      >
                        {getSortIcon('id')}
                      </button>
                    </div>
                  </th>
                  <th className="w-48 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <span>Customer</span>
                      <button 
                        onClick={() => handleSort('customerInfo')}
                        className="hover:text-gray-700"
                      >
                        {getSortIcon('customerInfo')}
                      </button>
                    </div>
                  </th>
                  <th className="w-48 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Details
                  </th>
                  <th className="w-24 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="w-28 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <span>Date</span>
                      <button 
                        onClick={() => handleSort('createdAt')}
                        className="hover:text-gray-700"
                      >
                        {getSortIcon('createdAt')}
                      </button>
                    </div>
                  </th>
                  <th className="w-24 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="w-32 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-3 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <FaClipboardList className="w-12 h-12 text-gray-300 mb-4" />
                        <p className="text-lg font-medium text-gray-900 mb-2">No orders found</p>
                        <p className="text-gray-500">
                          {searchTerm || statusFilter !== 'all' 
                            ? 'Try adjusting your search or filters' 
                            : 'Orders will appear here once customers start placing them'
                          }
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      {/* Order ID */}
                      <td className="px-3 py-4">
                        <div className="text-sm font-medium text-gray-900 font-mono truncate">
                          {order.id.slice(0, 8)}...
                        </div>
                        <div className="text-xs text-gray-500 mt-1 truncate">
                          {order.id}
                        </div>
                      </td>

                      {/* Customer Information */}
                      <td className="px-3 py-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <FaUser className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {order.customerInfo?.firstName} {order.customerInfo?.lastName}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <FaEnvelope className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <div className="text-sm text-gray-600 truncate min-w-0">
                              {order.customerInfo?.email || 'No email'}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <FaPhone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <div className="text-sm text-gray-600 truncate min-w-0">
                              {order.customerInfo?.phone || 'No phone'}
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-2">
                            <FaMapMarkerAlt className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-gray-600 min-w-0">
                              <div className="truncate">{order.customerInfo?.address}</div>
                              <div className="truncate">{order.customerInfo?.city}, {order.customerInfo?.state} {order.customerInfo?.zipCode}</div>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Order Details */}
                      <td className="px-3 py-4">
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-gray-900">
                            {order.totalItems || 0} items
                          </div>
                          <div className="text-xs text-gray-600 space-y-1">
                            {order.orderItems?.slice(0, 2).map((item, index) => (
                              <div key={index} className="flex justify-between min-w-0">
                                <span className="truncate flex-1">{item.name}</span>
                                <span className="ml-2 text-gray-500 flex-shrink-0">x{item.quantity}</span>
                              </div>
                            ))}
                            {order.orderItems?.length > 2 && (
                              <div className="text-gray-500 italic">
                                +{order.orderItems.length - 2} more items
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Payment Method */}
                      <td className="px-3 py-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                          {order.paymentMethod?.toUpperCase() || 'N/A'}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-3 py-4">
                        <div className="text-sm text-gray-900">
                          {order.createdAt ? format(order.createdAt, 'MMM dd, yyyy') : 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.createdAt ? format(order.createdAt, 'HH:mm') : ''}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-3 py-4">
                        {getStatusBadge(order.orderStatus)}
                      </td>

                      {/* Actions */}
                      <td className="px-3 py-4">
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => viewOrderDetails(order)}
                            className="inline-flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-colors w-full justify-center"
                            title="View Details"
                          >
                            <FaEye className="w-3 h-3" />
                            View
                          </button>
                          
                          <select
                            value={order.orderStatus}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            disabled={updatingStatus}
                            className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white w-full"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Order Details</h2>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-4 sm:p-6 space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order ID:</span>
                      <span className="font-medium font-mono">{selectedOrder.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">
                        {selectedOrder.createdAt ? format(selectedOrder.createdAt, 'PPP') : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      {getStatusBadge(selectedOrder.orderStatus)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="font-medium">{selectedOrder.paymentMethod?.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">
                        {selectedOrder.customerInfo?.firstName} {selectedOrder.customerInfo?.lastName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{selectedOrder.customerInfo?.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">{selectedOrder.customerInfo?.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Address:</span>
                      <span className="font-medium text-right max-w-[200px]">
                        {selectedOrder.customerInfo?.address}, {selectedOrder.customerInfo?.city}, {selectedOrder.customerInfo?.state} {selectedOrder.customerInfo?.zipCode}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Items</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  {selectedOrder.orderItems?.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                      <div className="flex-1">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-gray-500 ml-2">x{item.quantity}</span>
                      </div>
                      <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-2 font-semibold">
                    <span>Total Items:</span>
                    <span>{selectedOrder.totalItems || 0}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.customerInfo?.notes && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Additional Notes</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">{selectedOrder.customerInfo.notes}</p>
                  </div>
                </div>
              )}

              {/* Status Update */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Update Status</h3>
                <div className="flex items-center gap-4">
                  <select
                    value={selectedOrder.orderStatus}
                    onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                    disabled={updatingStatus}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  {updatingStatus && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                      Updating...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 