-- Seed data for Boda Boda Spare Parts POS
-- Run this after schema.sql to populate with sample data

-- Insert sample products
INSERT INTO products (name, code, barcode, category_id, buying_price, selling_price, wholesale_price, unit, current_stock, reorder_level, location, description) VALUES
-- Brakes
('Front Brake Pads Boxer CT100', 'BRK-001', '1234567890123', 1, 450.00, 650.00, 600.00, 'pair', 50, 15, 'A1', 'High-quality front brake pads for Boxer CT100'),
('Rear Brake Pads Boxer CT100', 'BRK-002', '1234567890124', 1, 450.00, 650.00, 600.00, 'pair', 45, 15, 'A1', 'High-quality rear brake pads for Boxer CT100'),
('Brake Disc Front', 'BRK-003', '1234567890125', 1, 1200.00, 1600.00, 1500.00, 'piece', 30, 10, 'A2', 'Front brake disc compatible with most models'),
('Brake Caliper', 'BRK-004', '1234567890126', 1, 2500.00, 3200.00, 3000.00, 'piece', 20, 5, 'A2', 'Brake caliper assembly'),

-- Chains & Sprockets
('Drive Chain 428', 'CHN-001', '1234567890127', 2, 1500.00, 2200.00, 2000.00, 'piece', 40, 12, 'B1', '428 drive chain for standard bikes'),
('Drive Chain 520', 'CHN-002', '1234567890128', 2, 1800.00, 2600.00, 2400.00, 'piece', 35, 10, 'B1', '520 drive chain for heavy bikes'),
('Front Sprocket 14T', 'SPR-001', '1234567890129', 2, 800.00, 1100.00, 1000.00, 'piece', 60, 20, 'B2', '14-tooth front sprocket'),
('Rear Sprocket 42T', 'SPR-002', '1234567890130', 2, 1200.00, 1600.00, 1500.00, 'piece', 55, 18, 'B2', '42-tooth rear sprocket'),
('Chain Kit Complete', 'CHN-003', '1234567890131', 2, 3500.00, 4800.00, 4500.00, 'set', 25, 8, 'B1', 'Complete chain kit with sprockets'),

-- Tyres
('Front Tyre 2.75-18', 'TYR-001', '1234567890132', 3, 2500.00, 3500.00, 3200.00, 'piece', 30, 10, 'C1', 'Front tyre 2.75-18 tube type'),
('Rear Tyre 3.00-18', 'TYR-002', '1234567890133', 3, 2800.00, 4000.00, 3700.00, 'piece', 25, 10, 'C1', 'Rear tyre 3.00-18 tube type'),
('Inner Tube 2.75-18', 'TUB-001', '1234567890134', 3, 350.00, 500.00, 450.00, 'piece', 80, 25, 'C2', 'Inner tube for 2.75-18 tyre'),
('Inner Tube 3.00-18', 'TUB-002', '1234567890135', 3, 400.00, 550.00, 500.00, 'piece', 75, 25, 'C2', 'Inner tube for 3.00-18 tyre'),

-- Spark Plugs
('Spark Plug CR7HSA', 'SPK-001', '1234567890136', 4, 150.00, 250.00, 220.00, 'piece', 100, 30, 'D1', 'NGK CR7HSA spark plug'),
('Spark Plug CR8HSA', 'SPK-002', '1234567890137', 4, 180.00, 280.00, 250.00, 'piece', 90, 30, 'D1', 'NGK CR8HSA spark plug'),
('Spark Plug DR8EA', 'SPK-003', '1234567890138', 4, 200.00, 300.00, 270.00, 'piece', 85, 25, 'D1', 'NGK DR8EA spark plug'),

-- Filters
('Air Filter Universal', 'FLT-001', '1234567890139', 5, 250.00, 400.00, 350.00, 'piece', 60, 20, 'E1', 'Universal air filter'),
('Oil Filter Boxer', 'FLT-002', '1234567890140', 5, 300.00, 450.00, 400.00, 'piece', 50, 15, 'E1', 'Oil filter for Boxer models'),
('Fuel Filter', 'FLT-003', '1234567890141', 5, 200.00, 350.00, 300.00, 'piece', 70, 25, 'E2', 'Inline fuel filter'),

-- Oils & Lubricants
('Engine Oil 10W40 1L', 'OIL-001', '1234567890142', 6, 600.00, 850.00, 800.00, 'litre', 40, 15, 'F1', '10W40 engine oil 1 litre'),
('Engine Oil 10W40 4L', 'OIL-002', '1234567890143', 6, 2200.00, 3000.00, 2800.00, 'litre', 20, 8, 'F1', '10W40 engine oil 4 litres'),
('Brake Fluid DOT4', 'OIL-003', '1234567890144', 6, 450.00, 650.00, 600.00, 'litre', 35, 12, 'F2', 'DOT4 brake fluid 500ml'),
('Chain Lube Spray', 'OIL-004', '1234567890145', 6, 550.00, 750.00, 700.00, 'piece', 45, 15, 'F2', 'Chain lubricant spray 400ml'),
('Gear Oil 80W90', 'OIL-005', '1234567890146', 6, 700.00, 950.00, 900.00, 'litre', 30, 10, 'F1', '80W90 gear oil 1 litre'),

-- Electricals
('Battery 12V 5Ah', 'ELC-001', '1234567890147', 7, 2500.00, 3500.00, 3200.00, 'piece', 20, 8, 'G1', '12V 5Ah maintenance-free battery'),
('Headlight Bulb 12V 35W', 'ELC-002', '1234567890148', 7, 150.00, 250.00, 220.00, 'piece', 100, 30, 'G2', '12V 35W headlight bulb'),
('Tail Light Bulb 12V 21W', 'ELC-003', '1234567890149', 7, 100.00, 180.00, 150.00, 'piece', 120, 40, 'G2', '12V 21W tail light bulb'),
('Indicator Bulb 12V 21W', 'ELC-004', '1234567890150', 7, 100.00, 180.00, 150.00, 'piece', 120, 40, 'G2', '12V 21W indicator bulb'),
('Rectifier Regulator', 'ELC-005', '1234567890151', 7, 1200.00, 1800.00, 1600.00, 'piece', 25, 10, 'G1', 'Voltage rectifier regulator'),
('CDI Unit Boxer', 'ELC-006', '1234567890152', 7, 1500.00, 2200.00, 2000.00, 'piece', 20, 8, 'G1', 'CDI ignition unit for Boxer'),

-- Engine Parts
('Piston Kit 100cc', 'ENG-001', '1234567890153', 8, 2500.00, 3500.00, 3200.00, 'set', 15, 5, 'H1', 'Complete piston kit 100cc'),
('Piston Ring Set', 'ENG-002', '1234567890154', 8, 800.00, 1200.00, 1100.00, 'set', 30, 10, 'H1', 'Piston ring set'),
('Valve Set', 'ENG-003', '1234567890155', 8, 1200.00, 1800.00, 1600.00, 'set', 25, 8, 'H1', 'Complete valve set (intake + exhaust)'),
('Gasket Set Complete', 'ENG-004', '1234567890156', 8, 1500.00, 2200.00, 2000.00, 'set', 20, 8, 'H1', 'Complete engine gasket set'),
('Clutch Plates Set', 'ENG-005', '1234567890157', 8, 1800.00, 2500.00, 2300.00, 'set', 25, 10, 'H1', 'Clutch friction plates set'),

-- Body Parts
('Front Mudguard', 'BDY-001', '1234567890158', 9, 1200.00, 1800.00, 1600.00, 'piece', 20, 8, 'I1', 'Front mudguard plastic'),
('Rear Mudguard', 'BDY-002', '1234567890159', 9, 1400.00, 2000.00, 1800.00, 'piece', 18, 8, 'I1', 'Rear mudguard plastic'),
('Headlight Assembly', 'BDY-003', '1234567890160', 9, 2000.00, 2800.00, 2600.00, 'piece', 15, 6, 'I2', 'Complete headlight assembly with lens'),
('Side Mirror Pair', 'BDY-004', '1234567890161', 9, 600.00, 900.00, 800.00, 'pair', 40, 15, 'I1', 'Pair of side mirrors'),
('Seat Cover', 'BDY-005', '1234567890162', 9, 1500.00, 2200.00, 2000.00, 'piece', 12, 5, 'I1', 'Replacement seat cover'),
('Handle Grips Pair', 'BDY-006', '1234567890163', 9, 300.00, 500.00, 450.00, 'pair', 80, 25, 'I1', 'Rubber handle grips'),

-- Fuel System
('Carburetor Boxer', 'FSL-001', '1234567890164', 10, 2500.00, 3500.00, 3200.00, 'piece', 15, 6, 'J1', 'Carburetor for Boxer models'),
('Fuel Petcock', 'FSL-002', '1234567890165', 10, 600.00, 900.00, 800.00, 'piece', 35, 12, 'J1', 'Fuel tank petcock valve'),
('Fuel Hose', 'FSL-003', '1234567890166', 10, 200.00, 350.00, 300.00, 'metre', 50, 20, 'J2', 'Fuel hose per metre'),

-- Suspension
('Front Shock Absorber', 'SPN-001', '1234567890167', 11, 3000.00, 4200.00, 4000.00, 'piece', 15, 6, 'K1', 'Front shock absorber'),
('Rear Shock Absorber', 'SPN-002', '1234567890168', 11, 3500.00, 4800.00, 4500.00, 'piece', 12, 5, 'K1', 'Rear shock absorber'),
('Fork Seal Set', 'SPN-003', '1234567890169', 11, 500.00, 800.00, 700.00, 'pair', 40, 15, 'K1', 'Fork seal set (pair)');

-- Insert sample customers
INSERT INTO customers (name, phone, email, address, customer_type, credit_limit, current_balance) VALUES
('John Kamau', '+254712345678', 'john.kamau@email.com', 'Nairobi', 'rider', 50000.00, 12000.00),
('Mary Wanjiku', '+254723456789', 'mary.wanjiku@email.com', 'Nairobi', 'mechanic', 100000.00, 35000.00),
('Peter Ochieng', '+254734567890', 'peter@email.com', 'Kisumu', 'rider', 30000.00, 5000.00),
('City Garage', '+254745678901', 'citygarage@email.com', 'Industrial Area', 'garage', 200000.00, 85000.00),
('Grace Akinyi', '+254756789012', 'grace@email.com', 'Mombasa', 'rider', 40000.00, 0.00),
('James Maina', '+254767890123', 'james@email.com', 'Nakuru', 'mechanic', 80000.00, 25000.00),
('Walk-in Customer', NULL, NULL, NULL, 'walk-in', 0.00, 0.00);

-- Update admin user password (change this in production!)
-- Default password is 'admin123'
-- Hash generated with bcrypt (10 rounds)
UPDATE users SET password = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy' WHERE username = 'admin';

-- Note: You can generate a new hash using: npm run hash-password <your-password>
