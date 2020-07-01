var admin = require('firebase-admin');
let serviceAccount = require('../config/key_firebase.json');
//multer
var multer = require('multer');
const { json } = require('body-parser');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/upload')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname)
    }
});
function formatTime() {
    let year, month, date, hours, minutes, seconds;
    var dt = new Date();
    var dt_after;
    year = dt.getFullYear().toString().padStart(4, '0')
    month = (dt.getMonth() + 1).toString().padStart(2, '0')
    date = dt.getDate().toString().padStart(2, '0')
    hours = dt.getHours().toString().padStart(2, '0')
    minutes = dt.getMinutes().toString().padStart(2, '0')
    seconds = dt.getSeconds().toString().padStart(2, '0')
    dt_after = (year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds)
    return dt_after;
}
var upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        console.log(file);
        if (file.mimetype == "image/bmp" || file.mimetype == "image/png" || file.mimetype == "image/jpeg") {
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
        Active: req.body.Active,
        Time_Created: formatTime(),
        Time_Updated: ''
    });
    res.send({ status: 200 })
}
var Update_Book = (req, res) => {

    console.log("body nè: " + req.body.Category_Name)
    console.log("Status: " + req.body.Status)

    if (req.body.Category_Name) {
        db.collection("Book").where('Category', '==', req.body.Category_Name).get().then(function (querySnapshot) {
            querySnapshot.forEach(doc => {
                console.log(doc.data())
                doc.ref.update({
                    Active: req.body.Status,
                    Time_Updated: formatTime()
                })
            })
        }).catch(err => {
            console.log("Có lỗi: " + err)
        })
        // db.collection("Book").doc("ntDNxUc8KsCBMsnm1aXl").update({
        //     Active: req.body.Status
        // })

    } else {
        db.collection("Book").doc(req.body.Book_ID).update({
            User_Create: req.body.User_Create,
            Category: req.body.Category,
            Publication_Date: req.body.Publication_Date,
            Description: req.body.Description,
            Book_Name: req.body.Book_Name,
            Status: req.body.Status,
            Time_Updated: '',
        });
    }


    res.send({ status: 200 })
}
var Get_All_User = (req, res) => {
    let list = []
    db.collection('User').get()
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
var Get_All_Book = (req, res) => {
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
            if (typeof req.file !== undefined && req.file) {
                res.json({ "file": req.file.filename });
            } else {
                res.json({ "file": 0 });
            }
        }

    });
}

var Update_File = (req, res, next) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.log("A Multer error occurred when uploading.");
        } else if (err) {
            console.log("An unknown error occurred when uploading." + err);
        } else {
            console.log("Upload is okay");
            console.log(req.file);

            if (typeof req.file !== undefined && req.file) {
                res.json({ "file": req.file.filename })
            } else {
                res.json({ "error": "404" })
            }
        }
    });
}


var Get_All_Cate = (req, res) => {
    let list = []
    db.collection('Cate').get()
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
var Delete_Cate = (req, res) => {
    console.log(req.params.id)
    db.collection("Cate").doc(req.params.id).delete()
    res.send({ status: 200 })
}
var Update_Cate = (req, res) => {
    console.log("body: " + req.body)

    db.collection("Cate").doc(req.body.Cat_ID).update({
        Name_Cat: req.body.Name_Cat,
        Description_Cat: req.body.Description_Cat,
        Publication_Date: req.body.Publication_Date,
        Status_Cat: req.body.Status_Cat,
        Time_Updated: formatTime(),
    });

    res.send({ status: 200 })
}
var Create_Cate = (req, res) => {

    console.log(req.body)
    console.log(Date.now())
    let ref = db.collection('Cate').doc();
    let id = ref.id;
    db.collection('Cate').doc(id).set({
        Cat_ID: id,
        Name_Cat: req.body.Name_Cat,
        Description_Cat: req.body.Description_Cat,
        Publication_Date: req.body.Publication_Date,
        Status_Cat: req.body.Status_Cat,
        Time_Created: formatTime(),
        Time_Updated: ''
    });
    res.send({ status: 200 })

}

module.exports = {
    Create_Book,
    Up_File,
    Get_All_Book,
    Delete_Book,
    Update_Book,
    Update_File,
    Get_All_Cate,
    Create_Cate,
    Update_Cate,
    Delete_Cate,
    Get_All_User
}