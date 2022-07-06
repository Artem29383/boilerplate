export const renderFullPage = (html, css, styleTags, scriptTags, manifest) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta charset="UTF-8">
    <meta name="google-site-verification" content="nLL5VlSAgcKL756luG6o6UwKcvR8miU2duRnhU-agmE" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="manifest" href="assets/manifest.json">
    ${styleTags}
    <style id="jss-server-side">${css}</style>
  </head>
  <body>
    <div id="root">${html}</div>
    ${scriptTags
    .map(script => `<script src="${script}"></script>`)
    .join('')}
  </body>
</html>`;