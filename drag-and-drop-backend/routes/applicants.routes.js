let express = require('express'),
    multer = require('multer'),
    mongoose = require('mongoose'),
    { v4: uuidv4 } = require('uuid'),
    router = express.Router();

const DIR = './public/';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});

var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (!file) {
            cb(null, false);
        } else if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

// User model
let Applicant = require('../models/applicants');

router.post('/update-status', (req, res) => {
    console.log(JSON.stringify(req.body));
    Applicant.findByIdAndUpdate()
    Applicant.findByIdAndUpdate(req.body._id, { status: req.body.status }, {new: true}, (err, result) => {
        if (err) {
            console.log(err),
            res.status(500).json({
                error: err
            });
        } else {
            console.log(JSON.stringify(result));
            res.status(201).json(result)
        }
    });
});

router.post('/user-profile', upload.single('profileImg'), (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    const applicant = new Applicant({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
        profileImg: req.file && req.file.filename ? url + '/public/' + req.file.filename : ''
    });
    applicant.save().then(result => {
        res.status(201).json({
            message: "Applicant registered successfully!",
            applicantCreated: {
                _id: result._id,
                name: result.name,
                title: result.title,
                description: result.description,
                status: result.status,
                profileImg: result.profileImg
            }
        })
    }).catch(err => {
        console.log(err),
            res.status(500).json({
                error: err
            });
    })
})

router.get("/", (req, res, next) => {
    Applicant.find().then(data => {
        res.status(200).json({
            message: "Applicants list retrieved successfully!",
            users: data
        });
    });
});

module.exports = router;