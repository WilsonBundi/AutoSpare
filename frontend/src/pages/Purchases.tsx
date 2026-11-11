import { useState, useEffect } from 'react';
import { purchaseService, Purchase } from '../services/purchaseService';
import { supplierService, Supplier } from '../services/supplierService';
import { supplierPricingService } from '../services/supplierPricingService';
import { productService, Product } from '../services/productService';

const Purchases = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [supplierPricing, setSupplierPricing] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [purchaseItems, setPurchaseItems] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    supplier_id: '',
    purchase_date: new Date().toISOString().split('T')[0],
    invoice_number: '',
    payment_method: 'cash',
    notes: '',
  });

  useEffect(() => {
    fetchPurchases();
    fetchSuppliers();
    fetchProducts();
  }, []);

  const fetchPurchases = async () => {
    setLoading(true);
    try {
      const data = await purchaseService.getAll();
      setPurchases(data);
    } catch (error) {
      console.error('Failed to fetch purchases:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const data = await supplierService.getAll();
      setSuppliers(data);
    } catch (error) {
      console.error('Failed to fetch suppliers:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const addPurchaseItem = (productId: string) => {
    const product = products.find((p) => p.id === parseInt(productId));
    if (!product) return;

    // Check if supplier has a specific price for this product
    const supplierPrice = supplierPricing.find(
      (sp) => sp.product_id === parseInt(productId)
    );

    const unitPrice = supplierPrice ? supplierPrice.buying_price : product.buying_price;

    setPurchaseItems([
      ...purchaseItems,
      {
        product_id: product.id,
        product_name: product.name,
        code: product.code,
        quantity: 1,
        unit_price: unitPrice,
        total_price: unitPrice,
      },
    ]);
  };

  const updateItemQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      setPurchaseItems(purchaseItems.filter((_, i) => i !== index));
      return;
    }

    const updatedItems = [...purchaseItems];
    updatedItems[index].quantity = quantity;
    updatedItems[index].total_price = quantity * updatedItems[index].unit_price;
    setPurchaseItems(updatedItems);
  };

  const removePurchaseItem = (index: number) => {
    setPurchaseItems(purchaseItems.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (purchaseItems.length === 0) {
      alert('Please add at least one item');
      return;
    }

    try {
      const totalAmount = purchaseItems.reduce((sum, item) => sum + item.total_price, 0);
      await purchaseService.create(
        {
          ...formData,
          supplier_id: formData.supplier_id ? parseInt(formData.supplier_id) : undefined,
          total_amount: totalAmount,
          paid_amount: totalAmount,
        },
        purchaseItems
      );
      alert('Purchase created successfully!');
      setShowModal(false);
      setPurchaseItems([]);
      setFormData({
        supplier_id: '',
        purchase_date: new Date().toISOString().split('T')[0],
        invoice_number: '',
        payment_method: 'cash',
        notes: '',
      });
      fetchPurchases();
    } catch (error) {
      alert('Failed to create purchase');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this purchase?')) {
      try {
        await purchaseService.delete(id);
        fetchPurchases();
      } catch (error) {
        alert('Failed to delete purchase');
      }
    }
  };

  const handleSupplierChange = async (supplierId: string) => {
    setFormData({ ...formData, supplier_id: supplierId });
    if (supplierId) {
      try {
        const pricing = await supplierPricingService.getBySupplier(parseInt(supplierId));
        setSupplierPricing(pricing);
        
        // Filter products to only show those the supplier sells
        const supplierProductIds = pricing.map((p) => p.product_id);
        const filtered = products.filter((p) => supplierProductIds.includes(p.id));
        setFilteredProducts(filtered);
      } catch (error) {
        console.error('Failed to fetch supplier pricing:', error);
        setSupplierPricing([]);
        setFilteredProducts([]);
      }
    } else {
      setSupplierPricing([]);
      setFilteredProducts(products); // Show all products when no supplier selected
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Purchases</h1>
          <p className="text-gray-500 mt-1">Manage supplier purchases and stock replenishment</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>New Purchase</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Invoice #</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Supplier</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {purchases.map((purchase) => (
                  <tr key={purchase.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{purchase.purchase_date.split('T')[0]}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-medium">{purchase.invoice_number || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{purchase.supplier_name || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-green-600">
                      KES {parseFloat(purchase.total_amount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap capitalize text-gray-600">{purchase.payment_method || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleDelete(purchase.id!)}
                        className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl w-full max-w-4xl max-h-screen overflow-y-auto shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">New Purchase</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Supplier</label>
                  <select
                    value={formData.supplier_id}
                    onChange={(e) => handleSupplierChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select supplier</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Purchase Date</label>
                  <input
                    type="date"
                    value={formData.purchase_date}
                    onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Invoice Number</label>
                  <input
                    type="text"
                    value={formData.invoice_number}
                    onChange={(e) => setFormData({ ...formData, invoice_number: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Method</label>
                  <select
                    value={formData.payment_method}
                    onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="cash">Cash</option>
                    <option value="bank">Bank Transfer</option>
                    <option value="mpesa">M-Pesa</option>
                    <option value="credit">Credit</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Add Product</label>
                <div className="flex gap-3">
                  <select
                    onChange={(e) => addPurchaseItem(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    defaultValue=""
                    disabled={!formData.supplier_id}
                  >
                    <option value="">
                      {formData.supplier_id 
                        ? 'Select product to add' 
                        : 'Select a supplier first'}
                    </option>
                    {filteredProducts.map((product) => {
                      const supplierPrice = supplierPricing.find(
                        (sp) => sp.product_id === product.id
                      );
                      const displayPrice = supplierPrice
                        ? supplierPrice.buying_price
                        : product.buying_price;

                      return (
                        <option key={product.id} value={product.id}>
                          {product.name} - KES {parseFloat(displayPrice).toFixed(2)}
                        </option>
                      );
                    })}
                  </select>
                </div>
                {!formData.supplier_id && (
                  <p className="text-sm text-gray-500 mt-1">Please select a supplier to see available products</p>
                )}
              </div>

              {purchaseItems.length > 0 && (
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <table className="min-w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Product</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Unit Price</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Quantity</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Total</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {purchaseItems.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-gray-800">{item.product_name}</td>
                          <td className="px-4 py-3 text-gray-600">KES {parseFloat(item.unit_price).toFixed(2)}</td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateItemQuantity(index, parseInt(e.target.value))}
                              className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                              min="1"
                            />
                          </td>
                          <td className="px-4 py-3 font-medium text-gray-800">KES {parseFloat(item.total_price).toFixed(2)}</td>
                          <td className="px-4 py-3">
                            <button
                              type="button"
                              onClick={() => removePurchaseItem(index)}
                              className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 font-bold text-gray-800">
                    Total: KES {purchaseItems.reduce((sum, item) => sum + parseFloat(item.total_price), 0).toFixed(2)}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  rows={2}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setPurchaseItems([]);
                  }}
                  className="px-6 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg"
                >
                  Create Purchase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Purchases;
