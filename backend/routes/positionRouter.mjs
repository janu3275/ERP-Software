import express from 'express';
import { positionApi } from '../controller/catalog/employee/positionController.mjs';
import { authCompanyToken, authMarketToken, authUserToken } from '../middleware/authenticate.mjs';


// const auth = require("../middleware/auth")



const router = express.Router()



router.get("/getall", authCompanyToken, authMarketToken , authUserToken, positionApi.getAllPositions);
router.post("/add", authCompanyToken, authMarketToken , authUserToken, positionApi.addPosition);
router.post("/update",authCompanyToken, authMarketToken , authUserToken,  positionApi.updatePosition);
router.delete("/delete", authCompanyToken, authMarketToken , authUserToken, positionApi.deletePosition);

export default router;