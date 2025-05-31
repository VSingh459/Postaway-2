import multer from 'multer';

// 2. Configure storage with filename and location.
const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        const timestamp = new Date().toISOString().replace(/:/g, '-'); // Replace ':' with '-'
        cb(null, `${timestamp}${file.originalname}`);
    },
    
});

export const upload = multer({
    storage: storage,
});