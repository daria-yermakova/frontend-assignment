import express from 'express';

import fs from 'fs';

const app = express();

const pathToData = new URL('data/data.json', import.meta.url);

const data = JSON.parse(fs.readFileSync(pathToData));

app.get('/api/v1/tree', (_, res) => {
  setTimeout(() => {
    res.setHeader('Access-Control-Allow-Origin', '*').json({ data });
  }, 300);
});

app.listen(8010, (_) => {
  console.log('API server running on localhost:8010');
});
