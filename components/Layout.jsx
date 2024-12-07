const React = require("react");
// const Header = require("./Header");
function Layout({ user, children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/css/style.css"></link>
        <script defer src="/js/client.js"></script>
        <title>Title</title>
      </head>

      <body>
        {/* <Header user={user}/> */}

        {children}
      </body>
    </html>
  );
}

module.exports = Layout;
