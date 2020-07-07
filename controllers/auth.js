const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = mysql.createConnection({

  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE
});

exports.login = async (req, res) => {
  try {
    const {
      email,
      password
     } = req.body;

    if (!email || !password) {
      return res.status(400).render("login", {
        massage: "please provide email and password"

      })
    }
db.query("SELECT * FROM user WHERE email =?",[email], async(error,result)=>{

if(!result || !(await bcrypt.compare(password,result[0].password))){
  res.status(400).render("login", {
    massage: " incorrect"
})
}else{
const id = result[0].id;
const token = jwt.sign({id},process.snv.jwt_secret,{
expiresIn : process.env.jwt_expires_in

});
console.log(token);
const cookieOtion={
  expires: new Date(
  Date.now() + process.env.jwt_cookie_expires * 24 *60 *60

),
httpOnly : true
}
res.cookie("jwt",token,cookieOption);
res.status(200).redirect("/");
}

} )

}

  catch (error) {
console.log(error);
  }

}


exports.register = (req, res) => {

  console.log(req.body);

  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const passwordConfirm = req.body.passwordConfirm;

  db.query("SELECT email FROM user WHERE email =?", [email], async (error, results) => {
    if (error) {
      console.log(error);
    }
    if (results.length > 0) {
      return res.render("register", {
        massage: "this email is alreay in use "
      })
    } else if (password !== passwordConfirm) {
      return res.render("register", {
        massage: "password do not match"
      })
    }


    let hashedPassword = await bcrypt.hash(password, 8);
    console.log(hashedPassword);

    db.query("INSERT INTO user SET ? ", {
      name: name,
      email: email,
      password: hashedPassword
    }, (error, result) => {
      if (error) {
        console.log(error);
      } else {
        return res.render("register", {
          massage: "user registered "
        });
      }
    })


  })









}
