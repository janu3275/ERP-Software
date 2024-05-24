import express from 'express';
import { authCompanyToken, authMarketToken, authUserToken } from '../middleware/authenticate.mjs';
import { whatsappApi } from '../controller/whatsappController.mjs';



// const auth = require("../middleware/auth")



const router = express.Router()


router.post("/sendmessage", authCompanyToken, authMarketToken , authUserToken, whatsappApi.sendWhatsappMessage);


export default router;




