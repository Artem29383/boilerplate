import {renderToNodeStream} from "react-dom/server";

const {StaticRouter} = require('react-router-dom');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const express = require('express');
const fs = require('fs');
const path = require('path');
import App from './../src/App'
import {ServerStyleSheet} from 'styled-components';

const app = express()

app.get(/\.(js|css|map|ico|ts|tsx)$/, express.static(path.resolve(__dirname, '../build')));

app.use('*', (req, res) => {
    // const sheet = new ServerStyleSheet();
    // let html = fs.readFileSync(path.resolve(__dirname, '../build/index.html'), {
    //     encoding: 'utf8'
    // });

    res.write(`<html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width,minimum-scale=1,maximum-scale=1,initial-scale=1"
        />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <title>React Boilerplate SSR</title>
      </head>
      <body>`);

    const sheet = new ServerStyleSheet();
    const jsx = sheet.collectStyles(<StaticRouter location={req.originalUrl}>
        <App/>
    </StaticRouter>);
    const stream = sheet.interleaveWithNodeStream(renderToNodeStream(jsx));

// you'd then pipe the stream into the response object until it's done
    stream.pipe(res, { end: false });

// and finalize the response with closing HTML
    stream.on('end', () => res.end('</body></html>'));

    // html = html.replace('<div id="root"></div>', `<div id="root">${appHTML}</div>`)
    // console.info('html', html)
    // res.contentType('text/html');
    // res.status(200)
    // return res.send(html);
})

app.listen(9000, () => {
    console.log('Express server started at <http://localhost:9000>')
});