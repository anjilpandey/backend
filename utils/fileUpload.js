const multer=require('multer')
const fs=require("fs")
const path=require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const destination="/public/uploads"
        if(!fs.existsSync(destination)){
            fs.mkdirSync(destination,{recursive:true})
        }
      cb(null,destination)
    },
    filename: function (req, file, cb) {
        // for eg : filename : abc.jpeg
        // ext => jpeg

        let ext=path.extname(file.originalname)
        let fname = path.basename(file.originalname,ext)
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      const filename = fname + uniqueSuffix + ext
      cb(null, filename)
    }
  })

  const imageFilter=(req,file,cb)=>{
    if(!file.originalname.match(/\.(jpeg|JPEG|PNG|png|gif|GIF|svg|SVG|jpg|JPG|jfif|JFIF)/)){
        return cb(new Error("Invalid image file"),false)
    }
    cb(null,true)
  }
  
  const upload = multer({
     storage: storage,
     fileFilter:imageFilter,
     limits:{
        fileSize:2000000
     } 
    })

  module.exports=upload