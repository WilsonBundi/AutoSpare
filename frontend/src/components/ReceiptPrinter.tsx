import { Product } from '../services/productService';

interface ReceiptProps {
  saleNumber: string;
  items: any[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  changeAmount: number;
  paymentMethod: string;
  customerName?: string;
  shopName?: string;
  shopAddress?: string;
  shopPhone?: string;
  date: Date;
}

const ReceiptPrinter = ({
  saleNumber,
  items,
  subtotal,
  taxAmount,
  totalAmount,
  paidAmount,
  changeAmount,
  paymentMethod,
  customerName,
  shopName = 'Autospare Shop',
  shopAddress = '',
  shopPhone = '',
  date
}: ReceiptProps) => {
  const handlePrint = () => {
    const printContent = document.getElementById('receipt-content');
    if (!printContent) return;

    const printWindow = window.open('', '', 'width=400,height=600');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt - ${saleNumber}</title>
          <style>
            body {
              font-family: 'Courier New', monospace;
              font-size: 12px;
              width: 280px;
              margin: 0;
              padding: 10px;
            }
            .header {
              text-align: center;
              margin-bottom: 10px;
              border-bottom: 1px dashed #000;
              padding-bottom: 10px;
            }
            .shop-name {
              font-size: 16px;
              font-weight: bold;
            }
            .info {
              margin-bottom: 5px;
            }
            .items {
              margin: 10px 0;
              border-bottom: 1px dashed #000;
              padding-bottom: 10px;
            }
            .item {
              display: flex;
              justify-content: space-between;
              margin-bottom: 5px;
            }
            .item-name {
              flex: 1;
            }
            .item-qty {
              width: 40px;
              text-align: center;
            }
            .item-price {
              width: 60px;
              text-align: right;
            }
            .totals {
              margin-top: 10px;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 5px;
            }
            .grand-total {
              font-weight: bold;
              font-size: 14px;
              border-top: 1px dashed #000;
              padding-top: 5px;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              border-top: 1px dashed #000;
              padding-top: 10px;
            }
            @media print {
              body { width: 280px; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <>
      <div id="receipt-content" style={{ display: 'none' }}>
        <div className="header">
          <div className="shop-name">{shopName}</div>
          {shopAddress && <div className="info">{shopAddress}</div>}
          {shopPhone && <div className="info">Tel: {shopPhone}</div>}
          <div className="info">{date.toLocaleString()}</div>
          <div className="info">Receipt #: {saleNumber}</div>
          {customerName && <div className="info">Customer: {customerName}</div>}
        </div>

        <div className="items">
          {items.map((item, index) => (
            <div className="item" key={index}>
              <div className="item-name">{item.product_name}</div>
              <div className="item-qty">x{item.quantity}</div>
              <div className="item-price">KES {item.total_price.toFixed(2)}</div>
            </div>
          ))}
        </div>

        <div className="totals">
          <div className="total-row">
            <span>Subtotal:</span>
            <span>KES {subtotal.toFixed(2)}</span>
          </div>
          <div className="total-row">
            <span>Tax (16%):</span>
            <span>KES {taxAmount.toFixed(2)}</span>
          </div>
          <div className="total-row grand-total">
            <span>TOTAL:</span>
            <span>KES {totalAmount.toFixed(2)}</span>
          </div>
          <div className="total-row">
            <span>Paid:</span>
            <span>KES {paidAmount.toFixed(2)}</span>
          </div>
          <div className="total-row">
            <span>Change:</span>
            <span>KES {changeAmount.toFixed(2)}</span>
          </div>
          <div className="total-row">
            <span>Payment:</span>
            <span>{paymentMethod.toUpperCase()}</span>
          </div>
        </div>

        <div className="footer">
          <div>Thank you for your business!</div>
          <div>Please come again</div>
        </div>
      </div>

      <button
        onClick={handlePrint}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        🖨️ Print Receipt
      </button>
    </>
  );
};

export default ReceiptPrinter;
