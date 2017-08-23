const router = require('express').Router();
const client = require('../db').client;
const copyFrom = require('pg-copy-streams').from;
const fs = require('fs');
const path = require('path');

router.post('/upload/:tableName', (req, res, next) => {
  let data = req.body;
  fs.writeFile(path.join(__dirname, `../data/${req.params.tableName}.csv`), data.data, (err, data) => {
    if (err) {
     console.log(err);
     res.sendStatus(404);
    }
    else {
        client.query(`ALTER TABLE "${req.params.tableName}" DROP column "createdAt", DROP column "updatedAt"`);
        var stream = client.query(copyFrom(`COPY "${req.params.tableName}" FROM STDIN CSV`));
        var fileStream = fs.createReadStream(path.resolve( __dirname, `../data/${req.params.tableName}.csv`));
        fileStream.on('error', (err) => console.log("error", err));
        stream.on('end', (err, res) => {
          if (err){
            console.log(err);
          }
          else {
            console.log("copy", res);
          }
        });
        fileStream.pipe(stream);
    }
  })
})

router.get('/:dbName/id/:tableId', (req, res, next) => {
  let tableName = req.params.dbName + req.params.tableId + 's';
  console.log("tableName: ", tableName);
  client.query(`SELECT * FROM "${tableName}"`)
  .then(result => {
    res.send(result);
  })
  .catch(next);
})

module.exports = router;

