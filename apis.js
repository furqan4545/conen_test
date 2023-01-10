const express = require("express");
const jwt = require("jsonwebtoken")
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let token = "abcd";
let refresh_token = "kbcdf";

let students = ["amanda"];
let teachers = ["jerry"];

let new_teachers = {};
let new_students = {};

let teacher_pw = {
    "jerry": "jerry12"
};
let student_pw ={"amanda": "amanda12"};

app.post('/login', function (req, res) {
    
    let {uname} = req.body;
    let {password} = req.body;
    console.log(password);
    console.log(teacher_pw["jerry"]);
    
    const user = teachers.find( (c) => c == uname)
    console.log("dsdddd: ", user);
    //check to see if the user exists in the list of registered users
    if (user == null) res.status(404).send ("User does not exist!")
    //if user does not exist, send a 404 response
    if (password === teacher_pw.jerry) {
    const accessToken = generateAccessToken ({user: uname})
    const refreshToken = generateRefreshToken ({user: uname})
    
    res.json({accessToken: accessToken, refreshToken: refreshToken})
    } 
    else {
    res.status(401).send("Password Incorrect!")
    }
    // res.send('Hello World')
})

// accessTokens
function generateAccessToken(user) {
    return jwt.sign(user, token, {expiresIn: "15m"}) 
}
// refreshTokens
let refreshTokens = []
function generateRefreshToken(user) {
    const refreshToken = jwt.sign(user, refresh_token, {expiresIn: "20m"})
    refreshTokens.push(refreshToken)
    return refreshToken
}

app.get("/posts", validateToken, (req, res)=>{
    console.log("Token is valid")
    console.log(req.user.user)
    res.send(`${req.user.user} successfully accessed post`)
})

function validateToken(req, res, next) {
    //get token from request header
    const authHeader = req.headers["authorization"]
    const token_t = authHeader.split(" ")[1]
    //the request header contains the token "Bearer <token>", split the string and use the second value in the split array.
    if (token_t == null) res.sendStatus(400).send("Token not present")
    jwt.verify(token_t, token, (err, user) => {
    if (err) { 
     res.status(403).send("Token invalid")
     }
     else {
     console.log("Token available");
     next() //proceed to the next action in the calling function
     }
    }) //end of jwt.verify()
} //end of function


app.post('/create_class', validateToken, function (req, res) {
    
    let {c_name} = req.body;
    let {c_id} = req.body;
    var st_class = {};
    
    st_class[c_id] = c_name;
        
    
    // for (var i = 0; i< c_limit; i++) {
    //     st_class[i] = c_name;
    // }

    res.json({"class name: ": st_class});

    // res.send('Hello World')
})

app.post('/create_teacher', validateToken, function (req, res) {
    
    let {teacher_name} = req.body;
    let {techer_password} = req.body;

    new_teachers[teacher_name] = techer_password;
    

    res.json("New teacher created successfull");

    // res.send('Hello World')
})

app.post('/create_student',validateToken, function (req, res) {
    
    let {student_name} = req.body;
    let {student_password} = req.body;
    
    new_students[student_name] = student_password;

    res.json("New student created successfull");

    // res.send('Hello World')
})


app.post('/student_login', validateToken,  function (req, res) {
    
    let {s_name} = req.body;
    let {s_id} = req.body;
    let {s_pw} = req.body;
    const user = students.find( (c) => c == s_name)
    console.log("dsdddd: ", user);
    //check to see if the user exists in the list of registered users
    if (user == null) res.status(404).send ("User does not exist!")
    //if user does not exist, send a 404 response
    if (s_pw === student_pw.amanda) {
    const accessToken = generateAccessToken ({user: s_name})
    const refreshToken = generateRefreshToken ({user: s_name})
    
    res.json({accessToken: accessToken, refreshToken: refreshToken})
    } 
    else {
    res.status(401).send("Password Incorrect!")
    }
})

app.post('/delete_student', validateToken, function (req, res) {
    
    let {student_name} = req.body;
    delete new_students[student_name];
    res.json("Student deleted successfull");
})

app.post('/delete_teacher', function (req, res) {
    
    let {teacher_name} = req.body;
    delete new_teachers[teacher_name];
    res.json("Teacher deleted successfull");
})

app.get('/get_students', function (req, res) {
    
    ss = [];
    ff = [];
    for (const [key, value] of Object.entries(new_students)) {
        ss.push(key);
        ff.push(value);
        console.log(key, value);
      }
    res.json({"student name": ss, "password": ff});
})


app.get('/get_teachers', function (req, res) {
    
    ss = [];
    ff = [];
    for (const [key, value] of Object.entries(new_teachers)) {
        ss.push(key);
        ff.push(value);
        console.log(key, value);
      }
    res.json({"student name": ss, "password": ff});
})


var subscribed_students = {} 
total_students = []

app.post('/subscribe', function (req, res) {
    
    let {s_name} = req.body;
    let {c_name} = req.body;
    total_students.push(s_name);
    
    subscribed_students[c_name] = total_students;
    // subscribed_students["physics"] = ["ali", "jery", "kumar"];

    res.json({"total students now: ": subscribed_students});

})

app.post('/unsubscribe', function (req, res) {
    
    let {s_name} = req.body;
    let {c_name} = req.body;
    total_students.pop(s_name);
    
    subscribed_students[c_name] = total_students;
    // subscribed_students["physics"] = ["ali", "jery", "kumar"];

    res.json({"total students now: ": subscribed_students});

})


app.listen(5000)








