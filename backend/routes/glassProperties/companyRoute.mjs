import express from 'express';
import { glassCompanyApi } from '../../controller/catalog/glasspropertiescatalog/glass_companyController.mjs';
import { authCompanyToken, authMarketToken, authUserToken } from '../../middleware/authenticate.mjs';


// const auth = require("../middleware/auth")




const router = express.Router();



router.get("/getall", authCompanyToken, authMarketToken , authUserToken, glassCompanyApi.getAllglassCompany);
router.post("/add",authCompanyToken, authMarketToken , authUserToken, glassCompanyApi.addglassCompany);
router.post("/update",authCompanyToken, authMarketToken , authUserToken, glassCompanyApi.updateglassCompany);
router.delete("/delete", authCompanyToken, authMarketToken , authUserToken, glassCompanyApi.deleteglassCompany);

export default router;