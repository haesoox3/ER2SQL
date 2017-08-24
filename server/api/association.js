const router = require('express').Router();
const client = require('../db/client');
const {Table, Database} = require('../db/models');
const utils = require('./utils');
module.exports = router;

router.post('/', (req, res, next) => {
  let uDb = req.body.database;
  let usrc = req.body.src;
  let utarget = req.body.target;
  let assocType = req.body.assocType;
  let fkName = req.body.fkName;
  let user = req.user;
  let db, dbName, src, target, srcName, targetName, tableId;

  utils.validateDatabase(uDb.id, user.id)
  .then(database => {
    dbName = database.name;
    db = database;
    return utils.validateTableById(usrc.tableId, db.id);
  })
  .then(srcTable => {
    src = srcTable;
    srcName = utils.formatTableName(db, srcTable);
    return utils.validateTableById(utarget.tableId, db.id);
  })
  .then(targetTable => {
    target = targetTable;
    targetName = utils.formatTableName(db, targetTable);
    if (assocType === 'many to many'){
      return utils.validateTableByName(formatJoinTableName(src, target), db.id);
    }
  })
  .then(joinTable => (assocType==='many to many') ? tableId = joinTable.id : null)
  .then(() => {
    if (assocType === 'one to one'){
      fkName = (fkName === '') ? src.name + '_id' : fkName;
      let constraintName = 'fk_' + src.name;
      return client.query(`ALTER TABLE "${targetName}"
              ADD COLUMN "${fkName}" INTEGER UNIQUE,
              ADD CONSTRAINT "${constraintName}"
              FOREIGN KEY("${fkName}")
              REFERENCES "${srcName}"(id)`)
      // // return client.query('ALTER TABLE $1 ADD COLUMN $2 INTEGER UNIQUE, ADD CONSTRAINT $3 FOREIGN KEY $4 REFERENCES $5(id)',[targetName, fkName, constraintName, fkName, srcName])
      //     return client.query(`ALTER TABLE $1
      //         ADD COLUMN $2 INTEGER UNIQUE,
      //         ADD CONSTRAINT $3
      //         FOREIGN KEY($4)
      //         REFERENCES $5(id)`, [targetName, fkName, constraintName, fkName, srcName])
    }
    else if (assocType === 'one to many'){
      fkName = (fkName === '') ? src.name + '_id' : fkName;
      let constraintName = 'fk_' + src.name;
      return client.query(`ALTER TABLE "${targetName}"
                    ADD COLUMN "${fkName}" INTEGER,
                    ADD CONSTRAINT "${constraintName}"
                    FOREIGN KEY("${fkName}")
                    REFERENCES "${srcName}"(id)`)
    }
    else if (assocType === 'many to one'){
      fkName = (fkName === '') ? target.name + '_id' : fkName;
      let constraintName = 'fk_' + target.name;
      return client.query(`ALTER TABLE "${srcName}"
                    ADD COLUMN "${fkName}" INTEGER,
                    ADD CONSTRAINT "${constraintName}"
                    FOREIGN KEY("${fkName}")
                    REFERENCES "${targetName}"(id)`)
    }
    else if (assocType==='many to many'){
      let fkName1 = src.name + '_id';
      let fkName2 = target.name + '_id';
      return client.query(`DROP TABLE "${dbName}${tableId}s";
                    create table "${dbName}${tableId}s"
                   ("${fkName1}" INTEGER, "${fkName2}" INTEGER,
                   FOREIGN KEY("${fkName1}")
                   REFERENCES "${srcName}"(id),
                   FOREIGN KEY("${fkName2}")
                   REFERENCES "${targetName}"(id),
                   PRIMARY KEY ("${fkName1}","${fkName2}"))`)
    }          
  })
  .then(result => {
      res.send("association succeeded");
  })
  .catch(next);
});
