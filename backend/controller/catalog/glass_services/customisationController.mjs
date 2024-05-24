import { asyncHandler } from "../../../middleware/asynchandler.mjs";
import { queryDB } from "../../../db.mjs";
import Joi from "joi";

const glassCustomizationServiceApi = {

    addGlassCustomizationService: asyncHandler(async (req, res, next) => {

       
        const market_id = req.market.market_id;
        

        // BODY VALIDATION
        const schema = Joi.object({
            service_name: Joi.string().required(),
            description: Joi.string().allow(null),
            rate_per_sqft: Joi.number().required(),
            market_id: Joi.number().integer().required(),
           
        });

        let body = {
            ...req.body,
           
            market_id
           
          }

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

        // PROCEEDING TOWARDS ADDING GLASS CUSTOMIZATION SERVICE
        const addServiceQuery = `
            INSERT INTO glass_customization_service (service_name, description, rate_per_sqft, market_id)
            VALUES ($1, $2, $3, $4)
            RETURNING *;`;

        try {

            const addedService = (await queryDB(addServiceQuery, [value.service_name, value.description, value.rate_per_sqft, value.market_id])).rows[0];
            if (addedService) {
                res.status(200).json({
                    success: true,
                    message: "Glass customization service added successfully",
                    data: addedService,
                });
            } else {
                res.status(200).json({
                    success: false,
                    message: "Problem in creating new glass customization service",
                    data: addedService,
                });
            }
        } catch (error) {
            return res.status(200).json({ success: false, message: "Creating error", error: error });
        }

    }),

    updateGlassCustomizationService: asyncHandler(async (req, res, next) => {

        
        // BODY VALIDATION
        const schema = Joi.object({
            service_id: Joi.number().integer().required(),
            service_name: Joi.string().required(),
            description: Joi.string().allow(null),
            rate_per_sqft: Joi.number().required(),
           
        });

        let body = {
            ...req.body,
             
             }

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

        // PROCEEDING TOWARDS UPDATING GLASS CUSTOMIZATION SERVICE
        const updateServiceQuery = `
            UPDATE glass_customization_service
            SET service_name = $1, description = $2, rate_per_sqft = $3
            WHERE id = $4
            RETURNING *;`;

        try {
            const updatedService = (await queryDB(updateServiceQuery, [value.service_name, value.description, value.rate_per_sqft, value.service_id])).rows[0];
            if (updatedService) {
                res.status(200).json({
                    success: true,
                    message: "Glass customization service updated successfully",
                    data: updatedService,
                });
            } else {
                res.status(200).json({
                    success: false,
                    message: "Problem in updating glass customization service",
                    data: updatedService,
                });
            }
        } catch (error) {
            return res.status(200).json({ success: false, message: "Updating error", error: error });
        }
    }),

    deleteGlassCustomizationService: asyncHandler(async (req, res, next) => {

     
        // BODY VALIDATION
        const schema = Joi.object({
            service_id: Joi.number().integer().required()
          
        });

        let body = {
            ...req.query,
          
          }

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

        // PROCEEDING TOWARDS DELETING GLASS CUSTOMIZATION SERVICE
        const deleteServiceQuery = `
            DELETE FROM glass_customization_service WHERE id = $1
            RETURNING *;`;

        try {
            const deletedService = (await queryDB(deleteServiceQuery, [value.service_id])).rows[0];
            if (deletedService) {
                res.status(200).json({
                    success: true,
                    message: "Glass customization service deleted successfully",
                    data: deletedService,
                });
            } else {
                res.status(200).json({
                    success: false,
                    message: "Problem in deleting glass customization service",
                    data: deletedService,
                });
            }
        } catch (error) {
            return res.status(200).json({ success: false, message: "Deleting error", error: error });
        }
    }),

    getAllGlassCustomizationServices: asyncHandler(async (req, res, next) => {

      
        const market_id = req.market.market_id;

        
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
          return res
            .status(200)
            .json({
              success: false,
              message: "Validation error",
              error: error.details,
            });
        }
        // PROCEEDING TOWARDS FETCHING GLASS CUSTOMIZATION SERVICES
        const getAllServicesQuery = `SELECT * FROM glass_customization_service WHERE market_id = $1;`;

        try {
            const allServices = (await queryDB(getAllServicesQuery,[value.market_id])).rows;
            if (allServices) {
                res.status(200).json({
                    success: true,
                    message: "Request successful",
                    data: allServices
                });
            } else {
                res.status(200).json({
                    success: false,
                    message: "Problem in getting glass customization services",
                    data: allServices
                });
            }
        } catch (error) {
            return res.status(200).json({ success: false, message: "Fetching error", error: error });
        }
    })
};

export { glassCustomizationServiceApi };
