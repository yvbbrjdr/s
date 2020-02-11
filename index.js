const fs = require('fs');
const http = require('http');

const config = require('./config');

const getURL = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile('map.json', (err, data) => {
      if (err) {
        reject({
          status: 500,
          reason: err
        });
        return;
      }
      try {
        const url = JSON.parse(data)[path];
        if (url)
          resolve(url);
        else
          reject({
            status: 404,
            reason: 'Not Found'
          });
      } catch (error) {
        reject({
          status: 500,
          reason: error
        });
      }
    });
  });
};

http.createServer(async (req, res) => {
  try {
    const url = await getURL(req.url);
    res.writeHead(302, {
      Location: url
    });
    res.end();
  } catch (error) {
    res.writeHead(error['status']);
    res.end(error['reason'].toString());
  }
}).listen(config.config.listen_port, config.config.listen_addr);
