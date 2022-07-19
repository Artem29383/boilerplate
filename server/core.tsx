import {renderToPipeableStream, renderToString} from "react-dom/server";

const {StaticRouter} = require('react-router-dom');
const React = require('react');
const express = require('express');
const path = require('path');
import App from './../src/App'
import {ServerStyleSheet} from 'styled-components';
import * as fs from "fs";
import {renderFullPage} from "./renderFullPage";
import {manifestPath, serviceWorkerPath} from "../config/routes";

const app = express()


const jsFiles = [];
const worker = [];

fs.readdirSync('build/static/js').forEach(file => {
    if (file.split('.').pop() === 'js') jsFiles.push(`/static/js/${file}`);
});

// ROUTES
app.use(manifestPath, express.static(path.resolve(__dirname, '..')))

app.get(/\.(js|css|map|ico|ts|tsx)$/, express.static(path.resolve(__dirname, '..')));

app.use(serviceWorkerPath, express.static(path.resolve(__dirname, `../${worker[0]}`)))

app.use('/static', express.static(path.join(__dirname, '../server_build/static')));

app.use('*', (req, res) => {
    const sheet = new ServerStyleSheet();
    const jsx = sheet.collectStyles(<StaticRouter location={req.originalUrl}>
        <App/>
    </StaticRouter>);

    const html = renderToString(sheet.collectStyles(jsx));

    const styleTags = sheet.getStyleTags();
    const scriptTags = jsFiles;

    res.socket.on('error', (error) => {
        console.error('Fatal', error);
    });

    let didError = false;

    const { pipe, abort } = renderToPipeableStream(jsx, {
        onShellReady() {
            // If streaming
            console.log('onShellReady start');
            res.statusCode = didError ? 500 : 200;

            res.send(
                renderFullPage(html, styleTags, scriptTags)
            );

            pipe(res);
            console.log('onShellReady stop');
        },

        onError(x) {
            didError = true;
            console.error(x);
        },
    });
    setTimeout(abort, 5000);
})

app.listen(9001, () => {
    console.log('Express server started at <http://localhost:9001>')
});