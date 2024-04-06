const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8080;

app.use(express.json());

const uploadsDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadsDir)) 
{
  fs.mkdirSync(uploadsDir);
}

app.use((req, res, next) => 
{
  const logData = {
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString()
  };
  console.log(JSON.stringify(logData));
  next();
});

app.post('/createFile', (req, res) => 
{
  const { filename, content} = req.body;
  
  if (!filename || !content) 
  {
    return res.status(400).send('Both filename and content are required.');
  }

  const filePath = path.join(uploadsDir, filename);
  fs.writeFile(filePath, content, err => 
    {
    if (err) 
    {
      console.error(err);
      return res.status(500).send('Internal server error');
    }
    res.sendStatus(200);
  });
});

app.get('/getFiles', (req, res) => 
{
  fs.readdir(uploadsDir, (err, files) => 
  {
    if (err) 
    {
      console.error(err);
      return res.status(500).send('Internal server error');
    }
    res.json(files);
  });
});

app.get('/getFile/:filename', (req, res) => 
{
  const filename  = req.params.filename;

  if (!filename) 
  {
    return res.status(400).send('Filename is required.');
  }

  const filePath = path.join(uploadsDir, filename);
  fs.readFile(filePath, 'utf8', (err, data) => 
  {
    if (err) {
      console.error(err);
      return res.status(400).send('File not found.');
    }
    res.send(data);
  });
});

app.put('/modifyFile', (req, res) => {
  const { filename, content} = req.body;
  
  if (!filename || !content) {
    return res.status(400).send('Both filename and content are required.');
  }

  const filePath = path.join(uploadsDir, filename);
  fs.writeFile(filePath, content, err => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal server error');
    }
    res.sendStatus(200);
  });
});

app.delete('/deleteFile/', (req, res) => {
  const filename = req.query;

  if (!filename) {
    return res.status(400).send('Filename is required.');
  }

  const filePath = path.join(uploadsDir, filename);
  fs.unlink(filePath, err => {
    if (err) {
      console.error(err);
      return res.status(400).send('File not found.');
    }
    res.sendStatus(200);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
