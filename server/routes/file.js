const path = require("path");
const express = require("express");
const multer = require("multer");
const db = require("../db/db");
const Router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, "./files");
    },
    filename(req, file, cb) {
      cb(null, `${new Date().getTime()}_${file.originalname}`);
    },
  }),
  limits: {
    fileSize: 1000000, // max file size 1MB = 1000000 bytes
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpeg|jpg|png|pdf|doc|docx|xlsx|xls)$/)) {
      return cb(
        new Error(
          "only upload files with jpg, jpeg, png, pdf, doc, docx, xslx, xls format."
        )
      );
    }
    cb(undefined, true); // continue with upload
  },
});

Router.post(
  "/upload",
  upload.single("file"),
  async (req, res) => {
    try {
      const { title, description } = req.body;
      const { path, mimetype } = req.file;

      await db.query(
        `insert into files (title, description, file_path, file_mimetype) values ('${title}', '${description}', '${path}', '${mimetype}')`
      );
      res.send("file uploaded successfully.");
    } catch (error) {
      console.log("top error", error);
      res.status(400).send("Error while uploading file. Try again later.");
    }
  },
  (error, req, res, next) => {
    if (error) {
      console.log("bottom error ", error);
      res.status(500).send(error.message);
    }
  }
);

Router.get("/getAllFiles", async (req, res) => {
  try {
    const files = await db.query(`SELECT * FROM files`);

    res.send(files.rows);
  } catch (error) {
    res.status(400).send("Error while getting list of files. Try again later.");
  }
});

Router.get("/download/:id", async (req, res) => {
  try {
    console.log("req.params.id", req.params.id);
    let filesObj = await db.query(
      `SELECT * FROM files where id=${req.params.id}`
    );
    const file = filesObj.rows[0];
    console.log("filepath", file.file_path);
    res.set({
      "Content-Type": file.file_mimetype,
    });
    res.sendFile(path.join(__dirname, "..", file.file_path));
  } catch (error) {
    console.log("error", error);
    res.status(400).send("Error while downloading file. Try again later.");
  }
});

module.exports = Router;
