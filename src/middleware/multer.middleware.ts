import multer from "multer";
import path from "node:path";
import fs from "fs";
import { v4 as uuidV4 } from "uuid";
const store = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, "../../uploads");

    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${
      Date.now() + "-" + Math.round(Math.random() * 30)
    }${uuidV4()}`;
    const type = path.extname(file.originalname).toLowerCase();

    cb(null, file.fieldname + "-" + uniqueName + type);
  },
});
export const uploads = multer({ storage: store });
