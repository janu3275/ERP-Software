// add vendor, update vendor, delete vendor, add products per vendor, update products per vendor, delete products per vendor
import { asyncHandler } from "../../middleware/asynchandler.mjs";
import { queryDB } from "../../db.mjs";
import Joi from "joi";

const vendorApi = {
    
  addVendor: asyncHandler(async (req, res, next) => { 
   
    const market_id = req.market.market_id;

    const schema = Joi.object({
      vendor_name: Joi.string().required(),
      contact_person: Joi.string().required(),
      product_type: Joi.string().required(),
      email: Joi.string().email().allow('').allow(null),
      phone_number: Joi.number().allow('').allow(null),
      whatsapp_number: Joi.number().allow('').allow(null),
      address: Joi.string().allow('').allow(null),
      city: Joi.string().allow('').allow(null),
      state_province: Joi.string().allow('').allow(null),
      country: Joi.string().allow('').allow(null),
      postal_code: Joi.string().allow('').allow(null),
      notes: Joi.string().allow('').allow(null),
      market_id: Joi.number().integer().required(),
    });

    const body = {
      ...req.body,
      market_id
    }

    const { error, value } = schema.validate(body);

    if (error) {
      console.log(error.details);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: error.details
      });
    }

    const insertQuery = `
            INSERT INTO vendors (vendor_name, product_type , contact_person, email, phone_number, whatsapp_number, address, city, state_province, country, postal_code, notes, market_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            RETURNING *;`;

    try {
      const addedVendor = (
        await queryDB(insertQuery, [
          value.vendor_name,
          value.product_type,
          value.contact_person || null,
          value.email || null,
          value.phone_number || null,
          value.whatsapp_number || null,
          value.address || null,
          value.city || null,
          value.state_province || null,
          value.country || null,
          value.postal_code || null,
          value.notes,
          value.market_id,
        ])
      ).rows[0];

      if (addedVendor) {
        res.status(200).json({
          success: true,
          message: "Vendor added successfully",
          data: addedVendor,
        });
      } else {
        res.status(200).json({
          success: false,
          message: "Problem in creating new vendor",
        });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Creating error", error: error });
    }
  }),

  updateVendor: asyncHandler(async (req, res, next) => {
    const schema = Joi.object({
      vendor_id: Joi.number().integer().required(),
      vendor_name: Joi.string().required(),
      contact_person: Joi.string().required(),
      product_type: Joi.string().required(),
      email: Joi.string().email().allow('').allow(null),
      phone_number: Joi.number().allow('').allow(null),
      whatsapp_number: Joi.number().allow('').allow(null),
      address: Joi.string().allow('').allow(null),
      city: Joi.string().allow('').allow(null),
      state_province: Joi.string().allow('').allow(null),
      country: Joi.string().allow('').allow(null),
      postal_code: Joi.string().allow('').allow(null),
      notes: Joi.string().allow('').allow(null),
    });

    const body = {
      ...req.body
    }

    const { error, value } = schema.validate(body);

    if (error) {
      console.log(error.details);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: error.details,
      });
    }

    const updateQuery = `
            UPDATE vendors
            SET
                vendor_name = $1,
                contact_person = $2,
                email = $3,
                phone_number = $4,
                whatsapp_number = $5,
                address = $6,
                city = $7,
                state_province = $8,
                country = $9,
                postal_code = $10,
                notes = $11,
                product_type = $12
            WHERE
                id = $13
            RETURNING *;`;

    try {
      const updatedVendor = (
        await queryDB(updateQuery, [
          value.vendor_name,
          value.contact_person || null,
          value.email || null,
          value.phone_number || null,
          value.whatsapp_number || null,
          value.address || null,
          value.city || null,
          value.state_province || null,
          value.country || null,
          value.postal_code || null,
          value.notes || null,
          value.product_type,
          value.vendor_id,
        ])
      ).rows[0];

      if (updatedVendor) {
        res.status(200).json({
          success: true,
          message: "Vendor updated successfully",
          data: updatedVendor,
        });
      } else {
        res.status(200).json({
          success: false,
          message: "Problem in updating vendor",
        });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Updating error", error: error });
    }
  }),

  deleteVendor: asyncHandler(async (req, res, next) => {
    const schema = Joi.object({
      vendor_id: Joi.number().integer().required(),
    });

    const { error, value } = schema.validate(req.query);

    if (error) {
      console.log(error.details);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: error.details,
      });
    }

    const deleteQuery = `
            DELETE FROM vendors
            WHERE id = $1
            RETURNING *;`;

    try {
      const deletedVendor = (await queryDB(deleteQuery, [value.vendor_id]))
        .rows[0];

      if (deletedVendor) {
        res.status(200).json({
          success: true,
          message: "Vendor deleted successfully",
          data: deletedVendor,
        });
      } else {
        res.status(200).json({
          success: false,
          message: "Problem in deleting vendor",
        });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Deleting error", error: error });
    }
  }),

  getAllVendors: asyncHandler(async (req, res, next) => {

    const market_id = req.market.market_id;

    const schema = Joi.object({
      market_id: Joi.number().integer().required(),
    });

    const body = {
      
      market_id
    }

    const { error, value } = schema.validate(body);

    if (error) {
      console.log(error.details);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: error.details,
      });
    }

    const getAllVendorsQuery = `
            SELECT * FROM vendors WHERE market_id = $1;`;

    try {
      const allVendors = (
        await queryDB(getAllVendorsQuery, [value.market_id])
      ).rows;

      if (allVendors) {
        res.status(200).json({
          success: true,
          message: "Request successful",
          data: allVendors,
        });
      } else {
        res.status(200).json({
          success: false,
          message: "Problem in getting vendors",
          data: allVendors,
        });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Fetching error", error: error });
    }
  }),

  getVendorById: asyncHandler(async (req, res, next) => {
    
    const vendor_id = req.params.vendorId; // Assuming the vendor ID is passed as a route parameter

    const schema = Joi.object({
        
        vendor_id: Joi.number().integer().required()
    });

    const body = {
      vendor_id
       
    }

    const { error, value } = schema.validate(body);

    if (error) {
        console.log(error.details);
        return res.status(400).json({
            success: false,
            message: "Validation error",
            error: error.details,
        });
    }

    const getVendorByIdQuery = `SELECT * FROM vendors WHERE id = $1;`;

    try {
        const vendor = (
            await queryDB(getVendorByIdQuery, [value.vendor_id])
        ).rows[0];

        if (vendor) {
            res.status(200).json({
                success: true,
                message: "Request successful",
                data: vendor,
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Vendor not found",
                data: null,
            });
        }
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: "Fetching error", error: error });
    }
  }),

  getallVendorSummary: asyncHandler(async (req, res, next) => {
    // BODY VALIDATION
    const market_id = req.market.market_id;
    const schema = Joi.object({
      market_id: Joi.number().integer().required(),
      filters: Joi.object().required(),
      nextCursor: Joi.number().integer().allow(null), // Cursor for pagination
      previousCursor: Joi.number().integer().allow(null), // Cursor for pagination
      limit: Joi.number().integer().default(10) // Page size
    });
  

    let body = {
      ...req.body,
      market_id
    };

    const { error, value } = schema.validate(body);

    // HANDLE VALIDATION ERROR

    if (error) {
      console.log(error.details);
      return res.status(200).json({
        success: false,
        message: "Validation error",
        error: error.details,
      });
    }

    const { previousCursor, nextCursor } = value
    // PROCEEDING TOWARDS GETTING ALL ORDERS ---------

    const VendorSummaryFilteredQry = `
   SELECT
   v.id AS id,
   v.vendor_name,
   v.contact_person, 
   v.phone_number,
   v.whatsapp_number,
   COALESCE(SUM(vb.bill_amount), 0) AS total_bill,
   COALESCE(SUM(vp.amount), 0) AS total_paid,
   COALESCE(SUM(vb.bill_amount), 0) - COALESCE(SUM(vp.amount), 0) AS outstanding,
   CASE
       WHEN COALESCE(SUM(vb.bill_amount), 0) - COALESCE(SUM(vp.amount), 0) <= 0 THEN 'paid'
       ELSE 'payment pending'
   END AS payment_status
FROM
   public.vendors v
   LEFT JOIN public.vendor_bills vb ON v.id = vb.vendor_id
   LEFT JOIN public.vendor_payments vp ON v.id = vp.vendor_id
WHERE
   v.market_id = $1
   AND ($2::text IS NULL OR v.vendor_name ILIKE '%' || $2::text || '%')
   AND ($3::text IS NULL OR v.contact_person ILIKE '%' || $3::text || '%')
   AND ($4::text IS NULL OR v.phone_number LIKE '%' || $4::text || '%')
   AND ($5::text IS NULL OR v.whatsapp_number LIKE '%' || $5::text || '%')
GROUP BY
   v.id,
   v.vendor_name,
   v.contact_person,
   v.phone_number,
   v.whatsapp_number
HAVING
   ($6::text IS NULL OR (
       CASE
           WHEN COALESCE(SUM(vb.bill_amount), 0) - COALESCE(SUM(vp.amount), 0) <= 0 THEN 'paid'
           ELSE 'payment pending'
       END = $6::text
   ))
   AND ($7::numeric IS NULL OR COALESCE(SUM(vb.bill_amount), 0) >= $7::numeric)
   AND ($8::numeric IS NULL OR COALESCE(SUM(vb.bill_amount), 0) <= $8::numeric)
   AND ($9::numeric IS NULL OR COALESCE(SUM(vp.amount), 0) >= $9::numeric)
   AND ($10::numeric IS NULL OR COALESCE(SUM(vp.amount), 0) <= $10::numeric)
   AND ($11::numeric IS NULL OR (COALESCE(SUM(vb.bill_amount), 0) - COALESCE(SUM(vp.amount), 0)) >= $11::numeric)
   AND ($12::numeric IS NULL OR (COALESCE(SUM(vb.bill_amount), 0) - COALESCE(SUM(vp.amount), 0)) <= $12::numeric)
   ${nextCursor ? `AND id > ${nextCursor}` : ''}
   ${previousCursor ? `AND id < ${previousCursor}` : ''}
ORDER BY
   v.id ASC
LIMIT $13;`


    try {

  
      const { filters, limit } = value;

      const queryParams = [
        value.market_id,
        filters.vendor_name || null,
        filters.contact_person || null,
        filters.phone_number || null,
        filters.whatsapp_number || null,
        filters.payment_status || null,
        filters.total_bill.minValue || null,
        filters.total_bill.maxValue || null,
        filters.total_paid.minValue || null,
        filters.total_paid.maxValue || null,
        filters.outstanding.minValue || null,
        filters.outstanding.maxValue || null,
        limit
      ]

      const allVendorInfo = (
        await queryDB(VendorSummaryFilteredQry, queryParams)
      ).rows;

      console.log(allVendorInfo)

      if (allVendorInfo) {

        const nextCursor = allVendorInfo[allVendorInfo.length - 1].id;
        const previousCursor = allVendorInfo[0].id;

        res.status(200).json({
          success: true,
          message: "request successfully",
          data: allVendorInfo,
          nextCursor: allVendorInfo.length === limit ? nextCursor : null, // Indicate if there are more results
          previousCursor: allVendorInfo.length === limit ? previousCursor : null, // Indicate if there are previous results
        });

      } else {

        res.status(200).json({
          success: false,
          message: "problem in getting Service",
          data: allVendorInfo,
          nextCursor: null, 
          previousCursor: null
        });

      }
      
    } catch (error) {
      return res
        .status(200)
        .json({ success: false, message: "updating error", error: error });
    }
  }),






  // add products per vendor function

  addProductsPerVendor: asyncHandler(async (req, res, next) => {
    const schema = Joi.object({
      vendor_id: Joi.number().integer().required(),
      products: Joi.array()
        .items(
          Joi.object({
            product_id: Joi.number().integer().required(),
          })
        )
        .required(),
      market_id: Joi.number().integer().required(),
    });

    const { error, value } = schema.validate(value);

    if (error) {
      console.log(error.details);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: error.details,
      });
    }

    const { vendor_id, products, market_id } = value;

    try {
      // Iterate over each product and insert into vendor_product table
      const insertProductPromises = products.map(async (product) => {
        const { product_id } = product;
        const cost_per_unit = "0"; // Default cost_per_unit value

        const insertQuery = `
                    INSERT INTO vendor_product (vendor_id, product_id, cost_per_unit, market_id)
                    VALUES ($1, $2, $3, $4)
                    RETURNING *;`;

        const result = queryDB(insertQuery, [
          vendor_id,
          product_id,
          cost_per_unit,
          market_id,
        ]);
        return result;
      });

      // Execute all insert queries concurrently
      await Promise.all(insertProductPromises);
      const getQuery = `SELECT * FROM vendor_product WHERE market_id = $1 and vendor_id=$2;`;

      const insertedProducts = await queryDB(getQuery, [market_id, vendor_id]);

      res.status(200).json({
        success: true,
        message: "Products added per vendor successfully",
        data: insertedProducts,
      });
    } catch (error) {
      console.error("Error adding products per vendor:", error);

      res.status(500).json({
        success: false,
        message: "Error adding products per vendor",
        error: error.message,
      });
    }
  })

};

export { vendorApi };
