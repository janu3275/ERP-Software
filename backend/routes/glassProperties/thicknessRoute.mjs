import express from 'express';
import { thicknessApi } from '../../controller/catalog/glasspropertiescatalog/glass_thicknessController.mjs';
import { authCompanyToken, authMarketToken, authUserToken } from '../../middleware/authenticate.mjs';






// const auth = require("../middleware/auth")




const router = express.Router();



router.get("/getall", authCompanyToken, authMarketToken , authUserToken, thicknessApi.getAllthickness);
router.post("/add",authCompanyToken, authMarketToken , authUserToken, thicknessApi.addthickness);
router.post("/update",authCompanyToken, authMarketToken , authUserToken, thicknessApi.updatethickness);
router.delete("/delete", authCompanyToken, authMarketToken , authUserToken, thicknessApi.deletethickness);

export default router;