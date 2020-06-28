const express = require("express");
const {
    Create_Book,
    Up_File,
    Get_All_Book,
    Delete_Book,
    Update_Book,
    Get_All_Cate,
    Update_Cate,
    Create_Cate,
    Update_File,
    Delete_Cate,
    Get_All_User
} = require("../controllers/Admin.Controller");
const router = express.Router();
let routerInit = (app) => {
    router.get("/", Create_Book);
    router.post("/create-book", Create_Book)
    router.delete("/delete-book/:id", Delete_Book)
    router.put("/update-book", Update_Book)
    router.post("/update-file", Update_File)
    router.post("/file", Up_File)
    router.get("/book", Get_All_Book)

    router.get("/cate", Get_All_Cate)
    router.put("/update-cate", Update_Cate)
    router.post("/create-cate", Create_Cate)
    router.delete("/delete-cate/:id", Delete_Cate)

    router.get("/user", Get_All_User)



    app.use("/api", router)
}
module.exports = routerInit;  