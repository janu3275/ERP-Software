
import { queryDB } from "../../../db.mjs";
import Joi from "joi";
import { asyncHandler } from "../../../middleware/asynchandler.mjs";

const glassInventoryApi = {
  addGlassInventory: asyncHandler(async (req, res, next) => {  
    const market_id = req.market.market_id;                                                          
    // BODY VALIDATION
    const schema = Joi.object({

      market_id: Joi.number().integer().required(),
      glass_product_id: Joi.number().integer().required(),
      size_id: Joi.number().integer().required(),
      stock:Joi.number().required()

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
        error: error.details
      });
    }



    // Define the function to insert a single Inventory
 

      let addInventoryQuery = `
                INSERT INTO glass_Inventory (glass_product_id, size_id, stock, market_id)
                VALUES ($1, $2, $3, $4)
                RETURNING *;`;

    
  
    try {
      const addedInventory = await queryDB(addInventoryQuery, [
        value.glass_product_id,
        value.size_id,
        value.stock,
        value.market_id
      ]);

      if(addedInventory){
        res.status(200).json({
          success: true,
          message: "glass Inventory added successfully",
          data: addedInventory, // Filter out any undefined values
        });
      }else{
        res.status(200).json({
          success: false,
          message: "problem in adding glass Inventory ",
          data: [], // Filter out any undefined values
        });
      }

     
    } catch (error) {
      console.error("Error adding glass_Inventory:", error);
      res.status(500).json({
        success: false,
        message: "Error adding glass_Inventory:",
        error: error.message,
      });
    }
  }),

  updateGlassInventory: asyncHandler(async (req, res, next) => {
    // BODY VALIDATION
    const schema = Joi.object({
      Inventoryid: Joi.number().integer().required(),
      glass_product_id: Joi.number().integer().required(),
      size_id: Joi.number().integer().required(),
      stock:Joi.number().required()
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

    // PROCEEDING TOWARDS UPDATING Inventory
    let updateInventoryQuery = `
            UPDATE glass_Inventory
            SET
                size_id = $1,
                glass_product_id=$2,
                stock = $3
            WHERE
                id = $4
            RETURNING *;`;

    try {
      const updatedInventory = (
        await queryDB(updateInventoryQuery, [
          value.size_id,
          value.glass_product_id,
          value.stock,
          value.Inventoryid
        ])
      ).rows[0];
      if (updatedInventory) {
        res.status(200).json({
          success: true,
          message: "Inventory updated successfully",
          data: updatedInventory,
        });
      } else {
        res.status(200).json({
          success: false,
          message: "Problem in updating Inventory",
          data: updatedInventory,
        });
      }
    } catch (error) {
      return res
        .status(200)
        .json({ success: false, message: "Updating error", error: error });
    }
  }),

  deleteGlassInventory: asyncHandler(async (req, res, next) => {
    // BODY VALIDATION
    const schema = Joi.object({
      Inventoryid: Joi.number().integer().required()
    
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

    // PROCEEDING TOWARDS DELETING Inventory
    let deleteInventoryQuery = `DELETE FROM glass_Inventory WHERE id = $1 RETURNING *;`;
    try {
      const deletedInventory = (
        await queryDB(deleteInventoryQuery, [value.Inventoryid])
      ).rows[0];
      if (deletedInventory) {
        res.status(200).json({
          success: true,
          message: "Inventory deleted successfully",
          data: deletedInventory,
        });
      } else {
        res.status(200).json({
          success: false,
          message: "Problem in deleting Inventory",
          data: deletedInventory,
        });
      }
    } catch (error) {
      return res
        .status(200)
        .json({ success: false, message: "Deleting error", error: error });
    }
  }),

  getAllGlassInventory: asyncHandler(async (req, res, next) => {
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

    // PROCEEDING TOWARDS GETTING glass_Inventory
    let getInventoryQuery = `SELECT 
    gi.id AS id,
    gi.size_id AS size_id,
    gs.length AS length,
    gs.width AS width,
    gt.glass_type AS glass_type,
    gth.thickness AS thickness,
    gc.color AS color,
    gco.glass_company AS glass_company,
    gp.id AS product_id,
    gp.selling_rate_per_sqft AS selling_rate_per_sqft,
    gi.stock AS stock
FROM 
    glass_Inventory gi
JOIN 
    glass_products gp ON gi.glass_product_id = gp.id
JOIN 
    glass_sizes gs ON gi.size_id = gs.id
JOIN 
    glass_type gt ON gp.glass_type_id = gt.id
JOIN 
    glass_thickness gth ON gp.thickness_id = gth.id
JOIN 
    glass_colors gc ON gp.color_id = gc.id
JOIN 
    glass_company gco ON gp.company_id = gco.id
Where 
    gi.market_id = $1;`;

    try {
      const allInventory = (await queryDB(getInventoryQuery, [value.market_id]))
        .rows;
      if (allInventory) {
        res.status(200).json({
          success: true,
          message: "Request successful",
          data: allInventory,
        });
      } else {
        res.status(200).json({
          success: false,
          message: "Problem in getting glass_Inventory",
          data: allInventory,
        });
      }
    } catch (error) {
      return res
        .status(200)
        .json({ success: false, message: "Getting error", error: error });
    }
  }),
};

export { glassInventoryApi };
