const React = require("react");
const Layout = require("./Layout");

function Login({ error }) {
  return (
    <Layout>
<div class="container" id="container">
    <div class="form-container sign-up-container">
        <form action="#">
            <h1>Создать аккаунт</h1>
            <input type="text" placeholder="Имя" />
            <input type="email" placeholder="Электронная почта" />
            <input type="password" placeholder="Пароль" />
            <button>Зарегистрироваться</button>
        </form>
    </div>
    <div class="form-container sign-in-container">
        <form action="#">
            <h1 class="title">Авторизация</h1>
            <input type="email" placeholder="Электронная почта" />
            <input type="password" placeholder="Пароль" />
            <a href="#">Забыли пароль?</a>
            <button>Войти</button>
        </form>
    </div>
    <div class="overlay-container">
        <div class="overlay">
            <div class="overlay-panel overlay-left">
                <h1>С возвращением!</h1>
                <p>Чтобы воспользоваться приложением Training Diary, войди в свою учетную запись.</p>
                <button class="ghost" id="signIn">Войти</button>
            </div>
            <div class="overlay-panel overlay-right">
                <h1>Привет!</h1>
                <p>Присоединяйся к нам. Просто введи свои данные и вперед к новым достижениям!</p>
                <button class="ghost" id="signUp">Зарегистрироваться</button>
            </div>
        </div>
    </div>
</div>
    </Layout>
  );
}

module.exports = Login; // Экспортируем компонент
