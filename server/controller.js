const sql = require('mssql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//const secret = 'jsonwebtokensecret';
const { generateAccessToken} = require('./auth');

const config = {
    user: 'sa',
    password: 'Fretlownode app.js',
    server: 'localhost',
    database: 'master',
    trustServerCertificate: true
} 

exports.getStudents = async (req, res) => {
    const InstructorName = req.query.instructorName;
    console.log(`getting students of ${InstructorName} `);
    try {
        const conn = await sql.connect(config);
        const { Request } = sql;
        const req = new Request();
        req.input('UserName', sql.VarChar(60), InstructorName);
        result = await req.query(`SELECT (InstructorId) FROM Instructors WHERE UserName=@UserName `);
        const realId = result.recordset[0].InstructorId;
        console.log("result.recordset[0] :: : : : : ")
        console.log(realId)
        req.input('InstructorId', sql.Int, realId);
        result2 = await req.query(`SELECT * FROM Students WHERE InstructorId=@InstructorId `);
        await conn.close();
        return res.send({
            results: result2
        })
    }catch(error) {
        console.log('error occurred..');
        console.log(error);
    }
}
exports.getLessons = async (req, res) => {
    const InstructorName = req.query.instructorName;
    try {
        const conn = await sql.connect(config);
        const { Request } = sql;
        const req = new Request();
        req.input('UserName', sql.VarChar(60), InstructorName);
        result = await req.query(`SELECT (InstructorId) FROM Instructors WHERE UserName=@UserName `);
        const realId = result.recordset[0].InstructorId;
        console.log("result.recordset[0] :: : : : : ")
        console.log(realId)
        req.input('InstructorId', sql.Int, realId);
        //result2 = await req.query(`SELECT * FROM Lessons WHERE InstructorId=@InstructorId `);
        result2 = await req.query(`SELECT Firstname + ' ' + LastName as[StudentName], LessonDate, LessonTime 
        FROM Students a INNER JOIN Lessons b  
        ON a.StudentId = b.StudentId WHERE b.InstructorId=@InstructorId `);
        await conn.close();
        return res.send({
            results: result2
        })
    }catch(error) {
        console.log('error occurred..');
        console.log(error);
    }
}

exports.addInstructor = async (req, res) => {
    const student = {...req.body};
    //console.log("REQUEST:  : : : : " ,req);
    const {  FirstName, LastName, UserName, StudioName, Email, Password } = {...req.body};

    try {
        const conn = await sql.connect(config);
        const { Request } = sql;
        const req = new Request(conn);
        const salt = await bcrypt.genSalt(10);
        const hashWord = await bcrypt.hash(Password, salt);

        req.input('FirstName', sql.VarChar(60), FirstName);
        req.input('LastName', sql.VarChar(60), LastName);
        req.input('UserName', sql.VarChar(60), UserName);
        req.input('StudioName', sql.VarChar(60), StudioName);
        req.input('Email', sql.VarChar(60), Email);
        req.input('Password', sql.VarChar(60), hashWord);
        req.query(`INSERT INTO Instructors (FirstName, LastName, UserName, StudioName, Email, Password)
        VALUES (@FirstName, @LastName, @UserName, @StudioName, @Email, @Password)`, function(err, recordsets) {
             conn.close();
             const accessToken = generateAccessToken({username: UserName})
             res.send({results: recordsets,
                user: UserName,
                accessToken,
                error: err})
        })
        }catch(error) {
        console.log('error occurred..');
        console.log(error);
    }
}

exports.loginInstructor = async (req, res) => {
    const { UserName, Password } = { ...req.body };
    try{
        const conn = await sql.connect(config);
        const { Request } = sql;
        const req = new Request(conn);
        req.input('UserName', sql.VarChar(60), UserName);
        const result = await req.query(`SELECT * FROM Instructors WHERE (UserName)=@UserName  `);
    //    console.log("RESULT:::: :::::  ", result);
        if(result.recordset.length === 0){
            res.send('login failed!!!!!');
        }
        const hashword = result.recordset[0].Password;
        bcrypt.compare(Password, hashword, function(err, result) {
            if (result) {
                const accessToken = generateAccessToken({username: UserName})
                res.send({
                   user: UserName,
                   accessToken,
                   error: err})
            }else {
                res.status(401).json({
                    error: 'login failed'});
            }
        });        
    }catch(error){
        console.log("There was an error: ", error);
    }
}

exports.checkIfUserNameExists = async (req, res) => {
    const { UserName } = { ...req.body };
    try {
        const conn = await sql.connect(config);
        const { Request } = sql;
        const req = new Request(conn);
        req.input('UserName', sql.VarChar(60), UserName);
        const result = await req.query(`SELECT COUNT(*) FROM Instructors WHERE (UserName)=@UserName  `);
        await conn.close();
            return res.send({
                results: result
            })
    }catch(error) {
        console.log("ERROR: ", error);
    }
}

exports.registerNewStudent = async (req, res) => {
    const { FirstName, LastName, Password, InstructorName } = { ...req.body };
    let id;
    try{
        const conn = await sql.connect(config);
        const { Request } = sql;
        const req = new  Request(conn);
        req.input('UserName', sql.VARCHAR(60), InstructorName);
        const result = await req.query(`SELECT * FROM Instructors WHERE (UserName)=@UserName`);
        await conn.close();
        console.log('Instructor ID: ',result.recordset[0].InstructorId);
         id = result.recordset[0].InstructorId;
    }catch(error) {
        console.log("error: ", error);
    }
    try{
        const conn = await sql.connect(config);
        const { Request } = sql;
        const req = new Request(conn);
        req.input('FirstName', sql.VARCHAR(60), FirstName);
        req.input('LastName', sql.VARCHAR(60), LastName);
        req.input('InstructorId', sql.INT, id);
        req.input('Password', sql.VARCHAR(60), Password);
        req.query(`INSERT INTO Students (FirstName, LastName, InstructorId, Password)
        VALUES (@FirstName, @LastName, @InstructorId, @Password)`, function(err, recordsets) {
             conn.close();
             res.send({results: recordsets,
                error: err})
        })
    }catch(error){
        console.log(error)}
    }

    exports.lessonsByStudentId = async (req, res) => {
        StudentId = req.query.StudentId;
        console.log("STUDENT ID: ", StudentId );

        try{
            const conn = await sql.connect(config);
            const { Request } = sql;
            const req = new  Request(conn);
            req.input('StudentId', sql.VARCHAR(60), StudentId);
            const result = await req.query(`SELECT * FROM Lessons WHERE (StudentId)=@StudentId`);
            await conn.close();
            console.log('Student : ',result.recordsets);
            res.send({
                results: result.recordsets
            })
            // id = result.recordset[0].InstructorId;
        }catch(error) {
            console.log("error: ", error);
        }
    }


    // selected :this.form.selected,
    //             LessonTime: this.form.timeValue,
    //             LessonDate: this.form.value,
    //             StudentId: this.$store.StudentId,
    //             instructorUserName: this.$store.instructorName

    exports.newLesson = async (req, res) => {
        console.log("NEW LESSON HIT : : : ");
        const {selected, LessonTime, LessonDate, StudentId, instructorUserName  } = { ...req.body  };
        console.log("selected, LessonTime, LessonDate, StudentId, instructorUserName : : : : :");
        console.log(selected, LessonTime, LessonDate, StudentId, instructorUserName);
        console.log(typeof LessonTime)
        console.log(typeof LessonDate)

        try{
            const conn = await sql.connect(config);
            const { Request } = sql;
            const req = new  Request(conn);
            req.input('UserName', sql.VARCHAR(60), instructorUserName);
            const result = await req.query(`SELECT * FROM Instructors WHERE (UserName)=@UserName`);
            await conn.close();
            console.log('Instructor ID: ',result.recordset[0].InstructorId);
             id = result.recordset[0].InstructorId;
        }catch(error) {
            console.log("error: ", error);
        }

        try{
            const conn = await sql.connect(config);
            const { Request } = sql;
            const req = new Request(conn);
            req.input('StudentId', sql.INT, StudentId);
            req.input('InstructorId', sql.INT, id);
            req.input('LessonDate', sql.Char(10), LessonDate);
            req.input('LessonTime', sql.Char(8), LessonTime);
            req.input('LessonDuration', sql.INT, selected);
            req.query(`INSERT INTO Lessons (StudentId, InstructorId, LessonDate, LessonTime, LessonDuration)
            VALUES (@StudentId, @InstructorId, @LessonDate, @LessonTime, @LessonDuration)`, function(err, recordsets) {
                 conn.close();
                 res.send({results: recordsets,
                    error: err})
            })
        }catch(error){
            console.log(error)}
        }


    
