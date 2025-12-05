import { createConnection } from 'mysql';

var con = createConnection({
  host: "Tuckers-PC",
  user: "musicuser",
  password: "Password123!",
  database: "musicdb"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

const sql = 'SELECT * FROM test';
  con.query(sql, (error, results) => {
    if (error) throw error;
    console.log('Query Results:', results);
  });

  // Close the connection
con.end();