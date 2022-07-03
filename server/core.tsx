const { StaticRouter } = require( 'react-router-dom' );
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const express = require('express');
const fs = require('fs');
const path = require('path');
import App from './../src/App'

const app = express()

app.get(/\.(js|css|map|ico|ts|tsx)$/, express.static(path.resolve(__dirname, '../build')));

app.use('*', (req, res) => {
    let html = fs.readFileSync(path.resolve(__dirname, '../build/index.html'), {
        encoding: 'utf8'
    });
    const appHTML = ReactDOMServer.renderToString(
        <StaticRouter location={req.originalUrl}>
            <App />
        </StaticRouter>
    );

    html = html.replace('<div id="root"></div>', `<div id="root">${appHTML}</div>`)
    // console.info('html', html)
    res.contentType('text/html');
    res.status(200)
    return res.send(html);
})

app.listen(9000, () => {
    console.log('Express server started at <http://localhost:9000>')
});