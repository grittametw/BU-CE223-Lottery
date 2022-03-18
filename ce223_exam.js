const express = require('express')
const bodyParser = require('body-parser')

const mysql = require('mysql')

const app = express()
const port = process.env.PORT || 5000

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.set('view engine','ejs')

// MySQL

const pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    password        : '',
    database        : 'exam_ce223'
})

var obj = {}

app.get('/additem',(req,res) => {
    res.render('viewadditem')
})

app.get('/check',(req,res) => {
    res.render('viewcheck')
})

app.get('/credit',(req,res) => {
    res.render('viewcredit')
})

app.get('', (req, res) => {
    
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log("connected id : ", connection.threadId)

        connection.query('SELECT * from lottery', (err, rows) => {
            connection.release() // return the connection to pool
            if(!err) {
                //res.send(rows)
                obj = {lottery : rows , Error : err}
                res.render('index',obj)
            } else {
                console.log(err)
            }
        })
    })
})

app.get('/:drawdate', (req, res) => {
    
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log("connected id : ", connection.threadId)

        connection.query('SELECT * from lottery WHERE `drawdate` = ?', req.params.drawdate, (err, rows) => {
            connection.release() // return the connection to pool
            if(!err) {
                //res.send(rows)
                obj = {lottery : rows, Error ,err}
                res.render('showprize',obj)
            } else {
                console.log(err)
            }
        })
    })
})

app.get('/:drawdate/:type', (req, res) => {
    
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log("connected id : ", connection.threadId)

        connection.query('SELECT * from lottery WHERE `type` = ?', req.params.type, (err, rows) => {
            connection.release() // return the connection to pool
            if(!err) {
                res.send(rows)
                //obj = {print : rows}
                //res.render('viewshowprize',obj)
            } else {
                console.log(err)
            }
        })
    })
})

/*app.get('/:drawdate/:number', (req, res) => {
    
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log("connected id : ", connection.threadId)

        connection.query('SELECT * from lottery', (err, rows) => {
            connection.release() // return the connection to pool
            if(!err) {
                //res.send(rows)
                obj = {lottery : rows , Error : err}
                res.render('viewcheck',obj)
            } else {
                console.log(err)
            }
        })
    })
})*/

/*app.get('/checklotto',(req,res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log("connected id : ", connection.threadId)

        connection.query('SELECT * from lottery WHERE `number` = ?', req.params.number, (err, rows) => {
            connection.release() // return the connection to pool
            if(!rows[0].count){
                connection.query('INSERT INTO lottery SET ?' , params, (err,rows) => {
                    connection.release();
                    if(!err){
                        //res.send(`${params.name} is complete adding item.`);
                        obj ={Error:err , mesg : `Success adding data `}
                        res.render('viewcheck',obj)
                    } else {
                        console.log(err);
                    }
                })
            } else {
                obj ={Error:err , mesg : `Cannot adding data `}
                res.render('viewcheck',obj)
                //res.send(`${params.name} do not insert data.`);
            }
        })
    })
})*/

//INSERT INTO `lottery` (`Drawdate`, `DATE`, `TYPE`, `name`, `NUMBER`) VALUES ('1', '2022-02-16', '2', 'รางวัลที่ 2 ', '4961');

app.post('/additem',(req,res) => {
    pool.getConnection((err,connection) => {
        if(err) throw err
        const params = req.body

        pool.getConnection((err,connection3)=>{
            connection3.query(`Select count(number) as count from lottery where number = ${params.number}` , (err,rows)=>{
                connection3.release();
                if(!rows[0].count){
                    connection.query('INSERT INTO lottery SET ?' , params, (err,rows) => {
                        connection.release();
                        if(!err){
                            //res.send(`${params.name} is complete adding item.`);
                            obj ={Error:err , mesg : `Success adding data (${params.name})`}
                            res.render('viewadditem',obj)
                        } else {
                            console.log(err);
                        }
                    })
                } else {
                    obj ={Error:err , mesg : `Cannot adding data (${params.name})`}
                    res.render('viewadditem',obj)
                    //res.send(`${params.name} do not insert data.`);
                }
            })
        })
    })
})



app.listen(port, () => 
    console.log("Listen on port : ", port)
    )