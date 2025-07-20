# Database Migrations

This directory contains database migration files for the ERP system.

## Migration Files

### `001_initial_schema.sql`
This is the initial database schema that creates all the necessary tables for the ERP system.

## Tables Created

The migration creates the following main table categories:

### 1. Company and Marketplace
- `companyinfo` - Company information
- `marketplace` - Marketplace information for each company

### 2. User Management
- `userinfo` - User authentication and authorization

### 3. Customer Management
- `customerinfo` - Customer information
- `cust_payment_history` - Customer payment history
- `cust_paymentinfo` - Customer payment details

### 4. Employee Management
- `departments` - Department information
- `positions` - Position information
- `employee_info` - Employee information
- `employee_attendance` - Employee attendance records
- `payment_history` - Employee payment history
- `employee_paymentinfo` - Employee payment details
- `tasks` - Task information
- `employee_tasks` - Employee-task relationships

### 5. Vendor Management
- `vendors` - Vendor information
- `vendor_payments` - Vendor payment records
- `vendor_po` - Vendor purchase orders
- `vendor_po_glsitems` - Vendor PO glass items
- `vendor_bills` - Vendor bills
- `vendor_bill_glsitems` - Vendor bill glass items
- `vendor_bill_gls_accessories` - Vendor bill accessories
- `vendor_bill_otheritems` - Vendor bill other items
- `vendor_product` - Vendor product relationships

### 6. Product Management
- `unitinfo` - Unit information
- `glass_thickness` - Glass thickness properties
- `glass_company` - Glass company information
- `glass_type` - Glass type information
- `glass_colors` - Glass color information
- `glass_sizes` - Glass size information
- `glass_products` - Glass product information
- `glass_inventory` - Glass inventory
- `glass_accessories` - Glass accessories
- `other_products` - Other products

### 7. Service Management
- `serviceinfo` - General service information
- `glass_custom_service` - Glass customization services
- `delivery_service` - Delivery services
- `fitting_service` - Fitting services
- `measurement_service` - Measurement services

### 8. Expense Management
- `emi_types` - EMI types
- `payments_for_emis` - EMI payments
- `payments_for_other_expenses` - Other expense payments
- `expense_service_types` - Expense service types
- `payment_for_services_used` - Service usage payments

### 9. Order Management
- `order_info` - Order information
- `order_products` - Order products
- `order_prod_services` - Order product services
- `order_prod_items` - Order product items
- `order_prod_accessory` - Order product accessories
- `paymentinfo` - Order payment information
- `paymedium` - Payment medium information

## Features

The migration includes:

1. **Foreign Key Constraints** - Proper relationships between tables
2. **Indexes** - Performance optimization for frequently queried columns
3. **Triggers** - Automatic `updated_at` timestamp updates
4. **Default Values** - Sensible defaults for numeric fields
5. **Data Types** - Appropriate PostgreSQL data types
6. **Comments** - Table documentation

## How to Run

### Prerequisites
1. PostgreSQL database server
2. Database connection credentials

### Steps
1. Create a PostgreSQL database
2. Set up your environment variables in `.env`:
   ```
   DB_USER=your_username
   DB_HOST=localhost
   DB_NAME=your_database_name
   DB_PASSWORD=your_password
   DB_PORT=5432
   ```

3. Run the migration:
   ```bash
   # Using psql command line
   psql -U your_username -d your_database_name -f migrations/001_initial_schema.sql
   
   # Or using pgAdmin or any PostgreSQL client
   ```

### Verification
After running the migration, you can verify the tables were created:
```sql
\dt  -- List all tables
\d table_name  -- Describe specific table structure
```

## Rollback
To rollback this migration, you would need to drop all the created tables. However, this is not recommended for production environments. Always backup your data before running migrations.

## Notes
- The migration uses `IF NOT EXISTS` to prevent errors if tables already exist
- All tables include `created_at` and `updated_at` timestamps
- Foreign key constraints ensure data integrity
- Indexes are created for better query performance
- The migration is idempotent and can be run multiple times safely 