// for creating market place 

`CREATE TABLE marketplace (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    company_id INT NOT NULL,
    CONSTRAINT fk_company_id FOREIGN KEY (company_id) REFERENCES companyinfo (companyid) ON DELETE CASCADE
);`




