
import { queryDB } from "../../../db.mjs";
import Joi from "joi";
import { asyncHandler } from "../../../middleware/asynchandler.mjs";

const glassProductApi = {
  addGlassProduct: asyncHandler(async (req, res, next) => {  
    const market_id = req.market.market_id;                                                          
    // BODY VALIDATION
    const schema = Joi.object({

      market_id: Joi.number().integer().required(),
      glass_type_id: Joi.number().integer().required(),
      thickness_id: Joi.number().integer().required(),
      company_id: Joi.number().integer().required(),
      color_id: Joi.number().integer().required(),
      selling_rate_per_sqft: Joi.number().required(), 
      

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



    // Define the function to insert a single product
 

      let addProductQuery = `
                INSERT INTO glass_products (glass_type_id, thickness_id, company_id, color_id,  selling_rate_per_sqft,  market_id)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *;`;

    
  
    try {
      const addedProduct = await queryDB(addProductQuery, [
        value.glass_type_id,
        value.thickness_id,
        value.company_id,
        value.color_id,
 
        value.selling_rate_per_sqft,
   
        value.market_id
      ]);

      if(addedProduct){
        res.status(200).json({
          success: true,
          message: "glass product added successfully",
          data: addedProduct, // Filter out any undefined values
        });
      }else{
        res.status(200).json({
          success: false,
          message: "problem in adding glass product ",
          data: [], // Filter out any undefined values
        });
      }

     
    } catch (error) {
      console.error("Error adding glass_products:", error);
      res.status(500).json({
        success: false,
        message: "Error adding glass_products:",
        error: error.message,
      });
    }
  }),

  updateGlassProduct: asyncHandler(async (req, res, next) => {
    // BODY VALIDATION
    const schema = Joi.object({
      productid: Joi.number().integer().required(),
      glass_type_id: Joi.number().integer().required(),
      thickness_id: Joi.number().integer().required(),
      company_id: Joi.number().integer().required(),
      color_id: Joi.number().integer().required(),
      selling_rate_per_sqft: Joi.number().required(), 
     
    });

    let body = req.body;
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

    // PROCEEDING TOWARDS UPDATING PRODUCT
    let updateProductQuery = `
            UPDATE glass_products
            SET
        
                glass_type_id = $1,
                thickness_id = $2,
                company_id = $3,
                color_id = $4,
                selling_rate_per_sqft = $5
            WHERE
                id = $6
            RETURNING *;`;

    try {
      const updatedProduct = (
        await queryDB(updateProductQuery, [
      
          body.glass_type_id,
          body.thickness_id,
          body.company_id,
          body.color_id,
          body.selling_rate_per_sqft,
          body.productid
        ])
      ).rows[0];
      if (updatedProduct) {
        res.status(200).json({
          success: true,
          message: "Product updated successfully",
          data: updatedProduct,
        });
      } else {
        res.status(200).json({
          success: false,
          message: "Problem in updating product",
          data: updatedProduct,
        });
      }
    } catch (error) {
      return res
        .status(200)
        .json({ success: false, message: "Updating error", error: error });
    }
  }),

  deleteGlassProduct: asyncHandler(async (req, res, next) => {
    // BODY VALIDATION
    const schema = Joi.object({
      productid: Joi.number().integer().required()
    
    });

    let body = req.query;
    const { error, value } = schema.validate(body);

    // HANDLE VALIDATION ERROR
    if (error) {
      console.log(error.details);
      return res.status(200).json({
        success: false,
        message: "Validation error",
        error: error.details
      });
    }

    // PROCEEDING TOWARDS DELETING PRODUCT
    let deleteProductQuery = `DELETE FROM glass_products WHERE id = $1 RETURNING *;`;
    try {
      const deletedProduct = (
        await queryDB(deleteProductQuery, [value.productid])
      ).rows[0];
      if (deletedProduct) {
        res.status(200).json({
          success: true,
          message: "Product deleted successfully",
          data: deletedProduct,
        });
      } else {
        res.status(200).json({
          success: false,
          message: "Problem in deleting product",
          data: deletedProduct,
        });
      }
    } catch (error) {
      return res
        .status(200)
        .json({ success: false, message: "Deleting error", error: error });
    }
  }),

  getAllGlassProducts: asyncHandler(async (req, res, next) => {
    const market_id = req.market.market_id;   
    // BODY VALIDATION
    const schema = Joi.object({
      market_id: Joi.number().integer().required(),
    });

    let body = {
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

    // PROCEEDING TOWARDS GETTING glass_products
    let getProductQuery = `SELECT 
    gp.id AS id,
    gt.glass_type AS glass_type,
    gth.thickness AS thickness,
    gc.glass_company AS glass_company,
    glc.color AS color,
    gp.selling_rate_per_sqft AS selling_rate_per_sqft,
    gp.market_id AS market_id
FROM 
    glass_products gp
JOIN 
    glass_thickness gth ON gp.thickness_id = gth.id
JOIN 
    glass_company gc ON gp.company_id = gc.id
JOIN 
    glass_type gt ON gp.glass_type_id = gt.id
JOIN 
    glass_colors glc ON gp.color_id = glc.id
Where 
    gp.market_id = $1`;

    try {
      const allProducts = (await queryDB(getProductQuery, [value.market_id]))
        .rows;
      if (allProducts) {
        res.status(200).json({
          success: true,
          message: "Request successful",
          data: allProducts,
        });
      } else {
        res.status(200).json({
          success: false,
          message: "Problem in getting glass_products",
          data: allProducts,
        });
      }
    } catch (error) {
      return res
        .status(200)
        .json({ success: false, message: "Getting error", error: error });
    }
  }),
};

export { glassProductApi };
