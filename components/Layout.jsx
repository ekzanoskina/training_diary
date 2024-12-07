const React = require("react");
// const Header = require("./Header");
function Layout({ user, title, children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/css/auth.style.css"></link>
        <link rel="stylesheet" href="/css/main.style.css"></link>

        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css"
          integrity="sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI="
          crossOrigin=""
        />
        <script
          defer
          src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js"
          integrity="sha256-WBkoXOwTeyKclOHuWtc+i2uENFpDZ9YPdf5Hf+D7ewM="
          crossOrigin=""
        ></script>
        <script defer src="https://kit.fontawesome.com/2bb261e3ba.js" crossOrigin="anonymous"></script>
        <script defer src="/js/main.js" />
        <script defer src="/js/auth.js" />

        <title>{title}</title>
      </head>

      <body>
        {/* <Header user={user}/> */}

        {children}
      </body>
    </html>
  );
}

module.exports = Layout;
