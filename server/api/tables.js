const router = require('express').Router();
const Sequelize = require('sequelize');
const {db, client} = require('../db');
const { Table, Database } = require('../db/models')
const utils = require('../../utils');
module.exports = router;

router.delete('/:tablename', (req, res, next) => {
    var table = req.params.tablename
    client.query(`DROP TABLE "${table}" CASCADE`, function (err, result) {
      if (err) return next(err);
      res.send(`OK. Table ${table} deleted.`);
    });
});

router.put('/:tablename/:databaseName', (req, res, next) => {
    var body = req.body;
    var tablename = req.params.tablename;
    var data = req.params.databaseName;
    Table.findOne({where: {name: tablename}})
    .then((table) => {
        var ans = data+(table.id).toString()+'s'
        client.query(`ALTER TABLE ${ans} RENAME TO ${body.name}`, function (err, result) {
        if (err) return next(err);
            res.end();
        })
    })
});

