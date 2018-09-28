const path = require('path') // built in module
const fs = require('fs');

const AWS = require('aws-sdk');
const express = require('express');
const fileUpload = require('express-fileupload');

AWS.config.update({ accessKeyId: 'AKIAJDNGA6S3GR7D4E2A', secretAccessKey: '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' });

const s3 = new AWS.S3();
const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, './public');

var app = express();
app.use(express.static(publicPath));
app.use(fileUpload());

app.post('/upload', (req, res) =>{
  file = req.files.file;
  s3.putObject({
    Bucket: 's3-image-recognition',
    Key: file.name,
    Body: file.data,
    ACL: 'public-read'
  },function (resp) {
    if (resp) {
      return res.status(500).send(`failed to upload ${file.name}`)
    }
    res.send('got the notification');
  });

})

// server.listen instead of app.listen
app.listen(port, () => {
  console.log(`server is up on port ${port}`)
});
