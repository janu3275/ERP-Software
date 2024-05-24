// add vendor, update vendor, delete vendor, add products per vendor, update products per vendor, delete products per vendor
import { asyncHandler } from "../../../middleware/asynchandler.mjs";
import { queryDB } from "../../../db.mjs";
import Joi from "joi";
import { deleteDirectory, generateRandomId, getFilesInDirectory, saveFilesToLocalDisk } from "../../../utils/commonFunction.mjs";

const vendorBillsApi = {
    
    getVendorBillsByVendorId : asyncHandler(async (req, res, next) => {
        const {vendorId, product_type} = req.query;
    
        const schema = Joi.object({
            vendorId: Joi.number().integer().required(),
            product_type: Joi.string()
            .valid('glass products', 'glass accessories', 'other products')
            .required()
        });
    
        const { error, value } = schema.validate({ vendorId , product_type});
    
        if (error) {
            console.log(error.details);
            return res.status(400).json({
                success: false,
                message: "Validation error",
                error: error.details,
            });
        }
    
        const getVendorBillsQuery = `
        SELECT
        vb.id,
        vb.bill_date,
        vb.bill_number,
        vb.attachment_path,
        vb.bill_amount,
        vb.note,
        vb.create_time,
        vb.vendor_id,
        v.vendor_name,
        v.product_type,
        CASE
          WHEN v.product_type = 'glass products' THEN (
            SELECT
              json_agg(
                json_build_object(
                  'glass_inventory_id', glass_inventory_id,
                  'quantity', quantity
                )
              )
            FROM
              vendor_bill_glsitems vbgi
            WHERE
              vbgi.vendor_bill_id = vb.id
          )
          WHEN v.product_type = 'glass accessories' THEN (
            SELECT
              json_agg(
                json_build_object(
                  'glass_accessory_id', glass_accessory_id,
                  'quantity', quantity
                )
              )
            FROM
              vendor_bill_gls_accessories vbga
            WHERE
              vbga.vendor_bill_id = vb.id
          )
          WHEN v.product_type = 'other products' THEN (
            SELECT
              json_agg(
                json_build_object(
                  'other_products_id', other_products_id,
                  'quantity', quantity
                )
              )
            FROM
              vendor_bill_otheritems vboi
            WHERE
              vboi.vendor_bill_id = vb.id
          )
          ELSE NULL
        END AS items 
      FROM
        vendor_bills vb
        LEFT JOIN vendors v ON vb.vendor_id = v.id
      WHERE
        vb.vendor_id = $1 ;`;
            
    
        try {

            let vendorBills = (
                await queryDB(getVendorBillsQuery, [value.vendorId])
            ).rows;

             vendorBills = vendorBills.map((bill) => {
                return {
                    ...bill,
                    images: getFilesInDirectory(bill.attachment_path) ,
                    items: bill.items || []
                }
             })
    
            if (vendorBills) {
                res.status(200).json({
                    success: true,
                    message: "Vendor bills retrieved successfully",
                    data: vendorBills,
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: "No vendor bills found",
                    data: [],
                });
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error retrieving vendor bills",
                error: error.message,
            });
        }
    }),

    addBillByVendorId : asyncHandler(async (req, res, next) => {
        
        const { bill_number, images, bill_amount, bill_date, note, vendorId, items, product_type } = req.body;
        const market_id = req.market.market_id;  
        const schema = Joi.object({
            bill_number: Joi.string().required(),
            images: Joi.array().min(1).required(),
            bill_amount: Joi.number().required(),
            bill_date: Joi.date().required(),
            note: Joi.string().allow('').required(),
            vendorId: Joi.number().integer().required(),
            items: Joi.array(),
            product_type: Joi.string()
            .valid('glass products', 'glass accessories', 'other products')
            .required(),
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
                error: error.details,
            });
        }
    
        const addBillQuery = `
            INSERT INTO vendor_bills (bill_number, attachment_path, bill_amount, bill_date, note,  vendor_id)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;`;

        const addbillglsItemsQuery = `
            INSERT INTO vendor_bill_glsitems (vendor_bill_id, glass_inventory_id, quantity)
            VALUES ($1, $2, $3);`;
            
        const addbillglsaccessoryQuery = `
            INSERT INTO vendor_bill_gls_accessories (vendor_bill_id, glass_accessory_id, quantity)
            VALUES ($1, $2, $3);`;

        const vendor_bill_otheritems = `
            INSERT INTO vendor_bill_otheritems (vendor_bill_id, other_products_id, quantity)
            VALUES ($1, $2, $3);`;

            let item_Id = `I-${generateRandomId(7)}`;
            let itemPath = `./Uploads/${Date.now()}/vendorID-${vendorId}/BillID-${item_Id}`;
    
        try {
            // await queryDB('BEGIN'); 
            let files = images;
           

            const addedBill = (
                await queryDB(addBillQuery, [bill_number, itemPath, bill_amount, bill_date, note,  vendorId])
            ).rows[0];
    
            console.log("files --->", files)
            saveFilesToLocalDisk(files, itemPath) // saving files to path

            if (!addedBill) {
                res.status(201).json({
                    success: true,
                    message: "error adding Bill",
                    data: addedBill,
                });
            }

            const insertPromises = items.map(item => {
                if(product_type==='glass products'){
                    return queryDB(addbillglsItemsQuery, [addedBill.id, item.glass_inventory_id, item.quantity]);
                }else if(product_type==='glass accessories'){
                    return queryDB(addbillglsaccessoryQuery, [addedBill.id, item.glass_accessory_id, item.quantity]);
                }else{
                    return queryDB(vendor_bill_otheritems, [addedBill.id, item.other_products_id, item.quantity]);
                }
                
            });

            const insertedRows =  await Promise.all(insertPromises);

            if(insertedRows && addedBill){

        // Loop through items and update inventory
        for (const item of items) {
            if (product_type === 'glass products') {
                // Update stock in glass_inventory
                const updateGlassInventoryQuery = `
                    UPDATE glass_inventory
                    SET stock = stock + $1
                    WHERE id = $2
                    AND market_id = $3;`;
                await queryDB(updateGlassInventoryQuery, [item.quantity, item.glass_inventory_id, market_id]);
            } else if (product_type === 'glass accessories') {
                // Update stock in glass_accessory
                const updateGlassAccessoryQuery = `
                    UPDATE glass_accessory
                    SET stock = stock + $1
                    WHERE id = $2
                    AND market_id = $3;`;
                    
                await queryDB(updateGlassAccessoryQuery, [item.quantity, item.glass_accessory_id, market_id]);
            } else if (product_type === 'other products') {
                // Update stock in other_products
                const updateOtherProductsQuery = `
                    UPDATE other_products
                    SET stock = stock + $1
                    WHERE id = $2
                    AND market_id = $3;`;

                await queryDB(updateOtherProductsQuery, [item.quantity, item.other_products_id, market_id]);
            }
        }
            }
          
            // await queryDB('COMMIT'); 
            if (addedBill && insertedRows) {
                res.status(201).json({
                    success: true,
                    message: "Bill added successfully",
                    data: addedBill,
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: "Error adding bill",
                    data: null,
                });
            }
        } catch (error) {
            // await queryDB('ROLLBACK'); 
            deleteDirectory(itemPath)
            return res.status(500).json({
                success: false,
                message: "Error adding bill",
                error: error.message,
            });
        }
    }),

    updateVendorBill: asyncHandler(async (req, res, next) => {
        
     
        const { bill_number, images, bill_amount, bill_date, note , billId, items, product_type } = req.body;
        const market_id = req.market.market_id;

        const schema = Joi.object({
            billId: Joi.number().integer().required(),
            bill_number: Joi.string().required(),
            bill_date: Joi.date().required(),
            images: Joi.array().min(1).required(),
            note: Joi.string().allow('').required(),
            bill_amount: Joi.number().required(),
            items: Joi.array(),
            product_type: Joi.string()
            .valid('glass products', 'glass accessories', 'other products')
            .required(),
            market_id: Joi.number().integer().required()
        });

        let body = {
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

        const getBillByIdQry = `select attachment_path from vendor_bills where id = $1`;
    
        const updateBillQuery = `
            UPDATE vendor_bills 
            SET bill_number = $1, attachment_path = $2, bill_amount = $3, bill_date = $4, note = $5
            WHERE id = $6
            RETURNING *;`;

        const delete_billglsItemsQuery = `DELETE FROM vendor_bill_glsitems WHERE vendor_bill_id = $1;`;
            
        const delete_billglsaccessoryQuery = `DELETE FROM vendor_bill_gls_accessories WHERE vendor_bill_id = $1; `;

        const delete_vendor_bill_otheritems = `DELETE FROM vendor_bill_otheritems WHERE vendor_bill_id = $1;`;   

        const existing_bill_glsitems_Rows_qry = `select * from vendor_bill_glsitems WHERE vendor_bill_id = $1;`
        const existing_bill_glsaccessory_Rows_qry = `select * from vendor_bill_gls_accessories WHERE vendor_bill_id = $1;`
        const existing_bill_otheritems_Rows_qry = `select * from vendor_bill_otheritems WHERE vendor_bill_id = $1;`

        

    
        try {
            // await queryDB('BEGIN'); 
            // deleting existing stock 
            const existing_bill_glsitems_Rows = (await queryDB(existing_bill_glsitems_Rows_qry, [billId])).rows
            const existing_bill_glsaccessory_Rows = (await queryDB(existing_bill_glsaccessory_Rows_qry, [billId])).rows
            const existing_bill_otheritems_Rows = (await queryDB(existing_bill_otheritems_Rows_qry, [billId])).rows

            const prevPath = (
                await queryDB(getBillByIdQry, [billId])
            ).rows[0]?.attachment_path;
            

            let files = images;
          

            const updatedBill = (
                await queryDB(updateBillQuery, [bill_number, prevPath, bill_amount, bill_date, note, billId])
            ).rows[0]?.id;
    
            console.log("files --->", files)
            deleteDirectory(prevPath)
            saveFilesToLocalDisk(files, prevPath) // saving files to path

            if(!updatedBill){
                return res.status(200).json({
                    success: false,
                    message: "Error in updating bill",
                    error: error.message,
                });
            }

            // deleting existing rows 
            if(product_type==='glass products'){
                await queryDB(delete_billglsItemsQuery, [billId]);
            }else if(product_type==='glass accessories'){
                await queryDB(delete_billglsaccessoryQuery, [billId]);
            }else{
                await queryDB(delete_vendor_bill_otheritems, [billId]);
            }

            // Insert updated items associated with the vendor PO
              const addbillglsItemsQuery = `
              INSERT INTO vendor_bill_glsitems (vendor_bill_id, glass_inventory_id, quantity)
              VALUES ($1, $2, $3)
              ON CONFLICT (vendor_bill_id, glass_inventory_id) DO UPDATE
              SET quantity = EXCLUDED.quantity;`;
          
          const addbillglsaccessoryQuery = `
              INSERT INTO vendor_bill_gls_accessories (vendor_bill_id, glass_accessory_id, quantity)
              VALUES ($1, $2, $3)
              ON CONFLICT (vendor_bill_id, glass_accessory_id) DO UPDATE
              SET quantity = EXCLUDED.quantity;`;
          
          const vendor_bill_otheritems = `
              INSERT INTO vendor_bill_otheritems (vendor_bill_id, other_products_id, quantity)
              VALUES ($1, $2, $3)
              ON CONFLICT (vendor_bill_id, other_products_id) DO UPDATE
              SET quantity = EXCLUDED.quantity;`;
          

              console.log(items, billId)
              // Array to hold promises for all insert operations
              const insertPromises = items.map(item => {
                if(product_type==='glass products'){
                    return queryDB(addbillglsItemsQuery, [billId, item.glass_inventory_id, item.quantity]);
                }else if(product_type==='glass accessories'){
                    return queryDB(addbillglsaccessoryQuery, [billId, item.glass_accessory_id, item.quantity]);
                }else{
                    return queryDB(vendor_bill_otheritems, [billId, item.other_products_id, item.quantity]);
                }
                
            });

            const insertedRows =  await Promise.all(insertPromises);



            if(insertedRows && updatedBill){

                // Loop through items and update inventory
                
                    if (product_type === 'glass products') {
                         
                        for (const existingitem of existing_bill_glsitems_Rows) {   
                           // delete existing stock
                            const updateGlassInventoryQuery = `
                                UPDATE glass_inventory
                                SET stock = stock - $1
                                WHERE id = $2
                                AND market_id = $3 returning stock;`;
                            const updated = (await queryDB(updateGlassInventoryQuery, [existingitem.quantity, existingitem.glass_inventory_id, market_id])).rows[0];
                              console.log("updated", updated)
                            }

                       for (const item of items) {
                        // Update stock in glass_inventory
                        const updateGlassInventoryQuery = `
                            UPDATE glass_inventory
                            SET stock = stock + $1
                            WHERE id = $2
                            AND market_id = $3 returning stock;`;
                        const againupdate = (await queryDB(updateGlassInventoryQuery, [item.quantity, item.glass_inventory_id, market_id])).rows[0];
                        console.log("again updated", againupdate)
                            }

                    } else if (product_type === 'glass accessories') {

                        for (const existingitem of existing_bill_glsaccessory_Rows) {
                            // delete existing stock
                            const updateGlassAccessoryQuery = `
                                UPDATE glass_accessory
                                SET stock = stock - $1
                                WHERE id = $2
                                AND market_id = $3 returning stock;`;
                                
                               const updated = (await queryDB(updateGlassAccessoryQuery, [existingitem.quantity, existingitem.glass_accessory_id, market_id])).rows[0];
                               console.log("updated 2", updated)
                            }

                            for (const item of items) {

                        // Update stock in glass_accessory
                        const updateGlassAccessoryQuery = `
                            UPDATE glass_accessory
                            SET stock = stock + $1
                            WHERE id = $2
                            AND market_id = $3 returning stock;`;
                            
                        const againupdate =  (await queryDB(updateGlassAccessoryQuery, [item.quantity, item.glass_accessory_id, market_id])).rows[0];
                        console.log("again updated 2", againupdate)
                        }

                    } else if (product_type === 'other products') {

                        for (const existingitem of existing_bill_otheritems_Rows) {
                            // Update stock in other_products
                            const updateOtherProductsQuery = `
                                UPDATE other_products
                                SET stock = stock - $1
                                WHERE id = $2
                                AND market_id = $3;`;
            
                            await queryDB(updateOtherProductsQuery, [existingitem.quantity, existingitem.other_products_id, market_id]);
        
                            }
                     for (const item of items) {
                        // Update stock in other_products
                        const updateOtherProductsQuery = `
                            UPDATE other_products
                            SET stock = stock + $1
                            WHERE id = $2
                            AND market_id = $3;`;
        
                        await queryDB(updateOtherProductsQuery, [item.quantity, item.other_products_id, market_id]);
                    }
                    }
                
                    }


           
            // await queryDB('COMMIT'); 
            if (updatedBill && insertedRows) {
                res.status(200).json({
                    success: true,
                    message: "Bill updated successfully",
                    data: updatedBill,
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: "Bill not found or cannot be updated",
                    data: null,
                });
            }

        } catch (error) {
            // await queryDB('ROLLBACK'); 
            return res.status(500).json({
                success: false,
                message: "Error updating bill",
                error: error.message,
            });
        }
    }),
    
    deleteVendorBill : asyncHandler(async (req, res, next) => {
   
      const {billId} = req.query;
      const market_id = req.market.market_id;

        const schema = Joi.object({
            billId: Joi.number().integer().required(),
            market_id: Joi.number().integer().required()
        });

        let body = {
            ...req.query,
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
    
        const deleteBillQuery = `
            DELETE FROM vendor_bills
            WHERE id = $1 
            RETURNING *;`;

            const existing_bill_glsitems_Rows_qry = `select * from vendor_bill_glsitems WHERE vendor_bill_id = $1;`
            const existing_bill_glsaccessory_Rows_qry = `select * from vendor_bill_gls_accessories WHERE vendor_bill_id = $1;`
            const existing_bill_otheritems_Rows_qry = `select * from vendor_bill_otheritems WHERE vendor_bill_id = $1;`
    
        try {

            const existing_bill_glsitems_Rows = (await queryDB(existing_bill_glsitems_Rows_qry, [billId])).rows
            const existing_bill_glsaccessory_Rows = (await queryDB(existing_bill_glsaccessory_Rows_qry, [billId])).rows
            const existing_bill_otheritems_Rows = (await queryDB(existing_bill_otheritems_Rows_qry, [billId])).rows

            

            const deletedBill = (
                await queryDB(deleteBillQuery, [billId])
            ).rows[0];
            console.log("deleted bill ==>", deletedBill, billId)
            const attachmentPath = deletedBill.attachment_path
            deleteDirectory(attachmentPath)

            if(deletedBill){

                for (const existingitem of existing_bill_glsitems_Rows) {   
                    // delete existing stock
                     const updateGlassInventoryQuery = `
                         UPDATE glass_inventory
                         SET stock = stock - $1
                         WHERE id = $2
                         AND market_id = $3;`;
                     await queryDB(updateGlassInventoryQuery, [existingitem.quantity, existingitem.glass_inventory_id, market_id]);
 
                     }

                for (const existingitem of existing_bill_glsaccessory_Rows) {
                    // delete existing stock
                    const updateGlassAccessoryQuery = `
                        UPDATE glass_accessory
                        SET stock = stock - $1
                        WHERE id = $2
                        AND market_id = $3;`;
                        
                    await queryDB(updateGlassAccessoryQuery, [existingitem.quantity, existingitem.glass_accessory_id, market_id]);

                    }

                for (const existingitem of existing_bill_otheritems_Rows) {
                        // Update stock in other_products
                        const updateOtherProductsQuery = `
                            UPDATE other_products
                            SET stock = stock - $1
                            WHERE id = $2
                            AND market_id = $3;`;
        
                        await queryDB(updateOtherProductsQuery, [existingitem.quantity, existingitem.other_products_id, market_id]);
    
                    }  


            }
    
            if (deletedBill) {
                res.status(200).json({
                    success: true,
                    message: "Bill deleted successfully",
                    data: deletedBill,
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: "Bill not found or cannot be deleted",
                    data: null,
                });
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error deleting bill",
                error: error.message,
            });
        }
    })
    
};

const getFilteredVendorBillQry = `
SELECT
    vb.id,
    vb.bill_date,
    vb.bill_number,
    vb.attachment_path,
    vb.bill_amount,
    vb.note,
    vb.create_time,
    vb.vendor_id,
    v.vendor_name,
    v.product_type,
    CASE
        WHEN v.product_type = 'glass products' THEN (
            SELECT
                json_agg(
                    json_build_object(
                        'glass_inventory_id', glass_inventory_id,
                        'quantity', quantity
                    )
                )
            FROM
                vendor_bill_glsitems vbgi
            WHERE
                vbgi.vendor_bill_id = vb.id
        )
        WHEN v.product_type = 'glass accessories' THEN (
            SELECT
                json_agg(
                    json_build_object(
                        'glass_accessory_id', glass_accessory_id,
                        'quantity', quantity
                    )
                )
            FROM
                vendor_bill_gls_accessories vbga
            WHERE
                vbga.vendor_bill_id = vb.id
        )
        WHEN v.product_type = 'other products' THEN (
            SELECT
                json_agg(
                    json_build_object(
                        'other_products_id', other_products_id,
                        'quantity', quantity
                    )
                )
            FROM
                vendor_bill_otheritems vboi
            WHERE
                vboi.vendor_bill_id = vb.id
        )
        ELSE NULL
    END AS items 
FROM
    vendor_bills vb
    LEFT JOIN vendors v ON vb.vendor_id = v.id
WHERE
    vb.vendor_id = $1
    AND ($2::text IS NULL OR vb.bill_number LIKE '%' || $2::text || '%')
    AND ($3::date IS NULL OR vb.bill_date >= $3::date)
    AND ($4::date IS NULL OR vb.bill_date <= $4::date)
    AND ($5::numeric IS NULL OR vb.bill_amount >= $5::numeric)
    AND ($6::numeric IS NULL OR vb.bill_amount <= $6::numeric)
    AND ($7::boolean IS NULL OR (
        ($7::boolean = true AND (
            SELECT COUNT(*) FROM (
                SELECT
                    CASE
                        WHEN v.product_type = 'glass products' THEN (
                            SELECT
                                COUNT(*)
                            FROM
                                vendor_bill_glsitems vbgi
                            WHERE
                                vbgi.vendor_bill_id = vb.id
                        )
                        WHEN v.product_type = 'glass accessories' THEN (
                            SELECT
                                COUNT(*)
                            FROM
                                vendor_bill_gls_accessories vbga
                            WHERE
                                vbga.vendor_bill_id = vb.id
                        )
                        WHEN v.product_type = 'other products' THEN (
                            SELECT
                                COUNT(*)
                            FROM
                                vendor_bill_otheritems vboi
                            WHERE
                                vboi.vendor_bill_id = vb.id
                        )
                        ELSE 0
                    END
                ) AS inventory_count
            ) > 0
        )) OR (
            $7::boolean = false AND (
                SELECT COUNT(*) FROM (
                    SELECT
                        CASE
                            WHEN v.product_type = 'glass products' THEN (
                                SELECT
                                    COUNT(*)
                                FROM
                                    vendor_bill_glsitems vbgi
                                WHERE
                                    vbgi.vendor_bill_id = vb.id
                            )
                            WHEN v.product_type = 'glass accessories' THEN (
                                SELECT
                                    COUNT(*)
                                FROM
                                    vendor_bill_gls_accessories vbga
                                WHERE
                                    vbga.vendor_bill_id = vb.id
                            )
                            WHEN v.product_type = 'other products' THEN (
                                SELECT
                                    COUNT(*)
                                FROM
                                    vendor_bill_otheritems vboi
                                WHERE
                                    vboi.vendor_bill_id = vb.id
                            )
                            ELSE 0
                        END
                    ) AS inventory_count
                ) = 0
            )
        )
    )
    AND ($8::text IS NULL OR vb.note LIKE '%' || $8::text || '%')
ORDER BY vb.bill_date DESC;
`;


export { vendorBillsApi };
