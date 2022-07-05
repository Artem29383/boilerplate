import {renderToPipeableStream, renderToString} from "react-dom/server";

const {StaticRouter} = require('react-router-dom');
const React = require('react');
const express = require('express');
const path = require('path');
import App from './../src/App'
import {ServerStyleSheet} from 'styled-components';
import * as fs from "fs";
import { JssProvider, SheetsRegistry, createGenerateId, jss } from 'react-jss';
import {renderFullPage} from "./renderFullPage";

const app = express()

app.get(/\.(js|css|map|ico|ts|tsx)$/, express.static(path.resolve(__dirname, '../build')));

const jsFiles = [];

fs.readdirSync('build/static/js').forEach(file => {
    if (file.split('.').pop() === 'js') jsFiles.push(`/static/js/${file}`);
});

app.use('*', (req, res) => {
    const sheet = new ServerStyleSheet();
    const jsx = sheet.collectStyles(<StaticRouter location={req.originalUrl}>
        <App/>
    </StaticRouter>);

    const generateId = createGenerateId();
    const sheets = new SheetsRegistry();
    const html = renderToString(
        <JssProvider jss={jss} registry={sheets} generateId={generateId} classNamePrefix='app-'>
            {sheet.collectStyles(jsx)}
        </JssProvider>
    );

    let css = sheets.toString();
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
                renderFullPage(html, css, styleTags, scriptTags)
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

app.listen(9000, () => {
    console.log('Express server started at <http://localhost:9000>')
});