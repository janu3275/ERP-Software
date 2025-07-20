import bcrypt from "bcrypt";
import dotenv from "dotenv";
import Joi from "joi";
import jwt from "jsonwebtoken";
import { queryDB } from "../db.mjs";
import { asyncHandler } from "../middleware/asynchandler.mjs";
import { postCompanyInfo } from "../queries/authqueries.mjs";

dotenv.config();

const authApi = {
  registerCompany: asyncHandler(async (req, res, next) => {
    // BODY VALIDATION

  const schema = Joi.object({
    companyID: Joi.string()
      .required()
      .min(6)
      .max(50)
      .pattern(/^[a-zA-Z0-9]*$/)
      .messages({
        'string.empty': 'Company name is required',
        'string.min': 'Company name must be at least 6 characters long',
        'string.max': 'Company name must be at most 50 characters long',
        'string.pattern.base': 'Company name can only contain alphanumeric characters and no spaces'
      }),
    Password: Joi.string()
      .required()
      .min(8)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      .messages({
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 8 characters long',
        'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character (@$!%*?&), and cannot contain spaces'
      })
  });

    // HANDLE VALIDATION ERROR

    if (error) {
      console.log(error.details);
      return res.status(200).json({
        success: false,
        message: "Validation error",
        error: error.details,
      });
    }

    // PROCEEDING TOWARDS REGISTERING COMPANY AND USER ---------

  try {
    const hashedPassword = await bcrypt.hash(body.Password, 10); //CREATING HASHED PASSWORD USING BCRYPT

    const companyinfo = (
      await queryDB(postCompanyInfo, [body.companyID, hashedPassword])
    )?.rows[0]; //INSERTING COMPANY INFO
    console.log(" companyinfo --> ", companyinfo);
    if (companyinfo) {
      return res
        .status(200)
        .json({
          success: true,
          message: "Company registered successfully",
          data: companyinfo.companyName,
        });
      }
    } catch (error) {
      return res
        .status(200)
        .json({ success: false, message: "DB insertion error", error: error });
    }
  }),

 loginCompany : asyncHandler(async (req, res, next) => {
  // BODY VALIDATION
  console.log("login company request --->", req.body)
  const schema = Joi.object({
    
    companyID: Joi.string()
      .required()
      .min(6)
      .max(50)
      .pattern(/^[a-zA-Z0-9]*$/)
      .messages({
        'string.empty': 'Company name is required',
        'string.min': 'Company name must be at least 6 characters long',
        'string.max': 'Company name must be at most 50 characters long',
        'string.pattern.base': 'Company name can only contain alphanumeric characters and no spaces'
      }),

    Password: Joi.string()
      .required()
      .min(8)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      .messages({
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 8 characters long',
        'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character (@$!%*?&), and cannot contain spaces'
      })
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

  // GET COMPANY INFO BASED ON COMPANY NAME
  let getCompanyInfoqry = `select * from companyinfo where company_id = $1`;

    // PROCEEDING TOWARDS REGISTERING COMPANY AND USER ---------

  try {
    const companyinfo = (await queryDB(getCompanyInfoqry, [body.companyID]))?.rows[0];

      if (!companyinfo) {
        return res.status(200).json({
          success: false,
          message: "Company name not found",
          error: "Company name not found",
        });
    }

    console.log("coming here", body.Password, companyinfo)
    const isMatch = await bcrypt.compare(body.Password, companyinfo.password); //COMPARING PASSWORDS
    console.log("coming here", isMatch)
    console.log("login companyinfo --> ", companyinfo);

    if (isMatch) {
      // Create a JWT with company information and the secret key
      const token = jwt.sign(companyinfo, process.env.JWT_COMPANY_SECRET, {
        expiresIn: "8h"
      });
     
      return res
        .status(200)
        .json({
          success: true,
          message: "Company Login successfully",
          data: { token: token, companyID: body.companyID }
        });

    } else {
      return res
        .status(200)
        .json({ success: false, message: "password mismatch", data: "" });
    }

  } catch (error) {
    return res
      .status(200)
      .json({ success: false, message: "DB insertion error", error: error });
  }
}),

  registerUser: asyncHandler(async (req, res, next) => {
    // BODY VALIDATION
    const companyid = req.company.companyid;
    const market_id = req.market.market_id;
    const schema = Joi.object({
      userid: Joi.string().required(),
      access: Joi.string().required(),
      market_id: Joi.number().integer().required(),
      password: Joi.string()
        .min(8) // Minimum length of 8 characters
        .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/) // At least one lowercase, one uppercase, one digit, and one special character
        .message(
          "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one digit, and one special character"
        )
        .required(),
    });

    let body = {
      ...req.body,
      market_id,
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

    // PROCEEDING TOWARDS REGISTERING COMPANY AND USER ---------

    let postusrinfoqry = `INSERT INTO userinfo (userid, access, password_hash, market_id) VALUES ($1, $2, $3, $4) returning * ;`;

    try {
      const hashedPassword = await bcrypt.hash(body.password, 10); //CREATING HASHED PASSWORD USING BCRYPT

      const usrinfo = (
        await queryDB(postusrinfoqry, [
          body.userid,
          body.access,
          hashedPassword,
          body.market_id,
        ])
      )?.rows[0]; //INSERTING COMPANY INFO
      console.log("register userinfo --> ", usrinfo);
      if (usrinfo) {
        return res.status(200).json({
          success: true,
          message: "user registered successfully",
          data: {
            userid: usrinfo.userid,
          },
        });
      }
    } catch (error) {
      return res
        .status(200)
        .json({ success: false, message: "DB insertion error", error: error });
    }
  }),

  loginUser: asyncHandler(async (req, res, next) => {
    // BODY VALIDATION
    const companyid = req.company.companyid;
    const market_id = req.market.market_id;
    const schema = Joi.object({
      userid: Joi.string().required(),
      password: Joi.string().required(),
      market_id: Joi.number().integer().required(),
    });

    let body = {
      ...req.body,
      market_id,
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

    // PROCEEDING TOWARDS REGISTERING COMPANY AND USER ---------

    let getusrinfoqry = `select * from userinfo where userid = $1 and market_id = $2`;

    try {
      const usrinfo = (
        await queryDB(getusrinfoqry, [body.userid, body.market_id])
      )?.rows[0]; //GETTING USER INFO

      if (!usrinfo) {
        return res
          .status(200)
          .json({ success: false, message: "user not registered", error: "" });
      }

      const isMatch = await bcrypt.compare(
        body.password,
        usrinfo.password_hash
      ); //COMPARING PASSWORDS

      console.log("login userinfo --> ", usrinfo);

      if (isMatch) {
        // Create a JWT with user information and the secret key
        const usertoken = jwt.sign(usrinfo, process.env.JWT_USER_SECRET, {
          expiresIn: "5h",
        });

        return res.status(200).json({
          success: true,
          message: "user login successfully",
          data: { usertoken, userid: body.userid },
        });
      } else {
        return res
          .status(200)
          .json({ success: true, message: "user password mismatch", data: "" });
      }
    } catch (error) {
      return res
        .status(200)
        .json({ success: false, message: "DB insertion error", error: error });
    }
  }),
};

export { authApi };
