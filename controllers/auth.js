const mysql = require("mysql");

const db = mysql.createConnection({

  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE
});




exports.register=(req,res) => {

console.log(req.body);

const name= req.body.name;
const email= req.body.email;
const password= req.body.password;
const passwordConfirm= req.body.passwordConfirm;
res.send("form submitted");
db.query("SELECT email FROM user WHERE email =?",[email], (error , results) =>{
if(error){
  console.log(error);
}if(results.length > 0 ) {
  return res.render("register", {
    massage: "this email is alreay in use "
  })
  }
  else if(password!== passwordConfirm){
    return res.render ("register", {
      massage : "password donot match"
    })
  }


})
}
