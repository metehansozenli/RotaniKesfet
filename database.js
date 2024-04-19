require("dotenv").config();
const {Client} = require("pg");


// ".env" dosyası içinde tanımlanmış DB bilgilerini çekme işlemi (Kendi DB özelliklerinizi yazabilirsiniz)
//Ya da bir ".env" dosyası oluşturup içine DB özelliklerini yazıp ordan çekebilirsiniz.
const client = new Client({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    port : process.env.DB_PORT,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE
})

module.exports = client