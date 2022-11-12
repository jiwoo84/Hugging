import multer from "multer";

// storage 는 어디에 저장될지, 파일이름을 어떻게 할지 지정하는 것
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/images/");
  },
  filename: (req, file, cb) => {
    let mimeType = "";
    switch (file.mimetype) {
      case "image/bmp":
        mimeType = "png";
        break;
      case "image/gif":
        mimeType = "png";
        break;
      case "image/jpeg":
        mimeType = "png";
        break;
      case "image/png":
        mimeType = "png";
        break;
      case "image/webp":
        mimeType = "png";
        break;
      default:
        mimeType = "png";
        break;
    }
    cb(null, `${req.itemName}_${Date.now()}.${mimeType}`);
  },
});

// 아래 미들웨어는 업로드 시, 상품의 name을 쿼리로 받아, req.itemName 으로 저장시킴
// multer 에서 이미지 이름에 사용될예정
const namingItem = (req, res, next) => {
  if (req.currentRole !== "admin") {
    throw new Error("관리자만 상품을 추가할 수 있습니다.");
  }
  console.log("req.query = ", req.query);
  const { name } = req.query;
  req.itemName = name.replace(/ /g, "");
  console.log("req.itemName = ", req.itemName);
  next();
};
// 아래 코드를 미들웨어로 export 하여 상품 업로드시 추가되게 해야함
const itemImg = multer({
  storage,
});

export { itemImg, namingItem };
