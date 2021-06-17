const sql = require('mssql');

const config = {
    user: 'sa',
    password: 'Fretlownode app.js',
    server: 'localhost',
    database: 'master',
    trustServerCertificate: true
} 

async function getUsers() {
    try {
        const conn = await sql.connect(config);

        const { Request } = sql;
        const req = new Request();
        result = await req.query('SELECT * FROM Users');
        console.log('check returned data... ');
        console.log(result);

        await conn.close();
    }catch(error) {
        console.log('error occurred..');
        console.log(error);
    }
}
getUsers();

// sql.connect({
//     user: 'sa',
//     password: 'Fretlownode app.js',
//     server: 'localhost',
//     database: 'master',
//     trustServerCertificate: true
// }, (err) => {
//     if (err) {
//         console.log('could not connect database');
//         console.log(err);
//         return;
//     }

//     const { Request } = sql;
//     const req = new Request();

//     req.query('SELECT * FROM Users', (err, data) => {
//         console.log('check returned data... ');
//         console.log(data);
//     })
//     console.log('connected to database!');
// })