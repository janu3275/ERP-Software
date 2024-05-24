import { asyncHandler } from "../middleware/asynchandler.mjs";
import { queryDB } from "../db.mjs";
import bcrypt from "bcrypt";
import Joi from "joi";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();


  


const whatsappApi = {

   sendWhatsappMessage : asyncHandler(async (req, res, next) => {
           // BODY VALIDATION
   const market_id = req.market.market_id;
   console.log("whatsapp message started")
   const schema = Joi.object({
     market_id: Joi.number().integer().required(),
     data: Joi.object().required()
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
      
        // PROCEEDING TOWARDS ADDING Service ---------
        const url = `https://graph.facebook.com/${process.env.VERSION}/${process.env.PHONE_NUMBER_ID}/messages`;
        
        const headers = {
            'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
         };

        try {
            console.log("jkkjkff", value.data)
            const data = value.data
            let response = await axios.post(url, data, { headers })

            console.log("whatsapp response", response)
             
              res
              .status(200)
              .json({
                success: true,
                message: "message sent successfully",
                data: "",
              });
        
        } catch (error) {
          return res
            .status(200)
            .json({ success: false, message: "creating error", error: error });
        }
      })

}

export {whatsappApi} ;