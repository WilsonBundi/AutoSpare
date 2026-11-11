import { useState, useEffect } from 'react';
import { reportService } from '../services/reportService';
import { exportToExcel, exportToCSV } from '../utils/exportUtils';

const Reports = () => {
  const [dailySales, setDailySales] = useState<any>(null);
  const [stockValuation, setStockValuation] = useState<any>(null);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const [daily, stock, top] = await Promise.all([
        reportService.getDailySales(),
        reportService.getStockValuation(),
        reportService.getTopSellingProducts(undefined, undefined, 10),
      ]);
      setDailySales(daily);
      setStockValuation(stock);
      setTopProducts(top);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = () => {
    const exportData = topProducts.map((product, index) => ({
      Rank: index + 1,
      Product: product.name,
      Code: product.code || '-',
      Category: product.category,
      'Quantity Sold': product.total_sold,
      Revenue: `KES ${parseFloat(product.total_revenue || 0).toFixed(2)}`,
    }));
    exportToExcel(exportData, 'top-products-report', 'Top Products');
  };

  const handleExportCSV = () => {
    const exportData = topProducts.map((product, index) => ({
      Rank: index + 1,
      Product: product.name,
      Code: product.code || '-',
      Category: product.category,
      'Quantity Sold': product.total_sold,
      Revenue: `KES ${parseFloat(product.total_revenue || 0).toFixed(2)}`,
    }));
    exportToCSV(exportData, 'top-products-report');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Reports</h1>
          <p className="text-gray-500 mt-1">Business analytics and insights</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportExcel}
            className="bg-green-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Excel</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>CSV</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-xl text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Today's Sales</h2>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          {dailySales && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-blue-100">Total Sales:</span>
                <span className="font-bold text-2xl">{dailySales.total_sales || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-100">Total Revenue:</span>
                <span className="font-bold text-2xl">KES {parseFloat(dailySales.total_revenue || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-100">Total Collected:</span>
                <span className="font-bold text-xl">KES {parseFloat(dailySales.total_collected || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-100">Unique Customers:</span>
                <span className="font-bold text-xl">{dailySales.unique_customers || 0}</span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl shadow-xl text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Stock Valuation</h2>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
          {stockValuation && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-green-100">Total Products:</span>
                <span className="font-bold text-2xl">{stockValuation.total_products || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-green-100">Total Items:</span>
                <span className="font-bold text-xl">{stockValuation.total_items || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-green-100">Cost Value:</span>
                <span className="font-bold text-xl">KES {parseFloat(stockValuation.total_cost_value || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-green-100">Retail Value:</span>
                <span className="font-bold text-xl">KES {parseFloat(stockValuation.total_retail_value || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-white/20">
                <span className="text-green-100">Potential Profit:</span>
                <span className="font-bold text-2xl">KES {parseFloat(stockValuation.potential_profit || 0).toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Top 10 Selling Products</h2>
        {topProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Code</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Quantity Sold</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topProducts.map((product, index) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-400' : 'bg-blue-500'}`}>
                          {index + 1}
                        </div>
                        <span className="font-medium text-gray-800">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{product.code || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{product.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-800">{product.total_sold}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-green-600 font-bold">
                      KES {parseFloat(product.total_revenue || 0).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500">No sales data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
