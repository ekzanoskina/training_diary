const React = require("react");
const Layout = require("./Layout");

function Login({ error }) {
  return (
    <Layout title="Authentication">
      <main className="auth-container">
        <div className="container" id="container">
          <div className="form-container sign-up-container">
            <form id="signUpForm" action="/auth/signup" method="POST" className="sign-up-form auth-form">
              <h2 className="form-title">Создать аккаунт</h2>
              <input type="text" name="username" className="input-field" placeholder="Имя" />
              <input
                type="email" name="email"
                className="input-field"
                placeholder="Электронная почта"
              />
              <input type="password" name="password" className="input-field" placeholder="Пароль" />
              <button id="signUpSubmit" className="submit-button">Зарегистрироваться</button>
            </form>
          </div>
          <div className="form-container sign-in-container">
            <form  method="POST" action="/auth/signin" if="signInForm" className="sign-in-form auth-form">
              <h2 className="form-title">Авторизация</h2>
              <input
                type="email"
                name="email"
                className="input-field"
                placeholder="Электронная почта"
              />
              <input
                type="password"
                name="password"
                className="input-field"
                placeholder="Пароль"
              />
              <a href="#" className="forgot-password">
                Забыли пароль?
              </a>
              <button id="signInSubmit" className="submit-button">Войти</button>
            </form>
          </div>
          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-panel overlay-left">
                <h2 className="form-title">С возвращением!</h2>
                <p>
                  Чтобы воспользоваться приложением Training Diary, войдите в
                  свою учетную запись.
                </p>
                <button className="ghost" id="signIn">
                  Войти
                </button>
              </div>
              <div className="overlay-panel overlay-right">
                <h2 className="form-title">Привет!</h2>
                <p>
                  Присоединяйся к нам. Просто введи свои данные и вперед к новым
                  достижениям!
                </p>
                <button className="ghost" id="signUp">
                  Зарегистрироваться
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}

module.exports = Login; // Экспортируем компонент
