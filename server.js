const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
var dateFormat = require('dateformat');
let ejs = require('ejs');
fs = require('fs');
const bcrypt = require('bcrypt');


app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}));
// creating authentication 
var auth = function (req, res, next) {
    if (req.session && req.session.user && req.session.admin)
        return next();
    else
        var msg = "You have to login first"
        return res.redirect('/login');
};
// logout destoriying session
app.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/login');
});

// body perser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));


// img uploading 
const storage = multer.diskStorage({
destination:'./public/uploads/',
filename:function (req,file,cb) {
cb(null,file.originalname);

}
})

const upload = multer({
storage : storage
}).single('img');


// making pdf
let pdf = require("html-pdf");

 
// database
var mysql = require('mysql');
var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mydb'
})


// set up routing and view 
app.set('view-engine', 'ejs')

// render login
app.get('/', (req , res) => {
    res.render('login.ejs', { name:'NID' })
})

app.get('/login',(req,res) =>{
    res.render('login.ejs')

})


app.post('/login',(req,res) => {

    var email = req.body.lemail;
   // console.log(email);
    
    var password = req.body.lpass;
    con.query('SELECT * FROM users WHERE email = ?', [email], function (error, results, fields) {
        if (error) {
            // console.log("error ocurred",error);
            res.send({
                "code": 400,
                "failed": "error ocurred"
            })
        } else {
            // console.log('The solution is: ', results);
            // future date creation
            //var date2 = new Date((new Date()).getTime() + (2 * (30 * 86400000)))
           
            
            if (results.length > 0) {
                if (results[0].pass == password) {
                    req.session.user = "yes";
                    req.session.admin = true;
                    res.redirect('/index');
                }
                else {
                    var id = "password not match";
                    res.redirect('/notifi/' + id);

                  }
            }
            else {
                var id = "email not exits";
                res.redirect('/notifi/' + id);
            }
        }
    });

});
             
// render notifi
app.get('/notifi/:id',(req,res)=>{
    var id  = req.params.id;
   // console.log(id);
    
     var data = 
     {
         msg: id
     }
    var data = { data: data }
    res.render("notifi.ejs", data);
})

//render  registration

app.get('/register',(req, res) => {
    res.render('register.ejs')

})
// request from the register page handle and sending to database
app.post('/register', (req,res) => {
    // sending all data as object

    var time = dateFormat(new Date(), "yyyy-mm-dd");
 
    var email = req.body.email;
    const data = {
        "name" : req.body.name,
        "email" : req.body.email,
        "father_name": req.body.father,
        "likee": req.body.like,
        "pass": req.body.password,
         time
        
    }
    con.query(`SELECT * FROM  users WHERE email = '${email}'`, data, function (error, results, fields) {
        if (error) {
            throw(error);
        } else{
           // console.log(results);
            
            if(results[0])
            {
                var id = "Email Already Exits";
                var data = {
                    msg : id
                }
                res.redirect("/notifi/" + id);
            }
            else{
                con.query('INSERT INTO users SET ?', data, function (error, results, fields) {
                    if (error) throw res.redirect("/register");

                    res.redirect("/login")
                });
            }
        }
        
        
    });
//    query for inserting data
   
});

//render index file
app.get('/index', auth,  (req, res) => {
    // res.render('index.ejs')
     let datee = new Date((new Date()).getTime());
     datee = datee.toISOString().slice(0, 10)
   // console.log(datee);
    

    con.query(`SELECT COUNT(Time) as  t FROM schedule WHERE Time = '${datee}' AND status = 'unpaid'`, function (err, result) {

        if (err) {
            throw err;
        } else {
            obj = { print: result };
            //console.log(result);
            
            res.render('index.ejs', obj);
        }
    })

})
//render sceheme file
app.get('/scheme', auth, (req, res) => {
    res.render('scheme.ejs',{print : "nid"})

});



// customer registration

// sending data from database to dropdowns

app.get('/cus_register',auth, (req, res) => {
    // res.render('cus_register.ejs');


    var obj = {};
    con.query('SELECT * FROM scheme', function (err, result) {

        if (err) {
            throw err;
        } else {
            obj = { print: result };
            res.render('cus_register.ejs',obj);
        }
    })

})
// customer id in loan
// customer registertion

app.post('/cus_register',auth, (req, res) => {

    // img
    upload(req, res, (error) => {
        if (error) {
            res.render(error)
        }
        else {
//console.log(req.file.originalname);
            var img = req.file.originalname;
            //console.log(img);
               
        }
    // sending all data as object
    var date = dateFormat(new Date(), "yyyy-mm-dd");
    var cus_name = req.body.name;
    var scheme_id = req.body.scheme;
    var cus_asset_price = req.body.p_asset;

// query for required asset 

    con.query(`select * from scheme where scheme_id = '${scheme_id}'`, function (error, results) {
        if (error){
            res.send(error)
        }
        else{
          var scheme_amount = results[0].amount;
          var asset = results[0].r_asset;
          var scheme_name = results[0].name;
          var amount = results[0].amount;
          var no_installment = results[0].no_installment;
          var installment_amount = Math.round(amount/no_installment);
          var duration  = results[0].duration;
           
        }
        // customer data object
    
        const data = {
            "cus_name": req.body.name,
            "cus_contact": req.body.contact,
            "cus_address": req.body.address,
            "cus_asset": req.body.asset,
            "asset_price": req.body.p_asset,
            "scheme_id": req.body.scheme,
            "scheme_name":scheme_name,
            "scheme_amount": scheme_amount,
            "installment_amount": installment_amount,
            "img": img,
            date

        }
        
    
        
        if(cus_asset_price >= asset)
        {
             var time1 = dateFormat(new Date(), "yyyy-mm-dd");

          //  query for inserting data in loan_info
           
            //    query for inserting data in customer
            con.query('INSERT INTO customer SET ?', data, function (error, results, fields) {
                if (error) throw res.send(error)
                

                //res.redirect("/index");
            });
            
        //  insert into loan_info table
            con.query(`INSERT INTO loan_info (scheme_id, scheme_amount, remaining_amount, installment_no, installment_remaining,installment_amount, date) VALUES ('${scheme_id}','${amount}','${amount}','${no_installment}','${no_installment}','${installment_amount}','${time1}')`, function (error, results, fields) {
                if (error) throw res.send(error)
                

                // res.redirect("/index");
            });
        
            }
        else{
            res.send({
               
                "Failed": "Your asset not Enough"
            });
        }
    //  make shesule of customer
    con.query('SELECT * FROM  customer ORDER by cus_id DESC LIMIT 1',function (err,results) {
        if(err)
        {
            throw res.send(err)
        }
        else{
            
            let cus_id = results[0].cus_id;
            let name = results[0].cus_name;
            let status  = "unpaid";
            
        //   creating wekly and monthly time
           if(duration =='week')
           {
             var   time_slot = 7;
           }
           else if (duration == 'month')
           {
             var  time_slot = 30;
           }
            
            for (var i = 1; i <= no_installment; i++) {
                var date2 = new Date((new Date()).getTime() + (i * (time_slot * 86400000)))

              //  console.log(date2);
             
                con.query(`INSERT INTO schedule (install_no,cus_id,cus_name,Time,status) VALUES ('${i}','${cus_id}','${name}','${date2.toISOString().slice(0, 10)}','${status}')`, function (error, results, fields) {
                    if (error) throw res.send(error)

                });

            }
            res.redirect("/profile/" + cus_id)

        }
       
    })
    })
  
        
    });
   
});
  
// add schemes
app.post('/scheme', auth, (req, res) => {
    // sending all data as object
    if (req.body.scheme_id){
     updateScheme(req,res);
    }else{
        var date = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
        var amount = req.body.Amount;
        var install = req.body.instl;
        var install_amount = Math.round(amount / install);

        const data = {
            "name": req.body.name,
            "Amount": req.body.Amount,
            "r_asset": req.body.r_asset,
            "no_installment": req.body.instl,
            "install_amount": install_amount,
            "duration": req.body.Duration,
            date

        }
        //    query for inserting data
        con.query('INSERT INTO scheme SET ?', data, function (error, results, fields) {
            if (error) throw res.send(error)
            res.redirect("/scheme_view");

        });
    }
  
});

// function for updating the scheme
function updateScheme(req,res) {
  //  console.log(req.body);
    
    var id = req.body.scheme_id;
    var name = req.body.name;
    var amount = req.body.Amount;
    var r_asset = req.body.r_asset;
    var no_installment = req.body.instl;
    var duration = req.body.Duration;
    // "scheme": req.body.scheme,


    con.query(`UPDATE scheme SET name = '${name}', amount = '${amount}', r_asset = '${r_asset}', no_installment = '${no_installment}', duration = '${duration}' WHERE scheme_id = ${id}`, function (error, results) {
        if (error) throw res.send(error);
        res.redirect("/view_scheme");
    })
    
}


// render view_scheme 
app.get("/view_scheme", auth, (req, res) => {
    //   res.render('cus_view.ejs')
    // send data from databse to table
    var view_scheme= {};
    con.query('SELECT * FROM scheme', function (error, result) {
        
        if (error) {
            throw error;
        } else {
           // console.log(result);
            
            view_scheme = { print: result };
            res.render('view_scheme.ejs', view_scheme);
        }
    });
});

// send data from database to scheme page for update 
app.get('/scheme_action/:id', auth, function (req, res) {

    // console.log(req.params.id);
    let Id = req.params.id;
    if (req.params.id) {
        var customerEdit = {}
       
        con.query(`SELECT * FROM scheme WHERE scheme_id = ${Id}`, function (error, result) {

            if (error) {
                throw error;
            } else {

                // customerEdit = results;
                //console.log(result[0].RowDataPacket); 
                schemeEdit = { print: result };
                //console.log(customerEdit.print[0].cus_name);

                res.render('scheme.ejs', schemeEdit)

            }
        })

    }
})

// delete scheme 

app.get('/delete_scheme/:id', auth, (req, res) => {
    // sending all data as object

    var did = req.params.id;
    console.log(did);
    
    // console.log(did);
    con.query(`select * from loan_info where scheme_id = ${did}`, function (error, results) {
        if (error) {
            throw error;
        }
        else {
            if(results.length > 0 )
            {
                res.send('Can not delete. This scheme is active')
               
            }
            else{
                con.query(`delete from scheme where scheme_id = ${did}`, function (error, results) {
                    if (error) {
                        throw error;
                    }
                    else {
                        // window.alert("Deleted Successfully")
                        res.redirect("/view_scheme")
                    }


                })

            }
            
        }

    
    })
})


// view customer details in table 
// render cus_view page 
app.get("/cus_view", auth, (req,res) => {
//   res.render('cus_view.ejs')
//console.log(req.body.search);
 
    if (req.body.search)
{

}else{
    var obj2 = {};
    con.query('SELECT * FROM customer', function (err, result) {

        if (err) {
            throw err;
        } else {


            obj2 = { print: result };
            res.render('cus_view.ejs', obj2);
        }
    });
}
   


});




// sending data from database to customer edit form
app.get('/action/:id', auth, function (req, res) {
   
    //console.log(req.params.id);
    let editId = req.params.id;
    if(req.params.id)
    {
        var customerEdit = {};
       // var dropdown = {};
        con.query(`SELECT * FROM customer WHERE cus_id = ${editId}`, function (err, result) {

            if (err) {
                throw err;
            } else {
                
                // customerEdit = results;
                
                customerEdit = { print: result }; 
                //console.log(result);
                
                //console.log(customerEdit.print[0].cus_name);

                res.render('action.ejs', customerEdit)      

            }
        })
        
       

    }
})

// sending data from edit form to database
// edit customer info
app.post('/action', auth, (req, res) => {
    // sending all data as object
   
    
      // console.log(req.params.id);
    //var date = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
        var id  = req.body.id;
        var name  = req.body.name;
        var contact  =  req.body.contact;
          var address = req.body.address;
        //  var asset =  req.body.asset;
        // var asset_price =  req.body.p_asset;
       // "scheme": req.body.scheme,
        
    
    con.query(`UPDATE customer SET cus_name= '${name}', cus_contact = '${contact}', cus_address = '${address}'  WHERE cus_id = ${id}`, function (error, results) {
        if (error) throw error;
        res.redirect("/cus_view")
    })
})

// deleting customer record

app.get('/delete/:id', auth, (req, res) => {
    // sending all data as object

    var did = req.params.id;
   // console.log(did);
    
    con.query(`delete from customer where cus_id = ${did}`, function (error, results) {
        if (error) 
        {
            throw error;
        } 
        else{
            // window.alert("Deleted Successfully")
            res.redirect("/cus_view")
        }
        
        
    })
})

// customer view info
app.get('/info/:sid/:cid', auth,(req,res)=>{
    let cusID = req.params.cid;
    let sid = req.params.sid;
    if (req.params.sid) {
        var loanInfo = {};
        let cusname = {};
        // var dropdown = {};
        con.query(`SELECT * FROM loan_info WHERE cus_id = ${cusID}`, function (err, result) {

            if (err) {
                throw err;
            } else {
                    // console.log(result[0].name);
                    
                // customerEdit = results;
                // <%=print[0].name%>
                loanInfo = { print: result };
                //  console.log(result);
                 res.render('cus_loan_view.ejs', loanInfo)
             
            }
        })

    }
})
// get customer name


// send data from database to the table of view_loan
app.get("/view_loan", auth, (req, res) => {
    //   res.render('cus_view.ejs')
    var obj3 = {};
    var customer ={};
    con.query('SELECT customer.cus_id, customer.cus_name, scheme.scheme_id, scheme.name, scheme.amount, scheme.no_installment, loan_info.remaining_amount, loan_info.installment_remaining,loan_info.installment_amount,loan_info.date FROM((scheme INNER JOIN customer ON scheme.scheme_id = customer.scheme_id) INNER JOIN loan_info ON customer.cus_id = loan_info.cus_id)', function (err, result) {

        if (err) {
            throw err;
        } else {
       // console.log(result);
            obj3 = { print: result };
            res.render('view_loan.ejs', obj3);
        }
        // con.query('select * from customer',function (error,results,fields) {
        //     if(error) {
        //         res.send(error);
        //     }
        //     else{
        //         obj3 = { print1: result };
        //         res.render('view_loan.ejs', obj3);
        //     }
            
        // })
    });


});

//render installment module
app.get('/installment', auth,function (req,res) {
    res.render('installment.ejs',{print : "hey"});
    
})

// installment taking from html form
app.post('/installment', auth,function (req,res) {
    
    var cusID = req.body.ID ;
    var time = req.body.time;
    var amount = req.body.amount;
    
    
   
//    update loan information after installment
    con.query(`SELECT * FROM loan_info WHERE cus_id = ${cusID}`,function (error, results, fields) {
        if (error)
        {
            throw res.send(error)
        }
        else{
            
            // updating remaining amount
            // console.log(results[0].cus_id);
            var remaining = 0;
            var cus_amount = results[0].remaining_amount;
            var installment_amount = req.body.amount;
            var remaining = Math.round(cus_amount - installment_amount);
            // console.log(remaining);
            // updating installment no
           
            var remaining_install = results[0].installment_remaining;
            remaining_install = remaining_install -1;
             if(remaining > 0)
             {
                 var status = "On Time";
             }
             
            //  finding installment no
            let install_no  = (results[0].installment_no) - (results[0].installment_remaining);

           // console.log(results[0].installment_no);
            
            
            install_no = install_no+1;
           //  console.log(install_no);
           //  console.log(cusID);
            
            //  compring time 
        con.query(`SELECT * FROM schedule WHERE install_no = ${install_no} and cus_id = ${cusID}`, function (error, results, fields) {
                if (error) {
                    throw res.send(error)
                }
                else{
                    var date1 = new Date(results[0].Time);
                    var date2 = new Date(req.body.time); 
                    var schedule_date = new Date(results[0].Time);
                    schedule_date = schedule_date.toISOString().slice(0, 10)
                    
                    
                  
               var  tim2 =    date2.toISOString().slice(0, 7)
                 var   tim  =  date1.toISOString().slice(0, 7);
                // console.log(tim);
                // console.log(tim2);
                
                    
                    if(results[0].Time < time)
                    {
                        if(tim2 > tim && remaining_install > 1 ){
                            status  = "Delayed";
                            var amount1 = req.body.amount;
                            var fine  = Math.round((amount1*2)/100);
                            amount = Math.round(amount*1)+(amount**1);
                            remaining_install = remaining_install - 1;
                            remaining = Math.round(cus_amount - amount);
                        }else{
                            status = "Late";
                           fine = 50;
                        }
                
                        
                        //  show an alert
                    }
                    else{
                       fine  = 0;
                    }
                }
            const data = {
                "cus_id": req.body.ID,
                "amount": amount,
                "remaining": remaining,
                "status": status,
                "fine": fine,
                ins_date: req.body.time,
                schedule_date: schedule_date
            }
            con.query('INSERT INTO installment SET ?', data, function (error, results, fields) {
                if (error) throw res.send(error);
                 
            })
            // updating the schedule status
            if (status == "Delayed" && remaining_install > 0) {
                var loop = 2;
            }
            else {
                var loop = 1;
            }
           // console.log(loop);
            
            for (var i = 1; i <= loop; i++) {
                con.query(`UPDATE schedule SET status = 'paid' WHERE cus_id = '${cusID}' AND install_no = '${install_no}'`, function (error, results) {
                    if (error) throw res.send(error);
                    
                })
                install_no++;

            }

            con.query(`UPDATE loan_info SET remaining_amount= '${remaining}', installment_remaining= '${remaining_install}'  WHERE cus_id = ${cusID}`, function (error, results) {
                if (error) throw  res.send(error);
               res.redirect("/invoice/ " + cusID);
            })
                
          


        }) 
        }
    })

    
})

// generate invoice
app.get('/invoice/:id', auth, (req, res) => {
    // sending all data as object

    var did = req.params.id;
   // console.log(did);
    
    // console.log(did);
     var invoice ={};
    con.query(`SELECT  customer.cus_id,customer.cus_name,customer.cus_address,customer.cus_contact,customer.scheme_name,customer.scheme_amount,customer.scheme_id,customer.installment_amount,customer.img,installment.install_id,installment.amount,installment.remaining,installment.status,installment.fine,customer.date,installment.ins_date,installment.schedule_date FROM customer INNER JOIN installment ON customer.cus_id = installment.cus_id  where customer.cus_id = ${did}`, function (error, result) {
        if (error) {
            throw error;
        }
        else { 
          // console.log(result);
           
            
             invoice = { print: result };
            //  console.log(result);
             
         
            res.render('invoice.ejs', invoice)
        }


    })
})

//installments pay from loan page
app.get('/installment2/:id', auth, function (req, res) {

    // console.log(req.params.id);
    let Id = req.params.id;
    if (req.params.id) {
         
        con.query(`SELECT * FROM loan_info WHERE cus_id = ${Id}`, function (error, result) {

            if (error) {
                throw error;
            } else {

                // customerEdit = results;
                //console.log(result[0].RowDataPacket); 
                schemeEdit = { print: result };
                //console.log(customerEdit.print[0].cus_name);

                res.render('installment.ejs', schemeEdit);

            }
        })

    }
})
// search option

app.post('/search', auth, function (req, res) {
    var id = req.body.search;
    //console.log(did);
    res.redirect("/search/ " + id);

})

app.get('/search/:id', function (req, res) {
    var id = req.params.id;
    //console.log(id);
    con.query(`select * from customer where cus_id = ${id}`,function (error,results) {
        if(error) 
        {
            res.send(error)
        }
        else{
            
            obj2 = { print: results };
            res.render('search.ejs', obj2);
        }
        
    })
    
})
// loan_info serch option
app.post('/search2', function (req, res) {
    var id = req.body.search;
    //console.log(did);
    res.redirect("/loan_search/ " + id);

})
app.get('/loan_search/:id', function (req, res) {
    var id = req.params.id;
    //console.log(id);
    con.query(`SELECT customer.cus_id, customer.cus_name, customer.scheme_id, customer.scheme_name, customer.scheme_amount, loan_info.installment_no, loan_info.remaining_amount, loan_info.installment_remaining,loan_info.installment_amount,loan_info.date FROM customer INNER JOIN loan_info ON customer.cus_id = loan_info.cus_id where customer.cus_id = ${id}`, function (error, results) {
        if (error) {
            res.send(error)
        }
        else {

            obj2 = { print: results };
            res.render('loan_search.ejs', obj2);
        }

    })

})
//profile of the customer
app.get('/profile/:id',function (req,res) {
     var id  = req.params.id;
     //console.log(id);
     
    con.query(`SELECT t.cus_id,t.cus_name,t.cus_contact,t.cus_address,t.cus_asset,t.asset_price,t.date,t.scheme_id,t.scheme_name,t.scheme_amount,t.installment_amount,t.date,t.img, tr.Time FROM customer t, schedule tr WHERE t.cus_id = tr.cus_id AND tr.cus_id  =  ${id}`, function (err, result) {

        if (err) {
            res.send(err);
        } else {
          
            cusInfo = { print: result };
            //  console.log(result);
            
            
            res.render('profile.ejs', cusInfo);

        }
    })
    
});

// forgot password
app.get('/forgot', (req, res) => {
    res.render('forgot.ejs')

})
app.post('/forgot', (req, res) => {
    
    var father = req.body.father;
    var like = req.body.like;
   
    con.query(`select pass from users where father_name = '${father}' and likee  = '${like}'`, function (error, results) {
        if (error){
            res.send(error);
        }
        var pass = results[0].pass;
        res.send("Your Password was " +pass)
    })
})

// header
// app.get('/header',(req,res)=>{
//     res.render('header.ejs');
// });
// generate pdf for profile

app.get("/generateReport/:id",auth, (req, res) => {
 var id  = req.params.id;

 
    con.query(`SELECT t.cus_id,t.cus_name,t.cus_contact,t.cus_address,t.cus_asset,t.asset_price,t.date,t.scheme_id,t.scheme_name,t.scheme_amount,t.installment_amount,t.date,t.img, tr.Time FROM customer t, schedule tr WHERE t.cus_id = tr.cus_id AND tr.cus_id=  ${id}`, function (err, result) {

        if (err) {
            res.send(err);
        } else {
            var cus  = result[0].cus_name;
            var cus_id = result[0].cus_id;
          let  print = { print: result };

      
            ejs.renderFile(path.join(__dirname, './views/', "profile_pdf.ejs"), print, (err, data) => {
        if (err) {
            res.send(err);
        } else {
            let options = {
                "height": "11.25in",
                "width": "8.5in",
                "header": {
                    "height": "20mm"
                },
                "footer": {
                    "height": "20mm",
                },
            };
            pdf.create(data, options).toFile(`./pdf/${cus}_${cus_id}.pdf`, function (err, data) {
                if (err) {
                    res.send(err);
                } else {
                    res.redirect("/pdf/" + `${cus}_${cus_id}.pdf`);

                }
            });
        }
    });
        }
    })
})
// generate pdf for invoice
app.get("/generateReport_invoice/:id",auth, (req, res) => {
    var id = req.params.id;

    con.query(`SELECT  customer.cus_id,customer.cus_name,customer.cus_address,customer.cus_contact,customer.scheme_name,customer.scheme_amount,customer.scheme_id,customer.installment_amount,customer.img,installment.install_id,installment.amount,installment.remaining,installment.status,installment.fine,customer.date,installment.ins_date,installment.schedule_date FROM customer INNER JOIN installment ON customer.cus_id = installment.cus_id  where customer.cus_id = ${id}`, function (error, result) {
        if (error) {
            throw error;
        }
        else {
            
            var cus = result[0].cus_name;
            var cus_id = result[0].cus_id;
            let print = { print: result };
   
            ejs.renderFile(path.join(__dirname, './views/', "invoice_pdf.ejs"), print, (err, data) => {
                if (err) {
                    res.send(err);
                } else {
                    let options = {
                        "height": "11.25in",
                        "width": "8.5in",
                        "header": {
                            "height": "20mm"
                        },
                        "footer": {
                            "height": "20mm",
                        },
                    };
                    pdf.create(data, options).toFile(`./pdf/${cus}_${cus_id}.pdf`, function (err, data) {
                        if (err) {
                            res.send(err);
                        } else {
                            res.redirect("/pdf/" + `${cus}_${cus_id}.pdf` )
                        }
                    });
                }
            });
        }
    })
})
// sending pdf to browser

app.get('/pdf/:name', function (req, res) {
    var name = req.params.name;
    res.sendFile(__dirname + `/pdf/${name}`);
})

// today installments
app.get('/today',(req,res)=>{

    // let today = dateFormat(new Date(), "yyyy-mm-dd")
    var today = new Date((new Date()).getTime())
   today =  today.toISOString().slice(0, 10);
 
    //console.log(today);
    
    con.query(`SELECT * from schedule WHERE Time = '${today}' AND status = 'unpaid'`, function (error, results) {
        if (error) {
            res.send(error)
        }
        else {
           // console.log(results);
            
            obj2 = { print: results };
            res.render('today.ejs', obj2);
        }

    })

});




app.listen( process.env.port || 3000);
