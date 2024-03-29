/**
 * Copyright 2017, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// [START app]
'use strict';

// [START setup]
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('case sensitive routing', true);
app.use(bodyParser.json());
// [END setup]

app.get('/', (req, res) => {
  res
    .status(200)
    .json({message: 'Hello world!'})
    .end();
});

app.get('/health', (req, res) => {
  res
    .status(200)
    .end();
});

app.post('/echo', (req, res) => {
  res
    .status(200)
    .json({message: req.body.message})
    .end();
});

const authInfoHandler = (req, res) => {
  let authUser = {id: 'anonymous'};
  const encodedInfo = req.get('X-Endpoint-API-UserInfo');
  if (encodedInfo) {
    authUser = JSON.parse(Buffer.from(encodedInfo, 'base64'));
  }
  res
    .status(200)
    .json(authUser)
    .end();
};

const headerHandler = (req, res) => {
  res
    .status(200)
    .json(req.headers)
    .end();
}

app.get('/auth/info/googlejwt', authInfoHandler);
app.get('/auth/info/googleidtoken', authInfoHandler);
app.get('/headers', headerHandler);

if (module === require.main) {
  // [START listen]
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
  });
  // [END listen]
}
// [END app]

module.exports = app;
