const postCompanyInfo = `INSERT INTO companyinfo (companyname, gstnumber) VALUES ($1, $2) RETURNING companyid, companyname, gstnumber;`







export {postCompanyInfo};