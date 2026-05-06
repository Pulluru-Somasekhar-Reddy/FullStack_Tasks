const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./db");
const QRCode = require("qrcode");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

/* REGISTER */
app.post("/register",(req,res)=>{
const {name,email,password}=req.body;

db.query(
"INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)",
[name,email,password,"user"],
(err)=>{
if(err){
console.log(err);
return res.send("User exists");
}
res.send("Registered Successfully");
});
});

/* LOGIN */
app.post("/login",(req,res)=>{
const {email,password}=req.body;

db.query(
"SELECT * FROM users WHERE email=? AND password=?",
[email,password],
(err,result)=>{
if(result.length>0){
res.json({message:"Login Success",user:result[0]});
}else{
res.json({message:"Invalid"});
}
});
});

/* GET EVENTS */
app.get("/events",(req,res)=>{
db.query("SELECT * FROM events",(err,result)=>{
if(err){
console.log(err);
return res.json([]);
}
res.json(result);
});
});

/* ADD EVENT (FIXED) */
app.post("/add-event",(req,res)=>{
const {title,description,date,price,user_role}=req.body;

if(user_role!=="admin"){
return res.send("Only admin allowed");
}

/* FIX DATE FORMAT */
let formattedDate = new Date(date).toISOString().split("T")[0];

db.query(
"INSERT INTO events (title,description,date,price) VALUES (?,?,?,?)",
[title,description,formattedDate,price],
(err,result)=>{

if(err){
console.log("DB ERROR:",err);
return res.send("Database Error");
}

res.send("Event Added Successfully");

});
});

/* DELETE EVENT */
app.delete("/delete-event/:id",(req,res)=>{
const {user_role}=req.body;

if(user_role!=="admin"){
return res.send("Only admin allowed");
}

db.query(
"DELETE FROM events WHERE id=?",
[req.params.id],
(err)=>{
if(err){
console.log(err);
return res.send("Delete Error");
}
res.send("Deleted Successfully");
});
});

/* BOOK EVENT */
app.post("/book",async(req,res)=>{
const {user_id,event_id}=req.body;

const qr = await QRCode.toDataURL(`User:${user_id}-Event:${event_id}`);

db.query(
"INSERT INTO bookings (user_id,event_id,qr_code) VALUES (?,?,?)",
[user_id,event_id,qr],
(err)=>{
if(err){
console.log(err);
return res.json({qr:null});
}
res.json({qr});
});
});

/* FEEDBACK */
app.post("/feedback",(req,res)=>{
const {user_id,event_id,comments,rating}=req.body;

db.query(
"INSERT INTO feedback (user_id,event_id,comments,rating) VALUES (?,?,?,?)",
[user_id,event_id,comments,rating],
(err)=>{
if(err){
console.log(err);
return res.send("Error");
}
res.send("Feedback Submitted");
});
});

app.listen(5000,()=>console.log("Server running on http://localhost:5000"));