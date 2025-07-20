// Import required modules
import { asyncHandler } from "../../middleware/asynchandler.mjs";
import { queryDB } from "../../db.mjs";
import Joi from "joi";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const marketplaceApi = {
    // Add a new marketplace
    addMarketplace: asyncHandler(async (req, res, next) => { 
        const companyid = req.company.companyid;
        console.log("company-->",req.company)
        // Validate request body
        const schema = Joi.object({
            name: Joi.string().required(),
            image_src: Joi.string().required(),
           
          
            
        });

      

        const { error, value } = schema.validate(req.body);

        if (error) {
            return res.status(400).json({ success: false, message: "Validation error", error: error.details });
        }

        // Proceed to add the marketplace
        const { name, image_src } = value;

        const addMarketplaceQuery = `
            INSERT INTO marketplace (name, image_src, company_id)
            VALUES ($1, $2, $3)
            RETURNING *;`;

        try {
            const newMarketplace = (await queryDB(addMarketplaceQuery, [name, image_src, companyid])).rows[0];
            res.status(201).json({ success: true, message: "Marketplace added successfully", data: newMarketplace });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Error adding marketplace", error: error });
        }
    }),

    // Update an existing marketplace
    updateMarketplace: asyncHandler(async (req, res, next) => {
        // Validate request body
        const companyid = req.company.companyid;
        const schema = Joi.object({
            id: Joi.number().integer().required(),
            name: Joi.string(),
            companyid: Joi.number().integer(),
            image_src: Joi.string().required()
        });
        const { error, value } = schema.validate({...req.body, companyid });

        if (error) {
            return res.status(400).json({ success: false, message: "Validation error", error: error.details });
        }

        // Proceed to update the marketplace
        const { id, name, image_src } = value;
        const updateMarketplaceQuery = `
  UPDATE marketplace
  SET name = COALESCE($1, name),
      image_src = COALESCE($2, image_src)
  WHERE id = $3
  RETURNING *;
`;

        try {
            const updatedMarketplace = (await queryDB(updateMarketplaceQuery, [name, image_src, id])).rows[0];
            if (!updatedMarketplace) {
                return res.status(404).json({ success: false, message: "Marketplace not found" });
            }
            res.status(200).json({ success: true, message: "Marketplace updated successfully", data: updatedMarketplace });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Error updating marketplace", error: error });
        }

    }),

    // Delete a marketplace
    deleteMarketplace: asyncHandler(async (req, res, next) => {
        const { market_id } = req.query;
        const deleteMarketplaceQuery = `
            DELETE FROM marketplace
            WHERE id = $1
            RETURNING *;`;
        try {
            const deletedMarketplace = (await queryDB(deleteMarketplaceQuery, [market_id])).rows[0];
            if (!deletedMarketplace) {
                return res.status(404).json({ success: false, message: "Marketplace not found" });
            }
            res.status(200).json({ success: true, message: "Marketplace deleted successfully", data: deletedMarketplace });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Error deleting marketplace", error: error });
        }
    }),

    // Get all marketplaces
    getAllMarketplaces: asyncHandler(async (req, res, next) => {
        let companyid = req.company.companyid;
        console.log("companyid -->", companyid)
        // Validate request body
        const schema = Joi.object({
          
            companyid: Joi.number().integer().required(),
            
        });
        
        let body = {
           
          companyid
        }

        const { error, value } = schema.validate(body);

        

        if (error) {
            return res.status(400).json({ success: false, message: "Validation error", error: error.details });
        }

        const getAllMarketplacesQuery = ` SELECT * FROM marketplace where company_id = $1;`;

        try {
            const allMarketplaces = (await queryDB(getAllMarketplacesQuery,[companyid])).rows;
            res.status(200).json({ success: true, message: "Marketplaces retrieved successfully", data: allMarketplaces });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Error retrieving marketplaces", error: error });
        }

    }),
  
    selectMarketplace: asyncHandler(async (req, res, next) => {
        
        const companyid = req.company.companyid;
        // Validate request body
        const schema = Joi.object({
           id: Joi.number().integer(),
           name: Joi.string().required(),
           image_src: Joi.string().required(),
           
        });

       let body = {
        ...req.body,
        }
        
        const { error, value } = schema.validate(body);
      
        const { id, name, image_src } = value;
      
        let marketInfo = {
           id,
           name,
           image_src
        }
      
        if (error) {
            return res.status(400).json({ success: false, message: "Validation error", error: error.details });
        }
      
        const getAllMarketplacesQuery = `SELECT * FROM marketplace where company_id = $1 and id = $2 and name = $3;`;
      
        try {
        const Marketplace = (await queryDB(getAllMarketplacesQuery,[companyid, id, name])).rows[0];
        
        if(!Marketplace){
            return res.status(500).json({ success: false, message: "No such market place", error: error });
        }
      
        // Create a JWT with user information and the secret key
        const token = jwt.sign(marketInfo, process.env.JWT_MARKET_SECRET, {
        expiresIn: "2h",
         });
      
           return  res.status(200).json({ success: true, message: "Marketplace found", data: {token, marketplace: name, image_src} });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Error retrieving marketplaces", error: error });
        }
      
    })
  

};

export { marketplaceApi };
