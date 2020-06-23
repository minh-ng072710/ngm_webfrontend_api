const express = require("express");
const { Create_Book, Up_File, Get_All, Delete_Book, Update_Book } = require("../controllers/Admin.Controller");
const router = express.Router();
let routerInit = (app) => {
    router.get("/", Create_Book);
    router.post("/create-book", Create_Book)
    router.delete("/delete-book/:id", Delete_Book)
    router.put("/update-book", Update_Book)

    router.post("/file", Up_File)
    router.get("/book", Get_All)
    app.use("/api", router)
}
module.exports = routerInit;  