import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

// Middleware to verify the tokens
const authCompanyToken = (req, res, next) => {
    console.log('request==>', req.headers)
    const companytoken = req.headers['companyauthtoken'].split(' ')[1] ;
   
    if (!companytoken) {
      return res.status(401).json({ message: 'Unauthorized, no company token found' });
    }

    
    // Verify the token
    jwt.verify(companytoken, process.env.JWT_COMPANY_SECRET, (err, companyinfo) => {
      if (err) {
        return res.status(403).json({ message: 'Forbidden as company token not valid or expired' });
      }
  
      // Token is valid; company information is available in the `companyinfo` variable
      // ADDING COMPANY INFO IN REQUST BODY AND QUERY TO BE USED IN ALL SERVICES
      let {companyid, ...rest} = companyinfo;
   

      req.company = {
      
        companyid
      }

      next();
    });
  }

const authUserToken = (req, res, next) => {
  const usertoken = req.headers['userauthtoken'].split(' ')[1] ;
  
    if (!usertoken) {
      return res.status(401).json({ message: 'Unauthorized no user token found' });
    }
  
    // Verify the token
    jwt.verify(usertoken, process.env.JWT_USER_SECRET, (err, user) => {

      if (err) {
        return res.status(403).json({ message: 'Forbidden as user token not valid or expired' });
      }
  
       // Token is valid; user information is available in the `user` variable
       // ADDING COMPANY INFO IN REQUST BODY AND QUERY TO BE USED IN ALL SERVICES
       let {id, ...rest} = user;
     
      
       req.user = {
            userid:id
       }

      next();
    });
  }

  const authMarketToken = (req, res, next) => {
    const markettoken = req.headers['marketauthtoken'].split(' ')[1];
    
      if (!markettoken) {
        return res.status(401).json({ message: 'Unauthorized no market token found' });
      }
    
      // Verify the token
      jwt.verify(markettoken, process.env.JWT_MARKET_SECRET, (err, marketinfo) => {
        
        if (err) {
          return res.status(403).json({ message: 'Forbidden as market token not valid or expired' , error:err});
        }
    
        // Token is valid; user information is available in the `user` variable
    
      let {id, ...rest} = marketinfo;
    
      req.market = {
        
        market_id:id
      }

        next();
      });
    }


  export { authCompanyToken, authUserToken, authMarketToken };