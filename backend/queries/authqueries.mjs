const postCompanyInfo = `INSERT INTO companyinfo (company_id, password) VALUES ($1, $2) RETURNING companyid, company_id, password;`







export {postCompanyInfo};