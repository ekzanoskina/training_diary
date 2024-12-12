"use strict";

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");
const inputStyle = document.querySelector(".form__input--style");

class App {
  _workouts = [];
  _map;
  _mapEvent;

  constructor() {
    this._getPosition();
    this._getWorkouts(); // Получаем тренировки с сервера

    form.addEventListener("submit", this._newWorkout.bind(this));
    inputType.addEventListener("change", this._toggleField);
    containerWorkouts.addEventListener("click", this._moveToPopup.bind(this));
  }

  _getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), () =>
        alert("Вы не предоставили доступ к своей локации")
      );
  }

  _loadMap(position) {
    const { latitude, longitude } = position.coords;
    const coords = [latitude, longitude];

    this._map = L.map("map").setView(coords, 13);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this._map);

    this._map.on("click", this._showForm.bind(this));

    this._workouts.forEach((work) => {
      this._renderWorkMarker(work);
    });
  }

  _showForm(mapE) {
    this._mapEvent = mapE;
    form.classList.remove("hidden");
    inputDistance.focus();
  }

  _toggleField() {
    const type = inputType.value; // Получаем текущий тип тренировки

    // Скрываем все поля ввода по умолчанию
    inputCadence.closest(".form__row").classList.add("form__row--hidden");
    inputElevation.closest(".form__row").classList.add("form__row--hidden");
    inputStyle.closest(".form__row").classList.add("form__row--hidden");

    // Показываем соответствующие поля в зависимости от типа тренировки
    if (type === "running") {
      inputCadence.closest(".form__row").classList.remove("form__row--hidden");
    } else if (type === "cycling") {
      inputElevation
        .closest(".form__row")
        .classList.remove("form__row--hidden");
    } else if (type === "swimming") {
      inputStyle.closest(".form__row").classList.remove("form__row--hidden");
    }
  }

  async _newWorkout(e) {
    e.preventDefault();

    const validInputs = (...inputs) =>
      inputs.every((inp) => Number.isFinite(inp));
    const allPositive = (...inputs) => inputs.every((inp) => inp > 0);

    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this._mapEvent.latlng;

    let workoutData;

    if (type === "running") {
      const cadence = +inputCadence.value;

      if (
        !validInputs(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      ) {
        return alert("Необходимо ввести целое положительное число");
      }

      workoutData = {
        type,
        distance,
        duration,
        cadence,
        location: { latitude: lat, longitude: lng },
      };

      await this._sendWorkoutToServer("running", workoutData);

      workoutData.description = `Пробежка ${distance}км за ${duration}мин`;

      this._renderWorkout(workoutData);
      this._hideForm();
      return;
    } else if (type === "cycling") {
      const elevation = +inputElevation.value;

      if (
        !validInputs(distance, duration, elevation) ||
        !allPositive(distance, duration)
      ) {
        return alert("Необходимо ввести целое положительное число");
      }

      workoutData = {
        type,
        distance,
        duration,
        elevation,
        location: { latitude: lat, longitude: lng },
      };

      await this._sendWorkoutToServer("cycling", workoutData);

      workoutData.description = `Велосипедная тренировка ${distance}км за ${duration}мин`;

      this._renderWorkout(workoutData);
      this._hideForm();
      return;
    } else if (type === "swimming") {
      const style = inputStyle.value; // Предполагается наличие поля для стиля плавания
      const strokeCount = +inputStrokeCount.value; // Количество заплывов

      if (
        !validInputs(distance, duration, strokeCount) ||
        !allPositive(distance, duration)
      ) {
        return alert("Необходимо ввести целое положительное число");
      }

      workoutData = {
        type,
        distance,
        duration,
        style,
        strokeCount,
        location: { latitude: lat, longitude: lng },
      };

      await this._sendWorkoutToServer("swimming", workoutData);

      workoutData.description = `Плавание ${distance}м за ${duration}мин`;

      this._renderWorkout(workoutData);
      this._hideForm();
    }
  }

  // Отправка данных на сервер
  async _sendWorkoutToServer(type, data) {
    try {
      const response = await fetch(`/workouts/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Ошибка при отправке данных на сервер");
    } catch (error) {
      console.error(error);
      alert("Не удалось сохранить тренировку.");
    }
  }

  _renderWorkMarker(workout) {
    L.marker([workout.location.latitude, workout.location.longitude])
      .addTo(this._map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: "mark-popup",
        })
      )
      .setPopupContent(
        `${workout.type === "running" ? "🏃‍♂️" : "🚴‍♀️"} ${workout.description}`
      )
      .openPopup();
  }

  _hideForm() {
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        "";
    form.classList.add("hidden");
  }

  async _getWorkouts() {
    try {
      const response = await fetch("/workouts");
      if (!response.ok) throw new Error("Ошибка при загрузке тренировок");

      const data = await response.json();
      this._workouts = data;
      console.log(this._workouts)

      this._workouts.forEach((work) => {
        this._renderWorkout(work);
        this._renderWorkMarker(work);
      });
    } catch (error) {
      console.error(error);
    }
  }

  _renderWorkout(workout) {
    let html = `
       <li class="workout workout--${workout.type}" data-id="${workout.id}">
         <h2 class="workout__title">${workout.description}</h2>
         <div class="workout__details">
           <span class="workout__icon">${
            workout.type === "running" 
            ? "🏃‍♂️" 
            : workout.type === "cycling" 
            ? "🚴‍♀️" 
            : "🏊‍♂️"
           }</span>
           <span class="workout__value">${workout.distance}</span>
           <span class="workout__unit">км</span>
         </div>
         <div class="workout__details">
           <span class="workout__icon">⏱</span>
           <span class="workout__value">${workout.duration}</span>
           <span class="workout__unit">мин</span>
         </div>`;

    if (workout.type === "running") {
      html += `
           <div class="workout__details">
             <span class="workout__icon">⚡️</span>
             <span class="workout__value">${(
               workout.pace
             ).toFixed(1)}</span>
             <span class="workout__unit">мин/км</span>
           </div>
           <div class="workout__details">
             <span class="workout__icon">🦶🏼</span>
             <span class="workout__value">${workout.cadence}</span>
             <span class="workout__unit">шаг</span>
           </div>`;
    } else if (workout.type === "cycling") {
      html += `
           <div class="workout__details">
             <span class="workout__icon">⚡️</span>
             <span class="workout__value">${(
               (workout.speed).toFixed(1)
             )}</span> <!-- Скорость в км/ч -->
             <span class="workout__unit">км/ч</span>
           </div>
           <div class="workout__details">
             <span class="workout__icon">🏔️</span>
             <span class="workout__value">${workout.elevation || 0}</span> <!-- Подъем -->
             <span class="workout__unit">м</span>
           </div>`;
    } else if (workout.type === "swimming") {
      html += `
           <div class="workout__details">
             <span class="workout__icon">⚡️</span>
             <span class="workout__value">${(
               (workout.pace).toFixed(1)
             )}</span> <!-- Темп в минутах на километр -->
             <span class="workout__unit">мин/км</span>
           </div>
           <div class="workout__details">
             <span class="workout__icon">🌊</span>
             <span class="workout__value">${workout.style || 'Не указан'}</span> <!-- Стиль плавания -->
           </div>`;
    }

    html += `</li>`;

    form.insertAdjacentHTML("afterend", html);
}


_moveToPopup(e) {
  const workoutEL = e.target.closest(".workout");
  if (!workoutEL) return;

  // Ищем тренировку по ID в массиве _workouts
  const workout = this._workouts.find(
      (work) => work.id === workoutEL.dataset.id
  );
  console.log(workoutEL)

  // Проверяем, существует ли найденная тренировка и есть ли у нее местоположение
  if (workout && workout.location) {
      // Проверяем наличие координат
      const { latitude, longitude } = workout.location;

      // Устанавливаем вид карты на координаты местоположения
      this._map.setView(
          [latitude, longitude],
          13,
          { animate: true, pan: { duration: 1 } }
      );
  } else {
      console.error("Workout not found or location is undefined:", workout);
  }
}

}

if (document.getElementById("map")) {
  const app = new App();
}
