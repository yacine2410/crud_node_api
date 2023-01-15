//require('dotenv').config();
//environment variables
//let EMAIL_USER = process.env.EMAIL_USER;
//let EMAIL_PASS = process.env.EMAIL_PASS;
//let USERNAME_ADMIN = process.env.USERNAME_ADMIN;
//let PASSWORD_ADMIN = process.env.PASSWORD_ADMIN;

const EMAIL_USER = "IT325project@gmail.com";
const EMAIL_PASS = "IT325project@Yacine";

const mysql = require("mysql");
const express = require("express");
var methods = require("./methodTokens");
var app = express();
let jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
var bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Verify token function for employee login
function verifyToken(req, res, next) {
  const token = req.headers['x-access-token'];
  if (!token) {
    return res.status(401).send({ auth: false, message: 'No token provided.' });
  }

  jwt.verify(token, 'secretkey', function(err, decoded) {
    if (err) {
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    }
    if(decoded.EmpID != req.params.EmpID){
      return res.status(401).send({ auth: false, message: 'Unauthorized access.' });
    }
    req.EmpID = decoded.EmpID;
    next();
  });
}

var mysqlConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "employeeDB1",
  port: "3000",
  multipleStatements: true,
});

mysqlConnection.connect((err) => {
  if (!err) console.log("DB connection succeded");
  else {
    console.log("DB conncection failed");
    console.log(err);
  }
});

//Administrator login, Access token generation and refreshment
//const username = USERNAME_ADMIN;
//const password = PASSWORD_ADMIN;
const username = "yacine_montacer";
const password = "kScJM2Hf5_TV?hN-";
app.post("/", (req, res, next) => {
  let p_username = req.body.username;
  let p_password = req.body.password;
  if (p_username == username && p_password == password) {
    var token = jwt.sign(
      { username: username },
      "secretkey",
      { expiresIn: "15m" },
      (err, token) => {
        res.send({
          ok: true,
          token: token,
          message: "Login successful",
        });
      }
    );
    // Refresh token after 10 minutes
    setTimeout(() => {
      var newToken = jwt.sign(
        { username: username },
        "secretkey",
        { expiresIn: "15m" }
      );
      res.send({
        ok: true,
        token: newToken,
        message: "Token refreshed",
      });
    }, 600000);
  } else {
    res.send({
      ok: false,
      message: "Username or password incorrect",
    });
  }
});

// Get all the employees

app.get("/employees", methods.ensureToken, (req, res) => {
  mysqlConnection.query("SELECT * FROM employee", (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

// Get an employee

app.get("/employees/:id", methods.ensureToken, (req, res) => {
  //   console.log(req.params.id);
  mysqlConnection.query(
    "SELECT * FROM employee WHERE EmpID = ?",
    [req.params.id],
    (err, rows, fields) => {
      if (!err) res.send(rows);
      else console.log(err);
    }
  );
});

// Delete an employee

app.delete("/employees/:id", methods.ensureToken, (req, res) => {
  //   console.log(req.params.id);
  mysqlConnection.query(
    "DELETE FROM employee WHERE EmpID = ?",
    [req.params.id],
    (err, rows, fields) => {
      if (!err) res.send("Deleted successfully");
      else console.log(err);
    }
  );
});

//Insert an employee

app.post("/employees", (req, res) => {
  let emp = req.body;
  var sql =
    "INSERT INTO employee (EmpID, FirstName, LastName, EmpCode, Salary, DaysOff, email, phone, job_title, dept_name) VALUES ( ?,?,?,?,?,?,?,?,?,?)";
  mysqlConnection.query(
    sql,
    [emp.EmpID, emp.FirstName, emp.LastName,  emp.EmpCode, emp.Salary, emp.DaysOff, emp.email, emp.phone, emp.job_title, emp.dept_name],
    (err, rows, fields) => {
      if (!err) res.send("employee Inserted ");
      else console.log(err);
    }
  );
});

//Update an employee
app.put("/employees", (req, res) => {
  let emp = req.body;
  var sql =
    "UPDATE employee SET FirstName = ?, LastName = ?, EmpCode = ?, Salary = ?, DaysOff = ?, email = ?, phone = ?, job_title = ?, dept_name = ? WHERE EmpID = ?";
  mysqlConnection.query(
    sql,
    [emp.FirstName, emp.LastName, emp.EmpCode, emp.Salary, emp.DaysOff, emp.email, emp.phone, emp.job_title, emp.dept_name, emp.EmpID],
    (err, rows, fields) => {
      if (!err) res.send("employee Updated ");
      else console.log(err);
    }
  );
});

//Book days off for an employee
app.get('/check-days-off', (req, res) => {
  const EmpID = req.body.EmpID;
  const daysOff = req.body.daysOff;

  // Check if employee has enough days off available
  mysqlConnection.query(`SELECT DaysOff FROM employee WHERE EmpID = ${EmpID}`, (error, results) => {
    if (error) {
      res.status(500).send(error);
    } else {
      const employeeDaysOff = results[0].DaysOff;
      if (employeeDaysOff >= daysOff) {
        // Employee has enough days off, so deduct days off taken
        mysqlConnection.query(`UPDATE employee SET DaysOff = DaysOff - ${daysOff} WHERE EmpID = ${EmpID}`, (error) => {
          if (error) {
            res.status(500).send(error);
          } else {
            res.send(`Successfully deducted ${daysOff} days off from employee with EmpID ${EmpID}.`);
          }
        });
      } else {
        // Employee does not have enough days off
        res.send(`Employee with EmpID ${EmpID} does not have enough days off available.`);
      }
    }
  });
});

//Get employee's supervisor
app.get('/employee-supervisor', (req, res) => {
  const EmpID = req.body.EmpID;
  
  // Get selected employee's information
  mysqlConnection.query(`SELECT FirstName, LastName, email, phone, job_title FROM employee WHERE EmpID = ${EmpID}`, (error, employeeResults) => {
    if (error) {
      res.status(500).send({ error: error });
    } else {
      if(employeeResults[0].JobTitle == "manager")
      {
        res.send({ message: `The selected employee ${employeeResults[0].FirstName} ${employeeResults[0].LastName} is the Manager and has no supervisor.` });
      }else
      {
        mysqlConnection.query(`SELECT dept_name FROM employee WHERE EmpID = ${EmpID}`, (error, deptResults) => {
          if (error) {
            res.status(500).send({ error: error });
          } else {
            const dept_name = deptResults[0].dept_name;
            mysqlConnection.query(`SELECT dept_head FROM departments WHERE dept_name = "${dept_name}"`, (error, supervisorResults) => {
              if (error) {
                res.status(500).send({ error: error });
              } else {
                const supervisorEmpID = supervisorResults[0].dept_head;
                mysqlConnection.query(`SELECT FirstName, LastName, email, phone, job_title FROM employee WHERE EmpID = ${supervisorEmpID}`, (error, supervisorInfo) => {
                  if (error) {
                    res.status(500).send({ error: error });
                  } else {
                    res.send({
                      employee: {
                        name: `${employeeResults[0].FirstName} ${employeeResults[0].LastName}`,
                        email: employeeResults[0].email,
                        phone: employeeResults[0].phone,
                        job_title: employeeResults[0].job_title
                      },
                      supervisor: {
                        name: `${supervisorInfo[0].FirstName} ${supervisorInfo[0].LastName}`,
                        email: supervisorInfo[0].email,
                        phone: supervisorInfo[0].phone,
                        job_title: supervisorInfo[0].job_title
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    }
  });
});

//Display projects assigned to each departments 
app.post('/projects-by-dept', (req, res) => {
  const dept_id = req.body.dept_id;

  mysqlConnection.query(`SELECT dept_name, dept_head FROM departments WHERE dept_id = ${dept_id}`, (error, deptResults) => {
    if (error) {
      res.status(500).send(error);
    } else {
      const dept_name = deptResults[0].dept_name;
      const dept_head = deptResults[0].dept_head;
      mysqlConnection.query(`SELECT project_name, start_date, end_date, EmpID FROM projects WHERE dept_id = ${dept_id}`, (error, projectResults) => {
        if (error) {
          res.status(500).send(error);
        } else {
          if(projectResults.length == 0)
          { 
            res.send(`There are no projects assigned to department with id ${dept_id}`);
          }else
          {
            let projects = "";
            projectResults.forEach((project) => {
              const EmpID = project.EmpID;
              mysqlConnection.query(`SELECT FirstName, LastName, Email, Phone, job_title FROM employee WHERE EmpID = ${EmpID}`, (error, empResults) => {
                if (error) {
                  res.status(500).send(error);
                } else {
                  const emp_name = empResults[0].FirstName + " " + empResults[0].LastName;
                  const emp_email = empResults[0].Email;
                  const emp_phone = empResults[0].Phone;
                  const emp_job_title = empResults[0].job_title;
                  projects += `Project Name: ${project.project_name}, Start Date: ${project.start_date}, End Date: ${project.end_date}, Assigned Employee: ${emp_name}, Email: ${emp_email}, Phone: ${emp_phone}, Job Title: ${emp_job_title}`;
                  if (projectResults.indexOf(project) === projectResults.length - 1) {
                    mysqlConnection.query(`SELECT FirstName, LastName FROM employee WHERE EmpID = ${dept_head}`, (error, headResults) => {
                      if (error) {
                        res.status(500).send(error);
                      } else {
                        const head_name = headResults[0].FirstName + " " + headResults[0].LastName;
                        res.send(`Department: ${dept_name}, Head: ${head_name}, Projects: ${projects}`);
                      }
                    });
                  }
                }
              });
            });
          }
        }
      });
    }
  });
});

//Change password for an employee: Store hashed and salted version on the database
app.post('/set-password', (req, res) => {
  const EmpID = req.body.EmpID;
  const plainPassword = req.body.password;
  const saltRounds = 10;

  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(plainPassword, salt, function(err, hashedPassword) {
      mysqlConnection.query(`UPDATE employee SET password = '${hashedPassword}' WHERE EmpID = ${EmpID}`, (error, result) => {
        if (error) {
          res.status(500).send(error);
        } else {
          res.status(200).send(`Password for employee with EmpID ${EmpID} has been set successfully!`);
        }
      });
    });
  });
});

//employee log-in, token, edit personal information & notification email
// login endpoint
app.post('/login', (req, res) => {
  const email = req.body.email;
  const plainPassword = req.body.password;

  mysqlConnection.query(`SELECT EmpID, password FROM employee WHERE email = '${email}'`, (error, results) => {
    if (error) {
      res.status(500).send(error);
    } else if (results.length > 0) {
      const hashedPassword = results[0].password;
      bcrypt.compare(plainPassword, hashedPassword, function(err, passwordMatch) {
        if (passwordMatch) {
          const EmpID = results[0].EmpID;
          const token = jwt.sign({EmpID: EmpID}, 'secretkey', { expiresIn: '24h' });
          
          // send notification email
          let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: EMAIL_USER,
              pass: EMAIL_PASS
            }
          });
          let mailOptions = {
            from: EMAIL_USER,
            to: email,
            subject: 'Successful login',
            text: 'You have successfully logged in to your account.'
          };
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              res.status(500).send(error);
            } else {
              res.status(200).send({ auth: true, token: token });
            }
          });
        } else {
          res.status(401).send({ auth: false, message: 'Invalid email or password' });
        }
      });
    } else {
      res.status(401).send({ auth: false, message: 'Invalid email or password' });
    }
  });
});

// update endpoint
app.put('/employee',verifyToken, (req, res) => {
  const EmpID = req.body.EmpID;
  const { FirstName, LastName, email, phone } = req.body;

  mysqlConnection.query(
    `UPDATE employee SET FirstName = '${FirstName}', LastName = '${LastName}', email = '${email}', phone = '${phone}' WHERE EmpID = ${EmpID}`,
    (error, result) => {
      if (error) {
        res.status(500).send(error);
      } else {
        // send notification email
        let transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS
          }
        });
        let mailOptions = {
          from: 'EMAIL_USER',
          to: email,
          subject: 'Successful update',
          text: 'You have successfully updated your personal information.'
        };
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            res.status(500).send(error);
          } else {
            res.status(200).send(`Employee with EmpID ${EmpID} has been updated!`);
          }
        });
      }
    }
  );
});


app.listen(3550, () =>
  console.log("Express server is running at port no : 3550")
);
