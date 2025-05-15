import multer from 'multer';
import crypto from 'crypto';
import multerS3 from 'multer-s3';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Request } from 'express';
import format from '../utils/formatString';
const { sanitizeString, getFileExtension } = format;
// Configuração do cliente S3
const s3Client = new S3Client({
  region: process.env.AWS_DEFAULT_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const MAX_FILE_SIZE = 50 * 1024 * 1024;

interface File extends Express.Multer.File {
  ARQUIVO?: string;
  EXTENSAO_DO_ARQUIVO?: string;
  TAMANHO_DO_ARQUIVO?: number;
  CHAVE_DO_ARQUIVO?: string;
}

const storage = multerS3({
  s3: s3Client,
  bucket: process.env.BUCKET_NAME!,
  acl: 'public-read',
  key: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, key?: string) => void
  ) => {
    crypto.randomBytes(16, (err, hash) => {
      if (err) return cb(err);

      const fileName = sanitizeString(file.originalname);

      const fileHash = `${hash.toString('hex')}-${sanitizeString(
        file.originalname
      )}`;
      (file as File).ARQUIVO = fileName;
      (file as File).EXTENSAO_DO_ARQUIVO = getFileExtension(fileName);
      (file as File).TAMANHO_DO_ARQUIVO = file.size;
      (file as File).CHAVE_DO_ARQUIVO = fileHash;

      cb(null, fileHash);
    });
  },
});

const upload = multer({
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  storage,
});

export default {
  upload,
};
