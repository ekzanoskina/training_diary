const React = require("react");
const Layout = require("./Layout");

function Form({ error, username }) {
  return (
    <form className="form hidden">
      <div className="form__row">
        <label className="form__label">Тип</label>
        <select className="form__input form__input--type">
          <option value="running">Бег</option>
          <option value="cycling">Велосипед</option>
          <option value="swimming">Плавание</option>
        </select>
      </div>
      <div className="form__row">
        <label className="form__label">Дистанция</label>
        <input className="form__input form__input--distance" placeholder="км" />
      </div>
      <div className="form__row">
        <label className="form__label">Длительность</label>
        <input
          className="form__input form__input--duration"
          placeholder="мин"
        />
      </div>
      <div className="form__row">
        <label className="form__label">Темп</label>
        <input
          className="form__input form__input--cadence"
          placeholder="шагов/мин"
        />
      </div>
      <div className="form__row form__row--hidden">
        <label className="form__label">Высота</label>
        <input
          className="form__input form__input--elevation"
          placeholder="метры"
        />
      </div>
      <div className="form__row form__row--hidden">
        <label className="form__label">Высота</label>
        <input
          className="form__input form__input--elevation"
          placeholder="метры"
        />
      </div>
      <div className="form__row form__row--hidden">
        <label className="form__label">Стиль</label>
        <input className="form__input form__input--style" placeholder="кроль" />
      </div>

      <button className="form__btn">OK</button>
    </form>
  );
}

module.exports = Form;