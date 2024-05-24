import express from 'express';
import multer from 'multer';
const upload = multer();
// const auth = require("../middleware/auth")

import { authCompanyToken, authMarketToken, authUserToken } from '../middleware/authenticate.mjs';
import { transactionsApi } from '../controller/accounting/alltransactions.mjs';


const router = express.Router();



router.post("/getall", authCompanyToken, authMarketToken, authUserToken, transactionsApi.getFilteredTransactions);



export default router;