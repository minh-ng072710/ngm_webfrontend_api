var admin = require('firebase-admin');
let serviceAccount = require('../config/key_firebase.json');
//multer
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/upload')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname)
    }
});

var upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        console.log(file);
        if (file.mimetype == "image/bmp" || file.mimetype == "image/png" || file.mimetype == "image/jpg") {
            cb(null, true)
        } else {
            return cb(new Error('Only image are allowed!'))
        }
    }
}).single("file");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://ecommerce-3b4a8.firebaseio.com"
});
let db = admin.firestore();
var Delete_Book = (req, res) => {
    console.log(req.params.id)

    db.collection("Book").doc(req.params.id).delete()
    res.send({ status: 200 })
}
var Create_Book = (req, res) => {
    console.log(req.body)
    console.log(Date.now())
    let ref = db.collection('Book').doc();
    let id = ref.id;
    db.collection('Book').doc(id).set({
        Book_ID: id,
        User_Create: req.body.User_Create,
        Img_URL: req.body.Image_URL,
        Category: req.body.Category,
        Publication_Date: req.body.Publication_Date,
        Description: req.body.Description,
        Book_Name: req.body.Book_Name,
        Status: req.body.Status,
        Time_Created: Date.now(),
        Time_Updated: ''
    });
    res.send({ status: 200 })
}
var Update_Book = (req, res) => {

    console.log(req.body)

    db.collection("Book").doc(req.body.Book_ID).update({
        User_Create: req.body.User_Create,
        Category: req.body.Category,
        Publication_Date: req.body.Publication_Date,
        Description: req.body.Description,
        Book_Name: req.body.Book_Name,
        Status: req.body.Status,
        Time_Updated: ''

    });

    res.send({ status: 200 })
}

var Get_All = (req, res) => {
    let list = []
    db.collection('Book').get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                list.push(doc.data())
            });
            res.send(list)
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });
}

var Up_File = (req, res, next) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.log("A Multer error occurred when uploading.");
        } else if (err) {
            console.log("An unknown error occurred when uploading." + err);
        } else {
            console.log("Upload is okay");
            console.log(req.file); // Thông tin file đã upload
            if (req.file.filename) {
                res.json({ "file": req.file.filename });
            } else {
                res.json({ "result": 0 });
            }
        }

    });
}
module.exports = { Create_Book, Up_File, Get_All, Delete_Book, Update_Book }