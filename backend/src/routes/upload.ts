import { Router, Response } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { requireAdmin, AdminRequest } from '../middleware/adminAuth';

const router = Router();

const uploadsDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const ALLOWED_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'];

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uuidv4()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB
  fileFilter: (_req, file, cb: FileFilterCallback) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ALLOWED_EXTS.includes(ext)) cb(null, true);
    else cb(new Error('Only image files (jpg, png, webp, gif, avif) are allowed'));
  },
});

router.post('/', requireAdmin, upload.single('file'), (req: AdminRequest, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: 'No file received' });
    return;
  }
  res.json({ url: `/uploads/${req.file.filename}` });
});

export default router;
