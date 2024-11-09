import * as crypto from 'crypto';
import * as https from 'https';
import axios from 'axios';

export const hashFileName = (temp_filename: string) => {
  return crypto.createHash('md5').update(temp_filename).digest('hex');
};

export const getFileExtension = (original_name: string) => {
  return original_name.substring(
    original_name.lastIndexOf('.'),
    original_name.length,
  );
};

export const downloadImagesByUrl = async (urls) => {
  const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
  });
  const images_meta = [];

  for (const url of urls) {
    await axios
      .get(url, { httpsAgent, responseType: 'arraybuffer' })
      .then((response) => {
        images_meta.push({
          fieldname: 'image',
          originalname: `downloaded-${Date.now()}.jpg`,
          encoding: 'base64',
          mimetype: response.headers['content-type'],
          size: response.data.length,
          buffer: response.data,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return images_meta;
};
