let express = require("express");
let app = express();
const cors = require("cors");
app.use(express.json());
// app.use(cors)
app.options("*", cors());
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow_Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept "
  );
  next();
});

const port = 2410;
app.listen(port, () => console.log(`Node app listening on port ${port}!`));

const { Client } = require("pg");
const connData = new Client({
  user: "postgres",
  password: "S9301122206y$",
  database: "postgres",
  port: 5432,
  host: "db.kahojerxyuqemlcuoupr.supabase.co",
  ssl: { rejectUnauthorized: false },
});
connData.connect(function (res, error) {
  console.log(`Connected!!!`);
});

app.get("/DeliveryBoy/Get-Employee", function (req, res, next) {
    console.log("Inside /DeliveryBoy/Get-Employee get api");
    const query = "select * from emps";
    let sdate = req.query.sdate;
    let fname = req.query.fname;
  
    connData.query(query, function (err, result) {
      // console.log(result.rows);
      if (err) res.status(404).send(err);
      else {

        if(fname){
          let Arr = fname.split(",");
          result.rows = result.rows.filter(st=> Arr.find((c1)=> c1===st.fname ));
      }
      if(sdate){
        result.rows = result.rows.filter(st => st.sdate===sdate);
      }
      
        res.send(result.rows);
      }
    });
  });

  app.post("/DeliveryBoy/Add-Employee", function (req, res, next) {
    console.log("Inside post of /DeliveryBoy/Add-Employee/");
    var values = Object.values(req.body);
    console.log(values);
    let sql = `insert into emps(fname,lname,dob,course,sdate,edate,salary,description) values($1,$2,$3,$4,$5,$6,$7,$8)`;
    connData.query(sql, values, function (err, result) {
      // console.log(result);
      if (err) res.status(404).send(err);
      else res.send(`${result.rowCount} insection successful`);
    });
  });

  app.put("/DeliveryBoy/update-Employee/:id", function (req, res, next) {
    console.log("Inside put of /DeliveryBoy/update-Employee/");
    let id = +req.params.id;
    let fname = req.body.fname;
    let lname = req.body.lname;
    let dob = req.body.dob;
    let course = req.body.course;
    let sdate = req.body.sdate;
    let edate = req.body.edate;
    let salary = req.body.salary;
    let description = req.body.description;
    let values = [fname,lname, dob, course, sdate, edate,salary, description, id];
    let sql = `update emps set fname=$1,lname=$2,dob=$3,course=$4,sdate=$5,edate=$6,salary=$7,description=$8 where id=$9`;
    connData.query(sql, values, function (err, result) {
      if (err) res.status(404).send(err);
      else res.send(`${result.rowCount} updation successful`);
    });
  });

  app.delete("/DeliveryBoy/delete-Employee/:id", function (req, res, next) {
    console.log("Inside delete of emps");
    let id = +req.params.id;
    let values = [id];
    let sql = `delete from emps where id=$1`;
    console.log(id);
    connData.query(sql, values, function (err, result) {
      console.log(sql, result);
      if (err) res.status(404).send(err);
      else res.send(`${result.rowCount} delete successful`);
    });
  });

  app.get("/DeliveryBoy/Get-Employee/:id", function (req, res, next) {
    console.log("Inside /DeliveryBoy/Get-Employee/:id get api");
    let id = +req.params.id;
    let values = [id];
    let sql = `select * from emps where id=$1`;
    connData.query(sql, values, function (err, result) {
      if (err) res.status(404).send(err);
      else res.send(result.rows);
    });
  });

  