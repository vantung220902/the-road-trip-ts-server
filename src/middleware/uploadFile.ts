import multer from 'multer';
import path from 'path';

const storage = multer({
    storage: multer.diskStorage({}),
    fileFilter: (_req, file, cb) => {
        let ext = path.extname(file.originalname);
        if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
            const error = new Error('File type is not supported');
            cb(<any>error, false);
            return;
        }
        cb(null, true);
    }
});
export default storage;
