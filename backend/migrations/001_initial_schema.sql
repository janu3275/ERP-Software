-- ERP Software Database Migration
-- Initial Schema Creation
-- This migration creates all the necessary tables for the ERP system

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Company and Marketplace Tables
CREATE TABLE IF NOT EXISTS companyinfo (
    companyid SERIAL PRIMARY KEY,
    companyname VARCHAR(255) NOT NULL,
    gstnumber VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS marketplace (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image_src VARCHAR(500),
    company_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_company_id FOREIGN KEY (company_id) REFERENCES companyinfo (companyid) ON DELETE CASCADE
);

-- User Management Tables
CREATE TABLE IF NOT EXISTS userinfo (
    id SERIAL PRIMARY KEY,
    userid VARCHAR(255) NOT NULL UNIQUE,
    access VARCHAR(50) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    market_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_market_id FOREIGN KEY (market_id) REFERENCES marketplace (id) ON DELETE CASCADE
);

-- Customer Management Tables
CREATE TABLE IF NOT EXISTS customerinfo (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    mobile_number VARCHAR(15) NOT NULL,
    whatsapp_number VARCHAR(15),
    email_address VARCHAR(255),
    company_name VARCHAR(255),
    address TEXT,
    gstin VARCHAR(15),
    pan VARCHAR(10),
    adhaar_number VARCHAR(12),
    note TEXT,
    market_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_customer_market_id FOREIGN KEY (market_id) REFERENCES marketplace (id) ON DELETE CASCADE
);

-- Customer Payment Tables
CREATE TABLE IF NOT EXISTS cust_payment_history (
    id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL,
    payment_date DATE NOT NULL,
    attachment_path VARCHAR(500),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_customer_id FOREIGN KEY (customer_id) REFERENCES customerinfo (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cust_paymentinfo (
    id SERIAL PRIMARY KEY,
    cash DECIMAL(10,2) DEFAULT 0,
    upi DECIMAL(10,2) DEFAULT 0,
    cheque DECIMAL(10,2) DEFAULT 0,
    other DECIMAL(10,2) DEFAULT 0,
    custpayhistoryid INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cust_payment_history_id FOREIGN KEY (custpayhistoryid) REFERENCES cust_payment_history (id) ON DELETE CASCADE
);

-- Employee Management Tables
CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    department_name VARCHAR(255) NOT NULL,
    market_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_department_market_id FOREIGN KEY (market_id) REFERENCES marketplace (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS positions (
    id SERIAL PRIMARY KEY,
    position_name VARCHAR(255) NOT NULL,
    market_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_position_market_id FOREIGN KEY (market_id) REFERENCES marketplace (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS employee_info (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone_number VARCHAR(15),
    whatsapp_number VARCHAR(15),
    date_of_birth DATE,
    address TEXT,
    city VARCHAR(255),
    state_province VARCHAR(255),
    country VARCHAR(255),
    postal_code VARCHAR(20),
    department_id INT,
    position_id INT,
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(15),
    employee_photo VARCHAR(500),
    notes_comments TEXT,
    bank VARCHAR(255),
    account_number VARCHAR(50),
    ifsc_code VARCHAR(20),
    salary DECIMAL(10,2),
    market_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_employee_department_id FOREIGN KEY (department_id) REFERENCES departments (id) ON DELETE SET NULL,
    CONSTRAINT fk_employee_position_id FOREIGN KEY (position_id) REFERENCES positions (id) ON DELETE SET NULL,
    CONSTRAINT fk_employee_market_id FOREIGN KEY (market_id) REFERENCES marketplace (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS employee_attendance (
    id SERIAL PRIMARY KEY,
    employee_id INT NOT NULL,
    attendance_date DATE NOT NULL,
    attendance_status VARCHAR(50) NOT NULL,
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_attendance_employee_id FOREIGN KEY (employee_id) REFERENCES employee_info (id) ON DELETE CASCADE
);

-- Employee Payment Tables
CREATE TABLE IF NOT EXISTS payment_history (
    id SERIAL PRIMARY KEY,
    employee_id INT NOT NULL,
    payment_date DATE NOT NULL,
    attachment_path VARCHAR(500),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payment_employee_id FOREIGN KEY (employee_id) REFERENCES employee_info (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS employee_paymentinfo (
    id SERIAL PRIMARY KEY,
    cash DECIMAL(10,2) DEFAULT 0,
    upi DECIMAL(10,2) DEFAULT 0,
    cheque DECIMAL(10,2) DEFAULT 0,
    other DECIMAL(10,2) DEFAULT 0,
    paymenthistoryid INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_employee_payment_history_id FOREIGN KEY (paymenthistoryid) REFERENCES payment_history (id) ON DELETE CASCADE
);

-- Task Management Tables
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    task_name VARCHAR(255) NOT NULL,
    description TEXT,
    min_personnel INT NOT NULL,
    measured_per_unit_id INT,
    completion_time_per_unit INT NOT NULL,
    market_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_task_market_id FOREIGN KEY (market_id) REFERENCES marketplace (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS employee_tasks (
    id SERIAL PRIMARY KEY,
    employee_id INT NOT NULL,
    task_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_employee_task_employee_id FOREIGN KEY (employee_id) REFERENCES employee_info (id) ON DELETE CASCADE,
    CONSTRAINT fk_employee_task_task_id FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE
);

-- Vendor Management Tables
CREATE TABLE IF NOT EXISTS vendors (
    id SERIAL PRIMARY KEY,
    vendor_name VARCHAR(255) NOT NULL,
    product_type VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone_number VARCHAR(15),
    whatsapp_number VARCHAR(15),
    address TEXT,
    city VARCHAR(255),
    state_province VARCHAR(255),
    country VARCHAR(255),
    postal_code VARCHAR(20),
    notes TEXT,
    market_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_vendor_market_id FOREIGN KEY (market_id) REFERENCES marketplace (id) ON DELETE CASCADE
);

-- Vendor Payment Tables
CREATE TABLE IF NOT EXISTS vendor_payments (
    id SERIAL PRIMARY KEY,
    payment_date DATE NOT NULL,
    attachment_path VARCHAR(500),
    amount DECIMAL(10,2) NOT NULL,
    note TEXT,
    vendor_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_vendor_payment_vendor_id FOREIGN KEY (vendor_id) REFERENCES vendors (id) ON DELETE CASCADE
);

-- Vendor PO Tables
CREATE TABLE IF NOT EXISTS vendor_po (
    id SERIAL PRIMARY KEY,
    note TEXT,
    vendor_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_vendor_po_vendor_id FOREIGN KEY (vendor_id) REFERENCES vendors (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS vendor_po_glsitems (
    id SERIAL PRIMARY KEY,
    vendor_po_id INT NOT NULL,
    glass_inventory_id INT NOT NULL,
    quantity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_vendor_po_glsitems_po_id FOREIGN KEY (vendor_po_id) REFERENCES vendor_po (id) ON DELETE CASCADE
);

-- Vendor Bill Tables
CREATE TABLE IF NOT EXISTS vendor_bills (
    id SERIAL PRIMARY KEY,
    bill_number VARCHAR(255) NOT NULL,
    attachment_path VARCHAR(500),
    bill_amount DECIMAL(10,2) NOT NULL,
    bill_date DATE NOT NULL,
    note TEXT,
    vendor_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_vendor_bill_vendor_id FOREIGN KEY (vendor_id) REFERENCES vendors (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS vendor_bill_glsitems (
    id SERIAL PRIMARY KEY,
    vendor_bill_id INT NOT NULL,
    glass_inventory_id INT NOT NULL,
    quantity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_vendor_bill_glsitems_bill_id FOREIGN KEY (vendor_bill_id) REFERENCES vendor_bills (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS vendor_bill_gls_accessories (
    id SERIAL PRIMARY KEY,
    vendor_bill_id INT NOT NULL,
    glass_accessory_id INT NOT NULL,
    quantity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_vendor_bill_accessories_bill_id FOREIGN KEY (vendor_bill_id) REFERENCES vendor_bills (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS vendor_bill_otheritems (
    id SERIAL PRIMARY KEY,
    vendor_bill_id INT NOT NULL,
    other_products_id INT NOT NULL,
    quantity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_vendor_bill_otheritems_bill_id FOREIGN KEY (vendor_bill_id) REFERENCES vendor_bills (id) ON DELETE CASCADE
);

-- Vendor Product Tables
CREATE TABLE IF NOT EXISTS vendor_product (
    id SERIAL PRIMARY KEY,
    vendor_id INT NOT NULL,
    product_id INT NOT NULL,
    cost_per_unit DECIMAL(10,2) NOT NULL,
    market_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_vendor_product_vendor_id FOREIGN KEY (vendor_id) REFERENCES vendors (id) ON DELETE CASCADE,
    CONSTRAINT fk_vendor_product_market_id FOREIGN KEY (market_id) REFERENCES marketplace (id) ON DELETE CASCADE
);

-- Unit Management Tables
CREATE TABLE IF NOT EXISTS unitinfo (
    id SERIAL PRIMARY KEY,
    unit VARCHAR(50) NOT NULL,
    market_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_unit_market_id FOREIGN KEY (market_id) REFERENCES marketplace (id) ON DELETE CASCADE
);

-- Glass Properties Tables
CREATE TABLE IF NOT EXISTS glass_thickness (
    id SERIAL PRIMARY KEY,
    thickness DECIMAL(10,2) NOT NULL,
    unitid INT NOT NULL,
    market_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_glass_thickness_unit_id FOREIGN KEY (unitid) REFERENCES unitinfo (id) ON DELETE CASCADE,
    CONSTRAINT fk_glass_thickness_market_id FOREIGN KEY (market_id) REFERENCES marketplace (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS glass_company (
    id SERIAL PRIMARY KEY,
    glass_company VARCHAR(255) NOT NULL,
    market_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_glass_company_market_id FOREIGN KEY (market_id) REFERENCES marketplace (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS glass_type (
    id SERIAL PRIMARY KEY,
    glass_type VARCHAR(255) NOT NULL,
    market_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_glass_type_market_id FOREIGN KEY (market_id) REFERENCES marketplace (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS glass_colors (
    id SERIAL PRIMARY KEY,
    color VARCHAR(255) NOT NULL,
    market_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_glass_colors_market_id FOREIGN KEY (market_id) REFERENCES marketplace (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS glass_sizes (
    id SERIAL PRIMARY KEY,
    length DECIMAL(10,2) NOT NULL,
    width DECIMAL(10,2) NOT NULL,
    unitid INT NOT NULL,
    market_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_glass_sizes_unit_id FOREIGN KEY (unitid) REFERENCES unitinfo (id) ON DELETE CASCADE,
    CONSTRAINT fk_glass_sizes_market_id FOREIGN KEY (market_id) REFERENCES marketplace (id) ON DELETE CASCADE
);

-- Product Tables
CREATE TABLE IF NOT EXISTS glass_products (
    id SERIAL PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    description TEXT,
    market_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_glass_products_market_id FOREIGN KEY (market_id) REFERENCES marketplace (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS glass_inventory (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL,
    thickness_id INT NOT NULL,
    company_id INT NOT NULL,
    type_id INT NOT NULL,
    color_id INT NOT NULL,
    size_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    price_per_unit DECIMAL(10,2) NOT NULL,
    market_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_glass_inventory_product_id FOREIGN KEY (product_id) REFERENCES glass_products (id) ON DELETE CASCADE,
    CONSTRAINT fk_glass_inventory_thickness_id FOREIGN KEY (thickness_id) REFERENCES glass_thickness (id) ON DELETE CASCADE,
    CONSTRAINT fk_glass_inventory_company_id FOREIGN KEY (company_id) REFERENCES glass_company (id) ON DELETE CASCADE,
    CONSTRAINT fk_glass_inventory_type_id FOREIGN KEY (type_id) REFERENCES glass_type (id) ON DELETE CASCADE,
    CONSTRAINT fk_glass_inventory_color_id FOREIGN KEY (color_id) REFERENCES glass_colors (id) ON DELETE CASCADE,
    CONSTRAINT fk_glass_inventory_size_id FOREIGN KEY (size_id) REFERENCES glass_sizes (id) ON DELETE CASCADE,
    CONSTRAINT fk_glass_inventory_market_id FOREIGN KEY (market_id) REFERENCES marketplace (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS glass_accessories (
    id SERIAL PRIMARY KEY,
    accessory_name VARCHAR(255) NOT NULL,
    description TEXT,
    price_per_unit DECIMAL(10,2) NOT NULL,
    market_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_glass_accessories_market_id FOREIGN KEY (market_id) REFERENCES marketplace (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS other_products (
    id SERIAL PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    description TEXT,
    price_per_unit DECIMAL(10,2) NOT NULL,
    market_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_other_products_market_id FOREIGN KEY (market_id) REFERENCES marketplace (id) ON DELETE CASCADE
);

-- Service Tables
CREATE TABLE IF NOT EXISTS serviceinfo (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    unitprice DECIMAL(10,2) NOT NULL,
    companyid INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_service_company_id FOREIGN KEY (companyid) REFERENCES companyinfo (companyid) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS glass_custom_service (
    id SERIAL PRIMARY KEY,
    service_name VARCHAR(255) NOT NULL,
    description TEXT,
    rate_per_unit DECIMAL(10,2) NOT NULL,
    market_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_glass_custom_service_market_id FOREIGN KEY (market_id) REFERENCES marketplace (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS delivery_service (
    id SERIAL PRIMARY KEY,
    service_name VARCHAR(255) NOT NULL,
    description TEXT,
    vehicle_type VARCHAR(255),
    rate_per_km DECIMAL(10,2) NOT NULL,
    market_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_delivery_service_market_id FOREIGN KEY (market_id) REFERENCES marketplace (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS fitting_service (
    id SERIAL PRIMARY KEY,
    service_name VARCHAR(255) NOT NULL,
    description TEXT,
    rate_per_hour_per_person DECIMAL(10,2) NOT NULL,
    market_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_fitting_service_market_id FOREIGN KEY (market_id) REFERENCES marketplace (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS measurement_service (
    id SERIAL PRIMARY KEY,
    service_name VARCHAR(255) NOT NULL,
    description TEXT,
    rate_per_hour_per_person DECIMAL(10,2) NOT NULL,
    rate_per_km DECIMAL(10,2) NOT NULL,
    market_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_measurement_service_market_id FOREIGN KEY (market_id) REFERENCES marketplace (id) ON DELETE CASCADE
);

-- Expense Tables
CREATE TABLE IF NOT EXISTS emi_types (
    id SERIAL PRIMARY KEY,
    purpose VARCHAR(255) NOT NULL,
    market_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_emi_types_market_id FOREIGN KEY (market_id) REFERENCES marketplace (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS payments_for_emis (
    id SERIAL PRIMARY KEY,
    emi_types_id INT NOT NULL,
    attachment_path VARCHAR(500),
    payment_date DATE NOT NULL,
    cash DECIMAL(10,2) DEFAULT 0,
    upi DECIMAL(10,2) DEFAULT 0,
    cheque DECIMAL(10,2) DEFAULT 0,
    other DECIMAL(10,2) DEFAULT 0,
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payments_for_emis_emi_types_id FOREIGN KEY (emi_types_id) REFERENCES emi_types (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS payments_for_other_expenses (
    id SERIAL PRIMARY KEY,
    expense_name VARCHAR(255) NOT NULL,
    description TEXT,
    attachment_path VARCHAR(500),
    payment_date DATE NOT NULL,
    cash DECIMAL(10,2) DEFAULT 0,
    upi DECIMAL(10,2) DEFAULT 0,
    cheque DECIMAL(10,2) DEFAULT 0,
    other DECIMAL(10,2) DEFAULT 0,
    market_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payments_for_other_expenses_market_id FOREIGN KEY (market_id) REFERENCES marketplace (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS expense_service_types (
    id SERIAL PRIMARY KEY,
    service_name VARCHAR(255) NOT NULL,
    market_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_expense_service_types_market_id FOREIGN KEY (market_id) REFERENCES marketplace (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS payment_for_services_used (
    id SERIAL PRIMARY KEY,
    expense_service_types_id INT NOT NULL,
    attachment_path VARCHAR(500),
    payment_date DATE NOT NULL,
    cash DECIMAL(10,2) DEFAULT 0,
    upi DECIMAL(10,2) DEFAULT 0,
    cheque DECIMAL(10,2) DEFAULT 0,
    other DECIMAL(10,2) DEFAULT 0,
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payment_for_services_used_expense_service_types_id FOREIGN KEY (expense_service_types_id) REFERENCES expense_service_types (id) ON DELETE CASCADE
);

-- Order Management Tables
CREATE TABLE IF NOT EXISTS order_info (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(255) NOT NULL,
    customer_id INT NOT NULL,
    order_date DATE NOT NULL,
    completion_date DATE NOT NULL,
    measuredby VARCHAR(255) NOT NULL,
    product_charges DECIMAL(10,2) DEFAULT 0,
    measurement_charges JSONB,
    dilevery_charges JSONB,
    labour_charges DECIMAL(10,2) DEFAULT 0,
    fitting_charges JSONB,
    discount DECIMAL(10,2) DEFAULT 0,
    order_status VARCHAR(50) DEFAULT 'pending',
    market_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_order_info_customer_id FOREIGN KEY (customer_id) REFERENCES customerinfo (id) ON DELETE CASCADE,
    CONSTRAINT fk_order_info_market_id FOREIGN KEY (market_id) REFERENCES marketplace (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS order_products (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL,
    orderid INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_order_products_product_id FOREIGN KEY (product_id) REFERENCES glass_products (id) ON DELETE CASCADE,
    CONSTRAINT fk_order_products_orderid FOREIGN KEY (orderid) REFERENCES order_info (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS order_prod_services (
    id SERIAL PRIMARY KEY,
    glass_custom_service_id INT NOT NULL,
    order_products_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_order_prod_services_glass_custom_service_id FOREIGN KEY (glass_custom_service_id) REFERENCES glass_custom_service (id) ON DELETE CASCADE,
    CONSTRAINT fk_order_prod_services_order_products_id FOREIGN KEY (order_products_id) REFERENCES order_products (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS order_prod_items (
    id SERIAL PRIMARY KEY,
    length DECIMAL(10,2) NOT NULL,
    width DECIMAL(10,2) NOT NULL,
    area DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL,
    charge DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    img_path VARCHAR(500),
    item_id VARCHAR(255),
    order_products_id INT NOT NULL,
    orderid INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_order_prod_items_order_products_id FOREIGN KEY (order_products_id) REFERENCES order_products (id) ON DELETE CASCADE,
    CONSTRAINT fk_order_prod_items_orderid FOREIGN KEY (orderid) REFERENCES order_info (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS order_prod_accessory (
    id SERIAL PRIMARY KEY,
    accessory_id INT NOT NULL,
    quantity INT NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    order_products_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_order_prod_accessory_accessory_id FOREIGN KEY (accessory_id) REFERENCES glass_accessories (id) ON DELETE CASCADE,
    CONSTRAINT fk_order_prod_accessory_order_products_id FOREIGN KEY (order_products_id) REFERENCES order_products (id) ON DELETE CASCADE
);

-- Payment Tables
CREATE TABLE IF NOT EXISTS paymentinfo (
    id SERIAL PRIMARY KEY,
    cash DECIMAL(10,2) DEFAULT 0,
    upi DECIMAL(10,2) DEFAULT 0,
    cheque DECIMAL(10,2) DEFAULT 0,
    other DECIMAL(10,2) DEFAULT 0,
    payment_date DATE NOT NULL,
    note TEXT,
    orderid INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_paymentinfo_orderid FOREIGN KEY (orderid) REFERENCES order_info (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS paymedium (
    id SERIAL PRIMARY KEY,
    amount DECIMAL(10,2) NOT NULL,
    medium VARCHAR(50) NOT NULL,
    paymentid INT NOT NULL,
    orderid INT NOT NULL,
    companyid INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_paymedium_paymentid FOREIGN KEY (paymentid) REFERENCES paymentinfo (id) ON DELETE CASCADE,
    CONSTRAINT fk_paymedium_orderid FOREIGN KEY (orderid) REFERENCES order_info (id) ON DELETE CASCADE,
    CONSTRAINT fk_paymedium_companyid FOREIGN KEY (companyid) REFERENCES companyinfo (companyid) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_customerinfo_market_id ON customerinfo(market_id);
CREATE INDEX idx_employee_info_market_id ON employee_info(market_id);
CREATE INDEX idx_vendors_market_id ON vendors(market_id);
CREATE INDEX idx_order_info_market_id ON order_info(market_id);
CREATE INDEX idx_order_info_customer_id ON order_info(customer_id);
CREATE INDEX idx_order_info_order_status ON order_info(order_status);
CREATE INDEX idx_cust_payment_history_customer_id ON cust_payment_history(customer_id);
CREATE INDEX idx_payment_history_employee_id ON payment_history(employee_id);
CREATE INDEX idx_vendor_payments_vendor_id ON vendor_payments(vendor_id);
CREATE INDEX idx_glass_inventory_market_id ON glass_inventory(market_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_companyinfo_updated_at BEFORE UPDATE ON companyinfo FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_marketplace_updated_at BEFORE UPDATE ON marketplace FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_userinfo_updated_at BEFORE UPDATE ON userinfo FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customerinfo_updated_at BEFORE UPDATE ON customerinfo FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_employee_info_updated_at BEFORE UPDATE ON employee_info FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_positions_updated_at BEFORE UPDATE ON positions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON vendors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_unitinfo_updated_at BEFORE UPDATE ON unitinfo FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_glass_thickness_updated_at BEFORE UPDATE ON glass_thickness FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_glass_company_updated_at BEFORE UPDATE ON glass_company FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_glass_type_updated_at BEFORE UPDATE ON glass_type FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_glass_colors_updated_at BEFORE UPDATE ON glass_colors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_glass_sizes_updated_at BEFORE UPDATE ON glass_sizes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_glass_products_updated_at BEFORE UPDATE ON glass_products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_glass_inventory_updated_at BEFORE UPDATE ON glass_inventory FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_glass_accessories_updated_at BEFORE UPDATE ON glass_accessories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_other_products_updated_at BEFORE UPDATE ON other_products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_serviceinfo_updated_at BEFORE UPDATE ON serviceinfo FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_glass_custom_service_updated_at BEFORE UPDATE ON glass_custom_service FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_delivery_service_updated_at BEFORE UPDATE ON delivery_service FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_fitting_service_updated_at BEFORE UPDATE ON fitting_service FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_measurement_service_updated_at BEFORE UPDATE ON measurement_service FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_emi_types_updated_at BEFORE UPDATE ON emi_types FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_expense_service_types_updated_at BEFORE UPDATE ON expense_service_types FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_order_info_updated_at BEFORE UPDATE ON order_info FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default data
INSERT INTO unitinfo (unit, market_id) VALUES 
('mm', 1),
('cm', 1),
('m', 1),
('inch', 1),
('ft', 1)
ON CONFLICT DO NOTHING;

-- Create a rollback migration file
COMMENT ON TABLE companyinfo IS 'Stores company information';
COMMENT ON TABLE marketplace IS 'Stores marketplace information for each company';
COMMENT ON TABLE userinfo IS 'Stores user authentication and authorization information';
COMMENT ON TABLE customerinfo IS 'Stores customer information';
COMMENT ON TABLE employee_info IS 'Stores employee information';
COMMENT ON TABLE vendors IS 'Stores vendor information';
COMMENT ON TABLE order_info IS 'Stores order information';
COMMENT ON TABLE glass_inventory IS 'Stores glass inventory information'; 