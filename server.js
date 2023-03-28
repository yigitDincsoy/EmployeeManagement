const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const app = express();
const multer = require(`multer`);
const upload = multer();


app.use(express.json());
app.use(cors({origin:'*'}))

const db = Database('Chinook_Sqlite.sqlite');

app.set('port', process.env.PORT || 8888) 

app.get('/employee',(req,res)=>{
    const statement = db.prepare('SELECT * FROM Employee');
    const result = statement.all();
    res.json(result);
})

app.get('/genre',(req,res)=>{
    const statement = db.prepare('SELECT * FROM Genre');
    const result = statement.all();
    res.json(result);
})

app.put('/employee/:id', (req, res) => {
    const statement = db.prepare(`UPDATE Employee SET FirstName=?,LastName=?,Email=?,Title=?,Phone=? WHERE EmployeeId=?`);
    statement.run(req.body.FirstName,req.body.LastName,req.body.Email,req.body.Title,req.body.Phone,req.params.id);
    res.end();
})

app.put('/genre/:id', (req, res) => {
    const statement = db.prepare(`UPDATE Genre SET Name=? WHERE GenreId=?`);
    statement.run(req.body.Name, req.params.id);
    res.end();
})

app.delete('/employee/:id',(req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    const sql = "DELETE FROM Employee WHERE EmployeeId=?";
    const statement = db.prepare(sql);
    statement.run([req.params.id]);
    console.log('delete',req.params.id);
    res.end();
    });

app.delete('/genre/:id',(req,res)=>{
        res.setHeader('Access-Control-Allow-Origin', '*');
        const sql = "DELETE FROM Genre WHERE GenreId=?";
        const statement = db.prepare(sql);
        statement.run([req.params.id]);
        console.log('delete',req.params.id);
        res.end();
        });
        
    

 
app.post(`/newemployee`, upload.none(), (req, res) => {
    res.setHeader(`Access-Control-Allow-Origin`, `*`)
    const statement2 = db.prepare(`INSERT INTO Employee(FirstName, LastName, Email, Title, Phone) VALUES(?,?,?,?,?)`);
    statement2.run([req.body.FirstName, req.body.LastName, req.body.Email, req.body.Title, req.body.Phone])
    console.dir(req.body);
    res.end();
 })


 app.post(`/newgenre`, upload.none(), (req, res) => {
    res.setHeader(`Access-Control-Allow-Origin`, `*`)
    const statement2 = db.prepare(`INSERT INTO Genre(Name) VALUES(?)`);
    statement2.run([req.body.Genre])
    console.dir(req.body);
    res.end();
 })

app.listen(app.get('port'), () => {
    console.info(`Server listen on port ${app.get('port')}`);
})



