var express = require('express');
var router = express.Router();
const mongo = require('mongodb-curd');
const dbname = 'zhousan'
    /* GET users listing. */
    // router.get('/getdata', function(req, res, next) {

//     mongo.find(dbname, 'zhous', function(result) {
//         if (!result) {
//             res.send({ code: 0, msg: 'error' })
//         } else {
//             res.send({ code: 1, data: result })
//         }
//     })
// });
router.post('/getdata', function(req, res, next) {
    let { type, skip, limit } = req.body;
    if (!type) {
        return res.send({
            code: 3,
            msg: "参数不完整"
        })
    }
    mongo.find(dbname, 'zhous', { type: type }, (result) => {
        var total = Math.ceil(result.length / limit)
        console.log(total)
        mongo.find(dbname, 'zhous', { type: type }, (result) => {
            if (!result) {
                res.send({
                    code: 2,
                    msg: "error"
                })
            } else {
                res.send({
                    code: 1,
                    data: result,
                    total: total
                })
            }
        }, {
            skip: skip,
            limit: limit
        })
    })

});

module.exports = router;