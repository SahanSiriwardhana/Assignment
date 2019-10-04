var express = require('express');
var routerLand = express.Router();
var Land = require('../models/landModel');
var Joi = require('joi');
var multer = require('multer')
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
})

var upload = multer({ storage: storage })

//@route GET /lands/
//@desc Show all lands
routerLand.get('/', (req, res, next) => {
    Land.find()
        .sort({ create_date: -1 })
        .then(lands => {
            if(lands.length>=0){
                res.status(200).json(lands);
            }else{
                res.status(404).json({
                    message:"No data found"
            });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

//@route POST /users/enter
//@desc Add new land
routerLand.post('/enter', upload.single('landImage'), (req, res, next) => {
    const scheema = Joi.object().keys({
        title: Joi.string().required(),
        size: Joi.string().required(),
        price: Joi.string().required(),
        description: Joi.string().required(),
        bidEndDate: Joi.string().required(),

    })

    Joi.validate(req.body, scheema, (err, result) => {
        if (err) {
            //console.log(err);
            return res.status(500).json({
                error: err
            });
        } else {
            var land = new Land({
                title: req.body.title,
                size: req.body.size,
                price: req.body.price,
                description: req.body.description,
                bidEndDate: req.body.bidEndDate,
                landImage: req.file.path
            });
            land.save()
                .then(result => {
                    console.log(result);
                    res.status(201).json({
                        message: "Land Created",
                        createdland:result
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
        }
    })
});

//@route GET /users/id
//@desc View individual land details 
routerLand.get('/:id',(req,res,next)=>{
    var id=req.params.id;
    Land.findById(id)
    .exec()
    .then(doc=>{
        if(doc){
        console.log(doc);
        res.status(200).json(doc);
    }else{
        res.status(400).json({
            message:"No data"
        });
    }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});


//@route DELETE /lands/signup
//@desc Delete land
routerLand.delete('/:id',(req,res,next)=>{
    var id=req.params.id;
    Land.remove({_id:id})
    .exec()
    .then(result=>{
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

//@route PATCH /users/id
//@desc Update land
routerLand.patch('/:id',(req,res,next)=>{
    var id=req.params.id;
    Land.update({_id:id},{$set:{
        bidStatus:'fulfill'
    }}).exec()
    .then(result=>{
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
    
});

module.exports = routerLand;