const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

async function createBlankProfilePhoto(width, height, filePath) 
{
    const imageUrl = path.join(__dirname, '..','src','defaultProfilePhoto.png');

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    const image = await loadImage(imageUrl);
    ctx.drawImage(image, 0, 0, width, height);

    const out = fs.createWriteStream(filePath);
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    out.on('finish', () => 
    {
        console.log(`The image has been saved to ${filePath}`);
    });
}
  
  // Export the function
  //module.exports = createBlankProfilePhoto;
  module.exports.createBlankProfilePhoto = createBlankProfilePhoto;