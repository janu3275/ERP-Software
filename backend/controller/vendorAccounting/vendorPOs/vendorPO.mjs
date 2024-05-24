import { asyncHandler } from "../../../middleware/asynchandler.mjs";
import { queryDB } from "../../../db.mjs";
import Joi from "joi";

const vendorPOApi = {
    
    getVendorPOById: asyncHandler(async (req, res, next) => {
        const poId = req.params.poId;
    
        const schema = Joi.object({
            poId: Joi.number().integer().required()
        });
    
        const { error, value } = schema.validate({ poId });
    
        if (error) {
            console.log(error.details);
            return res.status(400).json({
                success: false,
                message: "Validation error",
                error: error.details,
            });
        }
    
        const getPOQuery = `
        SELECT 
        po.id AS po_id,
        po.po_date,
        po.note,
        po.create_time,
        po.vendorId,
        ARRAY(
            SELECT 
                json_build_object(
                    'glass_inventory_id', item.glass_inventory_id,
                    'quantity', item.quantity
                )
            FROM 
                vendor_po_glsitems AS item
            WHERE 
                item.vendor_po_id = po.id
        ) AS gls_items
    FROM 
        vendor_po AS po
    WHERE 
        po.id = $1;
    `;
    
        try {
            const po = (
                await queryDB(getPOQuery, [value.poId])
            ).rows[0];
    
            if (po) {
                res.status(200).json({
                    success: true,
                    message: "Vendor PO retrieved successfully",
                    data: po,
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: "Vendor PO not found",
                    data: null,
                });
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error retrieving Vendor PO",
                error: error.message,
            });
        }
    }),

    addVendorPO: asyncHandler(async (req, res, next) => {
        const { vendorId, gls_items, note } = req.body;
    
        const schema = Joi.object({
           
            vendorId: Joi.number().integer().required(),
            note: Joi.string().allow('').required(),
            gls_items: Joi.array().items(
                Joi.object({
                    glass_inventory_id: Joi.number().integer().required(),
                    quantity: Joi.number().integer().required()
                })
            )
        });
    
        const { error, value } = schema.validate(req.body);
    
        if (error) {
            console.log(error.details);
            return res.status(400).json({
                success: false,
                message: "Validation error",
                error: error.details,
            });
        }
    
        const addPOQuery = `
            INSERT INTO vendor_po ( note,  vendor_id)
            VALUES ($1, $2)
            RETURNING *;`;
    
        const addPOItemsQuery = `
            INSERT INTO vendor_po_glsitems (vendor_po_id, glass_inventory_id, quantity)
            VALUES ($1, $2, $3);`;
    
        
        try {
            // await queryDB('BEGIN');

            const addedPO = (
                await queryDB(addPOQuery, [note, vendorId])
            ).rows[0];
    
            if (!addedPO) {
                await queryDB('ROLLBACK');
                return res.status(500).json({
                    success: false,
                    message: "Error adding Vendor PO",
                    data: null
                });
            }
           
            const insertPromises = gls_items.map(item => {
                return queryDB(addPOItemsQuery, [addedPO.id, item.glass_inventory_id, item.quantity]);
            });

            const insertedRows =  await Promise.all(insertPromises);
    
            // await queryDB('COMMIT');


    
            res.status(201).json({
                success: true,
                message: "Vendor PO added successfully",
                data: addedPO,
            });
        } catch (error) {
            // await queryDB('ROLLBACK');
            return res.status(500).json({
                success: false,
                message: "Error adding Vendor PO",
                error: error.message,
            });
        } 
    }),

    updateVendorPO: asyncHandler(async (req, res, next) => {
       
        const { gls_items, poId, note } = req.body;
    
        const schema = Joi.object({
            poId: Joi.number().integer().required(),
            note: Joi.string().allow('').required(),
            gls_items: Joi.array().items(Joi.object({
                glass_inventory_id: Joi.number().integer().required(),
                quantity: Joi.number().integer().required()
            }))
        });
    
        const { error, value } = schema.validate(req.body);
    
        if (error) {
            console.log(error.details);
            return res.status(400).json({
                success: false,
                message: "Validation error",
                error: error.details
            });
        }
    
        try {
           
            

            

             const updatePoQuery = `
            UPDATE vendor_po 
            SET note = $1
            WHERE id = $2
            RETURNING *;`;

            const updatedPo = (
                await queryDB(updatePoQuery, [note, poId])
            ).rows[0]?.id;
            // Delete existing items associated with the vendor PO
            const deleteItemsQuery = 'DELETE FROM vendor_po_glsitems WHERE vendor_po_id = $1';
            await queryDB(deleteItemsQuery, [poId]);
    
            // Insert updated items associated with the vendor PO
            const insertItemsQuery = `
                INSERT INTO vendor_po_glsitems (vendor_po_id, glass_inventory_id, quantity)
                VALUES ($1, $2, $3) returning *;`;
            console.log(gls_items, poId)
            // Array to hold promises for all insert operations
            const insertPromises = gls_items.map(item => {
                return queryDB(insertItemsQuery, [poId, item.glass_inventory_id, item.quantity]);
            });

            const insertedRows =  await Promise.all(insertPromises);

            

            
    
            res.status(200).json({
                success: true,
                message: "Vendor PO updated successfully",
                data: insertedRows,
            });

        } catch (error) {
            
            return res.status(500).json({
                success: false,
                message: "Error updating Vendor PO",
                error: error.message
            });
        }
    }),
    
    deleteVendorPO: asyncHandler(async (req, res, next) => {
        const schema = Joi.object({
            poId: Joi.number().integer().required(),
      
        });

        let body = {
            ...req.query
          
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
    
        const deletePOQuery = `
            DELETE FROM vendor_po
            WHERE id = $1
            RETURNING *;`;
    
        try {
            const deletedPO = (
                await queryDB(deletePOQuery, [value.poId])
            ).rows[0];
    
            if (deletedPO) {
                res.status(200).json({
                    success: true,
                    message: "Vendor PO deleted successfully",
                    data: deletedPO,
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: "Vendor PO not found or cannot be deleted",
                    data: null,
                });
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error deleting Vendor PO",
                error: error.message,
            });
        }
    }),

    getAllPoByVendorId : asyncHandler(async (req, res, next) => {
        const vendorId = req.params.vendorId;
    
        const schema = Joi.object({
            vendorId: Joi.number().integer().required(),
        });
    
        const { error, value } = schema.validate({ vendorId });
    
        if (error) {
            console.log(error.details);
            return res.status(400).json({
                success: false,
                message: "Validation error",
                error: error.details,
            });
        }
    
        const getAllPoQuery = `
        SELECT 
            po.id AS id,
            po.po_date,
            po.note,
            po.create_time,
            po.vendor_id,
            ARRAY(
                SELECT 
                    json_build_object(
                        'glass_inventory_id', item.glass_inventory_id,
                        'quantity', item.quantity
                    )
                FROM 
                    vendor_po_glsitems AS item
                WHERE 
                    item.vendor_po_id = po.id
            ) AS gls_items
        FROM 
            vendor_po AS po
        WHERE 
            po.vendor_id = $1;
    `;
    
    
        try {
            const poList = (
                await queryDB(getAllPoQuery, [value.vendorId])
            ).rows;
    
            if (poList) {
                res.status(200).json({
                    success: true,
                    message: "Purchase orders retrieved successfully",
                    data: poList,
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: "No purchase orders found",
                    data: [],
                });
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error retrieving purchase orders",
                error: error.message,
            });
        }
    })

};

const getfilteredPOqry = `
SELECT 
    po.id AS po_id,
    po.po_date,
    po.note,
    po.create_time,
    po.vendorId,
    ARRAY(
        SELECT 
            json_build_object(
                'glass_inventory_id', item.glass_inventory_id,
                'quantity', item.quantity
            )
        FROM 
            vendor_po_glsitems AS item
        WHERE 
            item.vendor_po_id = po.id
    ) AS gls_items
FROM 
    vendor_po AS po
WHERE 
    po.vendorId = $1
    AND ($2::date IS NULL OR po.po_date >= $2::date)
    AND ($3::date IS NULL OR po.po_date <= $3::date)
    AND ($4::text IS NULL OR po.note LIKE '%' || $4::text || '%');
`;

export { vendorPOApi };
