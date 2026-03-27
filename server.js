const express = require("express")
const mysql = require("mysql2")
const cors = require("cors")
const path = require("path")

const app = express()

app.use(cors())
app.use(express.json())

// serve static files from public folder
app.use(express.static("public"))

/* Root path -> open login page */

app.get("/", (req,res)=>{
 res.sendFile(path.join(__dirname,"public","home.html"))
})

const db = mysql.createConnection({
 host:"localhost",
 user:"root",
 password:"tehazeeb@2005",
 database:"campus_events"
})

db.connect(err=>{
 if(err){
  console.log(err)
 }else{
  console.log("MySQL Connected")
 }
})

/* Student Registration */

app.post("/register",(req,res)=>{

 const {name,email,password}=req.body

 const sql="INSERT INTO users(name,email,password,role) VALUES(?,?,?,'student')"

 db.query(sql,[name,email,password],(err,result)=>{
    if(err){
        console.log(err)
        return res.send("Registration Error")
    }

    res.send("Registered Successfully")
 })

})

/* Login */

app.post("/login",(req,res)=>{

 const {email,password}=req.body

 const sql="SELECT * FROM users WHERE email=? AND password=?"

 db.query(sql,[email,password],(err,result)=>{

    if(err){
        console.log(err)
        return res.json({status:"error"})
    }

    if(result.length>0){

        const user=result[0]

        res.json({
            status:"success",
            role:user.role
        })

    }else{
        res.json({status:"fail"})
    }

 })

})

/* Get Events */

app.get("/events",(req,res)=>{

 const sql="SELECT * FROM events"

 db.query(sql,(err,result)=>{

    if(err){
        console.log(err)
        return res.send("Error fetching events")
    }

    res.json(result)

 })

})

/* Admin Add Event */

app.post("/add-event",(req,res)=>{

 const {title,description,date}=req.body

 const sql="INSERT INTO events(title,description,event_date) VALUES(?,?,?)"

 db.query(sql,[title,description,date],(err,result)=>{

    if(err){
        console.log(err)
        return res.send("Error adding event")
    }

    res.send("Event Added Successfully")

 })

})

/* Student Register Event */

app.post("/register-event",(req,res)=>{

 const {email,title}=req.body

 const sql="INSERT INTO registrations(student_email,event_title) VALUES(?,?)"

 db.query(sql,[email,title],(err,result)=>{

    if(err){
        console.log(err)
        return res.send("Registration Failed")
    }

    res.send("Event Registered")

 })

})

/* Admin View Registrations */

app.get("/registrations",(req,res)=>{

 const sql="SELECT * FROM registrations"

 db.query(sql,(err,result)=>{

    if(err){
        console.log(err)
        return res.send("Error fetching registrations")
    }

    res.json(result)

 })

})

/* Start Server */

app.listen(3000,()=>{
 console.log("Server running on http://localhost:3000")
})