
import { queryDB } from "../../db.mjs";
import Joi from "joi";
import dotenv from "dotenv";
import { asyncHandler } from "../../middleware/asynchandler.mjs";

dotenv.config();

const customerApi = {


 addCustomer : asyncHandler(async (req, res, next) => {
  // BODY VALIDATION

  const market_id = req.market.market_id;
  

  const schema = Joi.object({
    name: Joi.string().required(),
    mobile_number: Joi.string().regex(/^\d{10}$/).required(),
    whatsapp_number: Joi.string().regex(/^\d{10}$/),
    email_address: Joi.string().email(),
    company_name: Joi.string(),
    address: Joi.string(),
    note: Joi.string(),
    gstin: Joi.string().allow('').allow(null),
    pan: Joi.string().allow('').allow(null),
    adhaar_number: Joi.string().allow('').allow(null),
    market_id: Joi.number().integer().required()
    
});
 
  let body = {
    ...req.body,
      market_id
  };

  const { error, value } = schema.validate(body);

  // HANDLE VALIDATION ERROR

  if (error) {
    console.log(error.details);
    return res
      .status(200)
      .json({
        success: false,
        message: "Validation error",
        error: error.details,
      });
  }

  // PROCEEDING TOWARDS ADDING CUSTOMER ---------
  let addcutomerqry = `INSERT INTO customerinfo (name, mobile_number, whatsapp_number, email_address, company_name, address, gstin, pan, adhaar_number, note, market_id)
  VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) returning *;
  `
  try {
    const addedcustomer = (await queryDB(addcutomerqry, [body.name, body.mobile_number, body.whatsapp_number, body.email_address, body.company_name, body.address, body.gstin, body.pan, body.adhaar_number, body.note, body.market_id])).rows[0]
    if(addedcustomer){
        res
        .status(200)
        .json({
          success: true,
          message: "Customer added successfully",
          data: addedcustomer,
        });
    }else{
        res
        .status(200)
        .json({
          success: false,
          message: "problem in creating new customer",
          data: addedcustomer,
        });
    }
  } catch (error) {
    return res
      .status(200)
      .json({ success: false, message: "creating error", error: error });
  }
  }),

 updateCustomer : asyncHandler(async (req, res, next) => {
    // BODY VALIDATION
  
    const schema = Joi.object({
      customerid:  Joi.number().integer().required(),
      name: Joi.string().required(),
      mobile_number: Joi.string().regex(/^\d{10}$/).required(),
      whatsapp_number: Joi.string().regex(/^\d{10}$/),
      email_address: Joi.string().email(),
      company_name: Joi.string(),
      address: Joi.string(),
      gstin: Joi.string().allow('').allow(null),
      pan: Joi.string().allow('').allow(null),
      adhaar_number: Joi.string().allow('').allow(null),
      note: Joi.string(),
   
  });
   
    let body = req.body;
    const { error, value } = schema.validate(body);
  
    // HANDLE VALIDATION ERROR
  
    if (error) {
      console.log(error.details);
      return res
        .status(200)
        .json({
          success: false,
          message: "Validation error",
          error: error.details,
        });
    }
  
    // PROCEEDING TOWARDS UPDATING CUSTOMER ---------
    let updateCutomerQry = `UPDATE customerinfo
    SET
      name = $1,
      mobile_number = $2,
      whatsapp_number = $3,
      email_address = $4,
      company_name = $5,
      address = $6,
      gstin = $7,
      pan = $8,
      adhaar_number = $9,
      note = $10
    WHERE
      id = $11
      returning *;
    `
    try {
      const updatedcustomer = (await queryDB(updateCutomerQry, [body.name, body.mobile_number, body.whatsapp_number, body.email_address, body.company_name, body.address, body.gstin, body.pan, body.adhaar_number,  body.note, body.customerid])).rows[0]
      if(updatedcustomer){
          res
          .status(200)
          .json({
            success: true,
            message: "Customer updated successfully",
            data: updatedcustomer,
          });
      }else{
          res
          .status(200)
          .json({
            success: false,
            message: "problem in updating customer",
            data: updatedcustomer,
          });
      }
    } catch (error) {
      return res
        .status(200)
        .json({ success: false, message: "updating error", error: error });
    }
  }),
  
 deleteCustomer : asyncHandler(async (req, res, next) => {
    // BODY VALIDATION
    let customerid = req.query.customerid;
    const schema = Joi.object({
      customerid:  Joi.number().integer().required(),
    });
   
    let body = {
        customerid
    };
    const { error, value } = schema.validate(body);
  
    // HANDLE VALIDATION ERROR
  
    if (error) {
      console.log(error.details);
      return res
        .status(200)
        .json({
          success: false,
          message: "Validation error",
          error: error.details,
        });
    }
  
    // PROCEEDING TOWARDS UPDATING CUSTOMER ---------
    let deleteCutomerQry = `DELETE FROM customerinfo WHERE id = $1 returning *;`
    try {
      const deletedcustomer = (await queryDB(deleteCutomerQry, [body.customerid])).rows[0]
      if(deletedcustomer){
          res
          .status(200)
          .json({
            success: true,
            message: "Customer deleted successfully",
            data: deletedcustomer,
          });
      }else{
          res
          .status(200)
          .json({
            success: false,
            message: "problem in deleting customer",
            data: deletedcustomer,
          });
      }
    } catch (error) {
      return res
        .status(200)
        .json({ success: false, message: "updating error", error: error });
    }
  }),  

 getAllCustomer : asyncHandler(async (req, res, next) => {
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
        market_id,
        ...req.body
    };

    const { error, value } = schema.validate(body);

    // HANDLE VALIDATION ERROR
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: error.details
      });
    }

    const {previousCursor, nextCursor} = value
  
    // QUERY WITH PAGINATION
    const getCutomerQry = `
SELECT *
FROM customerinfo
WHERE market_id = $1
  AND ($2::text IS NULL OR name LIKE '%' || $2::text || '%')
  AND ($3::text IS NULL OR mobile_number LIKE '%' || $3::text || '%')
  AND ($4::text IS NULL OR whatsapp_number LIKE '%' || $4::text || '%')
  AND ($5::text IS NULL OR email_address LIKE '%' || $5::text || '%')
  AND ($6::text IS NULL OR address LIKE '%' || $6::text || '%')
  AND ($7::text IS NULL OR gstin LIKE '%' || $7::text || '%')
  AND ($8::text IS NULL OR pan LIKE '%' || $8::text || '%')
  AND ($9::text IS NULL OR adhaar_number LIKE '%' || $9::text || '%')
  AND ($10::text IS NULL OR note LIKE '%' || $10::text || '%')
  ${nextCursor ? `AND id > ${nextCursor}` : ''}
  ${previousCursor ? `AND id < ${previousCursor}` : ''}
ORDER BY id ASC
LIMIT $11;
`

// :
// `
// SELECT *
// FROM customerinfo
// WHERE market_id = $1
//   AND ($2::text IS NULL OR name LIKE '%' || $2::text || '%')
//   AND ($3::text IS NULL OR mobile_number LIKE '%' || $3::text || '%')
//   AND ($4::text IS NULL OR whatsapp_number LIKE '%' || $4::text || '%')
//   AND ($5::text IS NULL OR email_address LIKE '%' || $5::text || '%')
//   AND ($6::text IS NULL OR address LIKE '%' || $6::text || '%')
//   AND ($7::text IS NULL OR gstin LIKE '%' || $7::text || '%')
//   AND ($8::text IS NULL OR pan LIKE '%' || $8::text || '%')
//   AND ($9::text IS NULL OR adhaar_number LIKE '%' || $9::text || '%')
//   AND ($10::text IS NULL OR note LIKE '%' || $10::text || '%')
//   ORDER BY id ASC
//   LIMIT $11;
// `;

    try {
      const { filters, limit } = value;

      const queryParams = [
        value.market_id,
        filters.name || null,
        filters.mobile_number || null,
        filters.whatsapp_number || null,
        filters.email_address || null,
        filters.address || null,
        filters.gstin || null,
        filters.pan || null,
        filters.adhaar_number || null,
        filters.note || null,
        limit
      ]
      
      // :[
      //   value.market_id,
      //   filters.name || null,
      //   filters.mobile_number || null,
      //   filters.whatsapp_number || null,
      //   filters.email_address || null,
      //   filters.address || null,
      //   filters.gstin || null,
      //   filters.pan || null,
      //   filters.adhaar_number || null,
      //   filters.note || null,
      //   limit
      // ];

      const allcustomers = (await queryDB(getCutomerQry, queryParams)).rows;

      if (allcustomers.length > 0) {

        const nextCursor = allcustomers[allcustomers.length - 1].id;
        const previousCursor = allcustomers[0].id;
      
        res.status(200).json({
          success: true,
          message: "Request successful",
          data: allcustomers,
          nextCursor: allcustomers.length === limit ? nextCursor : null, // Indicate if there are more results
          previousCursor: allcustomers.length === limit ? previousCursor : null, // Indicate if there are previous results
        });

      } else {

        res.status(200).json({
          success: true,
          message: "No more customers",
          data: [],
          nextCursor: null,
          previousCursor: null,
        });
        
      }

    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Fetching error",
        error: error.message
      });
    }
 }),

  getCustomerbyid : asyncHandler(async (req, res, next) => {
    // BODY VALIDATION
    const market_id = req.market.market_id;
    const customer_id = req.params.customerid;

    const schema = Joi.object({
      market_id:  Joi.number().integer().required(),
      customer_id: Joi.number().integer().required()
    });
   
    let body = {
        market_id,
        customer_id
    };

    const { error, value } = schema.validate(body);
  
    // HANDLE VALIDATION ERROR
  
    if (error) {
      console.log(error.details);
      return res
        .status(200)
        .json({
          success: false,
          message: "Validation error",
          error: error.details
        });
    }
  
    // PROCEEDING TOWARDS UPDATING CUSTOMER ---------
    let getCutomerQry = `select * FROM customerinfo WHERE market_id = $1 and id = $2;`

    try {
      const customer = (await queryDB(getCutomerQry, [value.market_id, value.customer_id])).rows[0]
      if(customer){

          res
          .status(200)
          .json({
            success: true,
            message: "request successfully",
            data: customer
          });

      }else{

          res
          .status(200)
          .json({
            success: false,
            message: "problem in getting customer",
            data: customer
          });

      }
    } catch (error) {
      return res
        .status(200)
        .json({ success: false, message: "updating error", error: error });
    }
  }),


  
}






export { customerApi };