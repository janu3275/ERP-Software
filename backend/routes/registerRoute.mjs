import express from 'express';

// const auth = require("../middleware/auth")
import { authApi } from '../controller/authController.mjs';
import { authCompanyToken, authMarketToken } from '../middleware/authenticate.mjs';


const router = express.Router()




router.post("/company",  authApi.registerCompany);
router.post("/user", authCompanyToken, authMarketToken , authApi.registerUser);

export default router;




