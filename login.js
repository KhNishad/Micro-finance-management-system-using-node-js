// var mysql = require('mysql')
// var con = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'mydb'
// })
// // set up routing and view 
// app.set('view-engine', 'ejs')


// app.get('/login',(req,res) =>{
//     res.render('login.ejs')

// })


// app.post('/login',(req,res) => {

//     var email = req.body.lemail;
//     console.log(email);
    
//     var password = req.body.lpass;
//     con.query('SELECT * FROM users WHERE email = ?', [email], function (error, results, fields) {
//         if (error) {
//             // console.log("error ocurred",error);
//             res.send({
//                 "code": 400,
//                 "failed": "error ocurred"
//             })
//         } else {
//             // console.log('The solution is: ', results);
//             if (results.length > 0) {
//                 if (results[0].pass == password) {
//                     res.redirect('/index')
//                 }
//                 else {
//                     res.send({
//                         "code": 204,
//                         "success": "Email and password does not match"
//                     });
//                 }
//             }
//             else {
//                 res.send({
//                     "code": 204,
//                     "success": "Email does not exits"
//                 });
//             }
//         }
//     });

// });
             

