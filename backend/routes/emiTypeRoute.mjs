import express from 'express';
import { authCompanyToken, authMarketToken, authUserToken } from '../middleware/authenticate.mjs';
import { emiTypeApi } from '../controller/catalog/emiTypesController.mjs';



// const auth = require("../middleware/auth")



const router = express.Router()



router.get("/getall", authCompanyToken, authMarketToken , authUserToken, emiTypeApi.getAllEmiTypes);
router.post("/add", authCompanyToken, authMarketToken , authUserToken, emiTypeApi.addEmiType);
router.post("/update",authCompanyToken, authMarketToken , authUserToken, emiTypeApi.updateEmiType);
router.delete("/delete", authCompanyToken, authMarketToken , authUserToken, emiTypeApi.deleteEmiType);

export default router;


