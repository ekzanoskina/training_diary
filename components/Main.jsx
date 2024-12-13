const React = require("react");
const Layout = require("./Layout");
const Form = require("./Form")

function Main({ error, username }) {
  return (
    <Layout>
      <main className="main-container">
        <div className="sidebar">
          <h1 className="header">Дневник тренировок</h1>

          <ul className="workouts">
          <Form/>
          </ul>

          <i
            id="signOutBtn"
            className="fa-solid fa-right-from-bracket signout-btn"
          ></i>
        </div>

        <div id="map"></div>
      </main>
    </Layout>
  );
}

module.exports = Main; // Экспортируем компонент
