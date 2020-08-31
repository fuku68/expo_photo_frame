import express from 'express';
import config from '../config.js';
import Jimp from 'jimp';

const router = express.Router();

router.get('/health', (req, res, next) => {
  res.send('healthy');
})

router.post('/convert', async (req, res, next) => {
  const img = await Jimp.read(req.files[0].buffer)
  // @ts-ignore
  // const origin = await Jimp.read('https://expo-photo-frame.web.app/public/assets/osakalogo1200.png')
  const origin = await Jimp.read(`${req.protocol}://${req.get('host')}/public/assets/osakalogo1200.png`);

  img.circle()
  let width = img.bitmap.width;
  let height = img.bitmap.height;
  if (width < height) {
    img.crop(0, (height - width) / 2, width, width);
  } else {
    img.crop((width - height) / 2, 0, height, height);
  }

  // 画像1
  const img1 = img.clone()
  img1
    .resize(150, 150)
    .rotate(-30)
  origin.composite(img1, 720, 75);
  // 画像2
  const img2 = img.clone()
  img2
    .resize(125, 125)
    .rotate(80)
  origin.composite(img2, 105, 342);
  // 画像3
  const img3 = img.clone()
  img3
    .resize(130, 130)
    .rotate(15)
  origin.composite(img3, 200, 602);
  // 画像4
  const img4 = img.clone()
  img4
    .resize(105, 105)
    .rotate(170)
  origin.composite(img4, 567, 1013);
  // 画像5
  const img5 = img.clone()
  img5
    .resize(164, 170)
    .rotate(-70)
  origin.composite(img5, 815, 760);

  origin.getBuffer(Jimp.MIME_JPEG, function(err, buffer){
    res.set("Content-Type", Jimp.MIME_JPEG);
    res.send(buffer);
  });
});

export default router;
