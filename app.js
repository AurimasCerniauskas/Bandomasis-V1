const express = require("express");
const app = express();
const port = 3003;
app.use(express.json({ limit: '10mb' }));
const cors = require("cors");
app.use(cors());
const mysql = require("mysql");
const md5 = require('js-md5');
const uuid = require('uuid');
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(express.json());

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "bandomasis",
});


// LOGIN

// const doAuth = function(req, res, next) {
//   if (0 === req.url.indexOf('/server')) { // admin
//       const sql = `
//       SELECT
//       name, role
//       FROM users
//       WHERE session = ?
//   `;
//       con.query(
//           sql, [req.headers['authorization'] || ''],
//           (err, results) => {
//             req.headers['authorization']
//               if (err) throw err;
//               if (!results.length || results[0].role !== 10) {
//                   res.status(401).send({});
//                   req.connection.destroy();
//               } else {
//                   next();
//               }
//           }
//       );
//   } else if (0 === req.url.indexOf('/login-check') || 0 === req.url.indexOf('/login')) {
//       next();
//   } else { // fron
//       const sql = `
//       SELECT
//       name, role
//       FROM users
//       WHERE session = ?
//   `;
//       con.query(
//           sql, [req.headers['authorization'] || ''],
//           (err, results) => {
//               if (err) throw err;
//               if (!results.length) {
//                   res.status(401).send({});
//                   req.connection.destroy();
//               } else {
//                   next();
//               }
//           }
//       );
//   }
// }
// app.use(doAuth)

// AUTH
app.get("/login-check", (req, res) => {
  // let sql;
  // let requests;
  // if (req.query.role === 'admin') {
  //     sql = `
  //     SELECT
  //     name
  //     FROM users
  //     WHERE session = ? AND role = 10
  //     `;
  //     requests = [req.headers['authorization'] || '', req.query.role];
  //   } else if (req.query.role === 'user') {
  //     sql = `
  //     SELECT
  //     name
  //     FROM users
  //     WHERE session = ? AND (role = 10 OR role = 1)
  //     `;
  //     requests = [req.headers['authorization'] || ''];
  // }else {
  //     sql = `
  //     SELECT
  //     name
  //     FROM users
  //     WHERE session = ?
  //     `;
  //     requests = [req.headers['authorization'] || ''];
  // }
  const sql = `
      SELECT
      name, role
      FROM users
      WHERE session = ?  
  `;
  con.query(sql, [req.headers['authorization'] || ''], (err, result) => {
      if (err) throw err;
      if (!result.length) {
          res.send({ msg: 'error', status: 1 }); //uset not logged
      } else {
          if('admin' === req.query.role){
           if (result[0].role != 10){
            res.send({msg: 'error', status: 2}); //not an admin
           }else{
            res.send({ msg: 'ok', status: 3 }); // is admin
           }
          } else{
          res.send({ msg: 'ok', status: 4 }); //is user
          }
      }
  });
});


app.post("/login", (req, res) => {
  const key = uuid.v4();
  const sql = `
  UPDATE users
  SET session = ?
  WHERE name = ? AND passw = ?
`;
  con.query(sql, [key, req.body.user, md5(req.body.pass)], (err, result) => {
      if (err) throw err;
      if (!result.affectedRows) {
          res.send({ msg: 'error', key: '' });
      } else {
          res.send({ msg: 'ok', key });
      }
  });
});




// READ

app.get("/server/offer", (req, res) => {
  const sql = `
  SELECT *
  FROM offer
  ORDER BY id DESC
  `;
  con.query(sql, (err, result) =>{
    if(err) throw err;
    res.send(result);
  });
});

app.get("/server/donate", (req, res) => {
  const sql = `
  SELECT *
  FROM donate
  `;
  con.query(sql, (err, result) =>{
    if(err) throw err;
    res.send(result);
  });
});

app.get("/home/offer", (req, res) => {
  const sql = `
  SELECT o.*, d.name, d.suma, d.offer_id
  FROM offer AS o
  LEFT JOIN donate AS d
  ON d.offer_id = o.id
  ORDER BY o.left_sum DESC
  `;
  con.query(sql, (err, result) =>{
    if(err) throw err;
    res.send(result);
  });
});

// app.get("/server/all", (req, res) => {
//   const sql = `
//   SELECT c.id AS cid, c.title AS ct, m.*
//   FROM category AS c
//   INNER JOIN movies AS m
//   ON c.id = m.cat_id
//   `;
//   con.query(sql, (err, result) =>{
//     if(err) throw err;
//     res.send(result);
//   });
// });

//CREATE

app.post("/server/create", (req, res) => {
    const sql = `
    INSERT INTO offer (title, idea, goal_sum, image)
    VALUES (?, ?, ?, ?)
    `;
    con.query(sql, [req.body.title, req.body.idea, req.body.goal_sum, req.body.image], (err, result) =>{
      if(err) throw err;
      res.send(result);
    });
  });

  app.post("/server/donate", (req, res) => {
    const sql = `
    INSERT INTO donate (name, suma, offer_id)
    VALUES (?, ?, ?)
    `;
    con.query(sql, [req.body.name, req.body.suma, req.body.offer_id], (err, result) =>{
      if(err) throw err;
      res.send(result);
    });
  });


//Delete
app.delete("/server/offer/:id", (req, res) => {
  const sql = `
  DELETE FROM offer
  WHERE id = ?
  `;
  con.query(sql, [req.params.id], (err, result) =>{
    if(err) throw err;
    res.send(result);
  });
});


// Edit
app.put("/server/offer/:id", (req, res) => {
  const sql = `
  UPDATE offer
  SET isShow = ?
  WHERE id = ?
  `;
  con.query(sql, [req.body.isShow, req.params.id], (err, result) =>{
    if(err) throw err;
    res.send(result);
  });
});

app.put("/server/offer2/:id", (req, res) => {
  const sql = `
  UPDATE offer
  SET d_suma = d_suma + ?, left_sum = goal_sum - d_suma
  WHERE id = ?
  `;
  con.query(sql, [req.body.d_suma, req.params.id], (err, result) =>{
    if(err) throw err;
    res.send(result);
  });
});


app.listen(port, () => {
  console.log(`Electricity listening on port ${port}`)
});












// Edit
// app.put("/server/part/:id", (req, res) => {
//   const sql = `
//   UPDATE table1
//   SET title = ?
//   WHERE id = ?
//   `;
//   con.query(sql, [req.body.title, req.params.id], (err, result) =>{
//     if(err) throw err;
//     res.send(result);
//   });
// });

// app.put("/home/movie/:id", (req, res) => {
//   const sql = `
//   UPDATE movies
//   SET rating_sum = rating_sum + ?, rating_count = rating_count +1, rating = rating_sum / rating_count
//   WHERE id = ?
//   `;
//   con.query(sql, [req.body.rate, req.params.id], (err, result) =>{
//     if(err) throw err;
//     res.send(result);
//   });
// });

// app.put("/server/movies/:id", (req, res) => {
//   let sql;
//   let r;

//   if(req.body.deletePhoto){
//     sql = `
//     UPDATE movies
//     SET title = ?, price = ?, cat_id = ?, image = null
//     WHERE id = ?
//     `;
//     r = [req.body.title, req.body.price, req.body.cat, req.params.id];
//   } else if(req.body.image){
//     sql = `
//     UPDATE movies
//     SET title = ?, price = ?, cat_id = ?, image = ?
//     WHERE id = ?
//     `;
//     r = [req.body.title, req.body.price, req.body.cat, req.body.image, req.params.id];
//   } else{  sql = `
//   UPDATE movies
//   SET title = ?, price = ?, cat_id = ?
//   WHERE id = ?
//   `;
//   r = [req.body.title, req.body.price, req.body.cat, req.params.id];
// }
//   con.query(sql, r, (err, result) =>{
//     if(err) throw err;
//     res.send(result);
//   });
// });






























// //READ ALL

// app.get("/server/suppliers", (req, res) => {
//   const sql = `
//   SELECT *
//   FROM electricity_supplier
//   `;
//   con.query(sql, (err, result) =>{
//     if(err) throw err;
//     res.send(result);
//   });
// });

// app.get("/server/bills", (req, res) => {
//   const sql = `
//   SELECT b.*, name, surname, title, s.id AS sid
//   FROM bils AS b
//   INNER JOIN electricity_consumers AS c
//   ON b.consumer_id = c.id
//   INNER JOIN  electricity_supplier AS s
//   ON c.supplier_id = s.id
//   `; 
//   con.query(sql, (err, result) =>{
//     if(err) throw err;
//     res.send(result);
//   });
// });

// app.get("/server/all", (req, res) => {
//   const sql = `
//   SELECT c.*, s.id AS sid, title, price
//   FROM electricity_supplier AS s
//   INNER JOIN electricity_consumers AS c
//   ON c.supplier_id = s.id
//   `;
//   con.query(sql, (err, result) =>{
//     if(err) throw err;
//     res.send(result);
//   });
// });

// app.get("/server/consumers", (req, res) => {
//   const sql = `
//   SELECT *
//   FROM electricity_consumers
//   `;
//   con.query(sql, (err, result) =>{
//     if(err) throw err;
//     res.send(result);
//   });
// });

// app.delete("/server/suppliers/:id", (req, res) => {
//   const sql = `
//   DELETE FROM electricity_supplier
//   WHERE id = ?
//   `;
//   con.query(sql, [req.params.id], (err, result) =>{
//     if(err) throw err;
//     res.send(result);
//   });
// });

// app.delete("/server/consumers/:id", (req, res) => {
//   const sql = `
//   DELETE FROM electricity_consumers
//   WHERE id = ?
//   `;
//   con.query(sql, [req.params.id], (err, result) =>{
//     if(err) throw err;
//     res.send(result);
//   });
// });

// app.delete("/server/bills/:id", (req, res) => {
//   const sql = `
//   DELETE FROM bils
//   WHERE id = ?
//   `;
//   con.query(sql, [req.params.id], (err, result) =>{
//     if(err) throw err;
//     res.send(result);
//   });
// });

// //Edit

// app.put("/server/suppliers/:id", (req, res) => {
//   const sql = `
//   UPDATE electricity_supplier
//   SET title = ?, price = ? 
//   WHERE id = ?
//   `;
//   con.query(sql, [req.body.title, req.body.price,req.params.id], (err, result) =>{
//     if(err) throw err;
//     res.send(result);
//   });
// });

// app.put("/server/consumers/:id", (req, res) => {
//   const sql = `
//   UPDATE electricity_consumers
//   SET name = ?, surname = ?, counter_number = ?, supplier_id = ? 
//   WHERE id = ?
//   `;
//   con.query(sql, [req.body.name, req.body.surname, req.body.number, req.body.supplier,req.params.id], (err, result) =>{
//     if(err) throw err;
//     res.send(result);
//   });
// });