-- Supplier pricing table to track product prices from different suppliers
CREATE TABLE IF NOT EXISTS supplier_pricing (
    id SERIAL PRIMARY KEY,
    supplier_id INTEGER REFERENCES suppliers(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    buying_price DECIMAL(10,2) NOT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(supplier_id, product_id)
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_supplier_pricing_supplier ON supplier_pricing(supplier_id);
CREATE INDEX IF NOT EXISTS idx_supplier_pricing_product ON supplier_pricing(product_id);
