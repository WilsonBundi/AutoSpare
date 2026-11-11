import { useState, useEffect } from 'react';
import { productService, Product } from '../services/productService';
import { salesService, SaleItem } from '../services/salesService';
import ReceiptPrinter from '../components/ReceiptPrinter';

const POS = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastSale, setLastSale] = useState<any>(null);
  const [shopSettings, setShopSettings] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchShopSettings();
  }, []);

  const fetchShopSettings = async () => {
    try {
      // For now, use default settings. In production, fetch from API
      setShopSettings({
        shop_name: 'Autospare Shop',
        shop_address: 'Nairobi, Kenya',
        shop_phone: '+254700000000'
      });
    } catch (error) {
      console.error('Failed to fetch shop settings:', error);
    }
  };

  // Barcode scanner support
  useEffect(() => {
    const handleBarcodeScan = (e: KeyboardEvent) => {
      // Barcode scanners typically send Enter key after the barcode
      if (e.key === 'Enter' && searchTerm.length > 0) {
        const product = products.find(
          (p) =>
            p.barcode === searchTerm ||
            p.code === searchTerm
        );
        if (product) {
          addToCart(product);
          setSearchTerm('');
        }
      }
    };

    window.addEventListener('keydown', handleBarcodeScan);
    return () => window.removeEventListener('keydown', handleBarcodeScan);
  }, [searchTerm, products]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.barcode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: Product) => {
    if (product.current_stock <= 0) {
      alert('Product is out of stock');
      return;
    }

    const existingItem = cart.find((item) => item.product_id === product.id);
    if (existingItem) {
      if (existingItem.quantity >= product.current_stock) {
        alert('Not enough stock');
        return;
      }
      setCart(
        cart.map((item) =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + 1, total_price: parseFloat(((item.quantity + 1) * item.unit_price).toFixed(2)) }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          product_id: product.id,
          product_name: product.name,
          code: product.code,
          quantity: 1,
          unit_price: parseFloat(product.selling_price),
          discount_amount: 0,
          total_price: parseFloat(product.selling_price),
        },
      ]);
    }
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      setCart(cart.filter((item) => item.product_id !== productId));
      return;
    }

    const product = products.find((p) => p.id === productId);
    if (product && quantity > product.current_stock) {
      alert('Not enough stock');
      return;
    }

    setCart(
      cart.map((item) =>
        item.product_id === productId
          ? { ...item, quantity, total_price: parseFloat((quantity * item.unit_price).toFixed(2)) }
          : item
      )
    );
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter((item) => item.product_id !== productId));
  };

  const subtotal = cart.reduce((sum, item) => sum + parseFloat(item.total_price), 0);
  const tax = subtotal * 0.16;
  const total = subtotal + tax;

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('Cart is empty');
      return;
    }

    try {
      const sale = await salesService.create(
        {
          subtotal,
          discount_amount: 0,
          tax_amount: tax,
          total_amount: total,
          paid_amount: total,
          change_amount: 0,
          payment_method: 'cash',
        },
        cart
      );
      setLastSale({
        ...sale,
        items: cart,
        subtotal,
        taxAmount: tax,
        totalAmount: total,
        paidAmount: total,
        changeAmount: 0,
        paymentMethod: 'cash',
        date: new Date()
      });
      alert('Sale completed successfully!');
      setCart([]);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to complete sale');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Point of Sale</h1>
        <p className="text-gray-500 mt-1">Search products and complete sales</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-2xl shadow-lg mb-6 border border-gray-100">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search by name, code, or scan barcode..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  autoFocus
                />
              </div>
              <button
                onClick={() => setIsScanning(!isScanning)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${isScanning ? 'bg-green-600 hover:bg-green-700 shadow-lg' : 'bg-gray-600 hover:bg-gray-700'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
                <span>{isScanning ? 'Scanning...' : 'Scan'}</span>
              </button>
            </div>
            {isScanning && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center space-x-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-blue-800">Barcode scanner ready. Scan a barcode or type code and press Enter.</p>
              </div>
            )}
          </div>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="bg-white p-5 rounded-2xl shadow-md cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100 group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">{product.name}</h3>
                    {product.current_stock <= product.reorder_level && (
                      <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">Low Stock</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mb-3">{product.code}</p>
                  <div className="flex items-end justify-between">
                    <p className="text-xl font-bold text-blue-600">
                      KES {parseFloat(product.selling_price).toFixed(2)}
                    </p>
                    <p className={`text-sm font-medium ${product.current_stock <= product.reorder_level ? 'text-red-600' : 'text-green-600'}`}>
                      {product.current_stock} in stock
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <div className="bg-white p-6 rounded-2xl shadow-xl sticky top-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Cart</h2>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">{cart.length} items</span>
            </div>
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-gray-500">Cart is empty</p>
                <p className="text-sm text-gray-400 mt-1">Add products to get started</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 max-h-96 overflow-y-auto mb-4 pr-2">
                  {cart.map((item) => (
                    <div key={item.product_id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{item.product_name}</p>
                        <p className="text-sm text-gray-500">KES {parseFloat(item.unit_price).toFixed(2)}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                          className="w-8 h-8 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition flex items-center justify-center text-gray-600 font-medium"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-semibold text-gray-800">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                          className="w-8 h-8 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition flex items-center justify-center text-gray-600 font-medium"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.product_id)}
                          className="w-8 h-8 bg-red-500 hover:bg-red-600 rounded-lg transition flex items-center justify-center text-white"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span className="font-medium">KES {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (16%):</span>
                    <span className="font-medium">KES {tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-xl text-gray-800 pt-2 border-t border-gray-200">
                    <span>Total:</span>
                    <span className="text-blue-600">KES {total.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  Complete Sale
                </button>
                {lastSale && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center space-x-2 mb-3">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-green-800 font-bold">Sale Completed!</p>
                    </div>
                    <ReceiptPrinter
                      saleNumber={lastSale.sale_number}
                      items={lastSale.items}
                      subtotal={lastSale.subtotal}
                      taxAmount={lastSale.taxAmount}
                      totalAmount={lastSale.totalAmount}
                      paidAmount={lastSale.paidAmount}
                      changeAmount={lastSale.changeAmount}
                      paymentMethod={lastSale.paymentMethod}
                      shopName={shopSettings?.shop_name}
                      shopAddress={shopSettings?.shop_address}
                      shopPhone={shopSettings?.shop_phone}
                      date={lastSale.date}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default POS;
