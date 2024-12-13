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
  _markers = [];
  _changeFlag = false;

  constructor() {
    this._getPosition();
    this._getWorkouts(); // Получаем тренировки с сервера


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

    this._map.on("click", (e) => {

      this._showForm(e);
      form.addEventListener("submit", (e) => this._handleNewWorkout(e), { once: true });
    });
    

    this._workouts.forEach((work) => {
      this._renderWorkMarker(work);
    });
  }
  _showForm(mapE) {
    this._mapEvent = mapE;
    form.classList.remove("hidden");
    inputDistance.focus();
  
    // if (workoutId) {
    //   // Если передан ID, это обновление существующей тренировки
      
    // } else {
    //   // Если ID не передан, это новая тренировка
    //   form.addEventListener("submit", this._handleNewWorkout.bind(this));
    // }
  }
  

  _handleNewWorkout = async (e) => {
    e.preventDefault();
    await this._newWorkout();
  }
  
  _handleUpdateWorkout = async (e, id) => {
    e.preventDefault();
    await this._updateWorkout(id);
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

  async _newWorkout() {

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
        return alert("Необходимо ввести целые положительные числа");
      }

      const pace = duration / distance; // pace в мин/км

      workoutData = {
        date: new Date(),
        type,
        distance,
        duration,
        cadence,
        pace: pace.toFixed(1),
        location: { latitude: lat, longitude: lng },
      };

      await this._sendWorkoutToServer("running", workoutData);
      this._hideForm();
      await this._getWorkouts(); // Обновляем список тренировок
      return;
    } else if (type === "cycling") {
      const elevation = +inputElevation.value;

      if (
        !validInputs(distance, duration, elevation) ||
        !allPositive(distance, duration, elevation)
      ) {
        return alert("Необходимо ввести целые положительные числа");
      }

      const speed = (distance / (duration / 60)).toFixed(1); // speed в км/ч

      workoutData = {
        date: new Date(),
        type,
        distance,
        duration,
        elevation,
        speed: speed,
        location: { latitude: lat, longitude: lng },
      };

      await this._sendWorkoutToServer("cycling", workoutData);
      this._hideForm();
      await this._getWorkouts(); // Обновляем список тренировок
      return;
    } else if (type === "swimming") {
      const style = inputStyle.value;

      if (
        !validInputs(distance, duration) ||
        !allPositive(distance, duration)
      ) {
        return alert("Необходимо ввести целые положительные числа");
      }

      workoutData = {
        date: new Date(),
        type,
        distance,
        duration,
        style,
        location: { latitude: lat, longitude: lng },
      };

      await this._sendWorkoutToServer("swimming", workoutData);

      this._hideForm();
      await this._getWorkouts(); // Обновляем список тренировок
    } else {
      return alert("Неизвестный тип тренировки");
    }
  }

  // Отправка данных на сервер
  async _sendWorkoutToServer(type, data) {
    try {
      const response = await fetch(`/workouts`, {
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
    const marker = L.marker([
      workout.location.latitude,
      workout.location.longitude,
    ])
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
    this._markers.push(marker);
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

      // Очищаем предыдущие тренировки перед рендерингом новых
      // Очищаем все элементы <li> внутри <ul class="workouts">
      const workoutItems = containerWorkouts.querySelectorAll("li");
      workoutItems.forEach((item) => item.remove()); // Удаляем каждый элемент <li>

      this._workouts.forEach((work) => {
        this._renderWorkout(work);
        this._renderWorkMarker(work);
      });
    } catch (error) {
      console.error(error);
      alert("Не удалось загрузить тренировки.");
    }
  }

  _renderWorkout(workout) {
    let html = `
       <li class="workout workout--${workout.type}" data-type="${
      workout.type
    }" data-id="${workout.id}">
         <div class="workout__header"><h2 class="workout__title">${
           workout.description
         }</h2><div class="buttons-box"><i class="fa-solid pencil fa-pencil"></i><i class="fa-solid fa-xmark cross"></i></div></div>
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
             <span class="workout__value">${workout.pace}</span>
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
             <span class="workout__value">${workout.speed.toFixed(
               1
             )}</span> <!-- Скорость в км/ч -->
             <span class="workout__unit">км/ч</span>
           </div>
           <div class="workout__details">
             <span class="workout__icon">🏔️</span>
             <span class="workout__value">${
               workout.elevation || 0
             }</span> <!-- Подъем -->
             <span class="workout__unit">м</span>
           </div>`;
    } else if (workout.type === "swimming") {
      html += `
           <div class="workout__details">
             <span class="workout__icon">⚡️</span>
             <span class="workout__value">${
               workout.pace
             }</span> <!-- Темп в минутах на километр -->
             <span class="workout__unit">мин/км</span>
           </div>
           <div class="workout__details">
             <span class="workout__icon">🌊</span>
             <span class="workout__value">${
               workout.style || "Не указан"
             }</span> <!-- Стиль плавания -->
           </div>`;
    }
    html += `
     </li>`;

    // Вставляем HTML
    containerWorkouts.insertAdjacentHTML("beforeend", html);

    // Добавляем обработчик события для удаления тренировки
    const deleteButton = containerWorkouts.querySelector(
      `li[data-id="${workout.id}"] .cross`
    );

    deleteButton.addEventListener("click", () =>
      this._deleteWorkout(workout.type, workout.id)
    );
    const changeButton = containerWorkouts.querySelector(
      `li[data-id="${workout.id}"] .pencil`
    );
    changeButton.addEventListener("click", () => {
      this._changeWorkout(workout.type, workout.id);
    });
  }

  _changeWorkout(type, id) {
    const workout = this._workouts.find((work) => work.id === id);
    if (!workout) return alert("Workout not found");

    // Populate form fields with existing workout data
    inputType.value = workout.type;
    inputDistance.value = workout.distance;
    inputDuration.value = workout.duration;

    if (type === "running") {
      inputCadence.value = workout.cadence;
      inputElevation.closest(".form__row").classList.add("form__row--hidden");
      inputStyle.closest(".form__row").classList.add("form__row--hidden");
      inputCadence.closest(".form__row").classList.remove("form__row--hidden");
    } else if (type === "cycling") {
      inputElevation.value = workout.elevation;
      inputCadence.closest(".form__row").classList.add("form__row--hidden");
      inputStyle.closest(".form__row").classList.add("form__row--hidden");
      inputElevation
        .closest(".form__row")
        .classList.remove("form__row--hidden");
    } else if (type === "swimming") {
      inputStyle.value = workout.style;
      inputCadence.closest(".form__row").classList.add("form__row--hidden");
      inputElevation.closest(".form__row").classList.add("form__row--hidden");
      inputStyle.closest(".form__row").classList.remove("form__row--hidden");
    }
  
    form.addEventListener("submit", (e) => this._handleUpdateWorkout(e, id), { once: true });
    this._showForm(null)    

  }

  // Метод для удаления всех маркеров
  _removeAllMarkers() {
    this._markers.forEach((marker) => {
      this._map.removeLayer(marker); // Удаляем маркер с карты
    });
    this._markers = []; // Очищаем массив маркеров
  }

  async _deleteWorkout(type, id) {
    try {
      const response = await fetch(`/workouts`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, id }),
      });

      if (!response.ok) throw new Error("Ошибка при удалении тренировки");

      // Удаляем элемент из DOM
      const workoutElement = containerWorkouts.querySelector(
        `[data-id="${id}"]`
      );
      if (workoutElement) {
        workoutElement.remove();
      }

      this._removeAllMarkers();
      // Обновляем список тренировок
      await this._getWorkouts();
    } catch (error) {
      console.error("Ошибка:", error);
      alert("Не удалось удалить тренировку.");
    }
  }

  async _updateWorkout(id) {
    const validInputs = (...inputs) =>
      inputs.every((inp) => Number.isFinite(inp));
    const allPositive = (...inputs) => inputs.every((inp) => inp > 0);

    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;

    let updateData;

    if (type === "running") {
      const cadence = +inputCadence.value;
      if (
        !validInputs(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      ) {
        return alert("Please enter valid positive numbers.");
      }
      updateData = { distance, duration, cadence };
    } else if (type === "cycling") {
      const elevation = +inputElevation.value;
      if (
        !validInputs(distance, duration, elevation) ||
        !allPositive(distance, duration, elevation)
      ) {
        return alert("Please enter valid positive numbers.");
      }
      updateData = { distance, duration, elevation };
    } else if (type === "swimming") {
      const style = inputStyle.value;
      if (
        !validInputs(distance, duration) ||
        !allPositive(distance, duration)
      ) {
        return alert("Please enter valid positive numbers.");
      }
      updateData = { distance, duration, style };
    } else {
      return alert("Unknown workout type.");
    }

    try {
      const response = await fetch(`/workouts/${type}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) throw new Error("Failed to update workout.");

      // Refresh workouts after successful update
      await this._getWorkouts();
    } catch (error) {
      console.error(error);
      alert("Could not update the workout.");
    } finally {
      this._hideForm();
    }
  }

  _moveToPopup(e) {
    const workoutEL = e.target.closest(".workout");
    if (!workoutEL) return;

    // Ищем тренировку по ID в массиве _workouts
    const workout = this._workouts.find(
      (work) => work.id === workoutEL.dataset.id
    );
    console.log(workoutEL);

    // Проверяем, существует ли найденная тренировка и есть ли у нее местоположение
    if (workout && workout.location) {
      // Проверяем наличие координат
      const { latitude, longitude } = workout.location;

      // Устанавливаем вид карты на координаты местоположения
      this._map.setView([latitude, longitude], 13, {
        animate: true,
        pan: { duration: 1 },
      });
    } else {
      console.error("Workout not found or location is undefined:", workout);
    }
  }
}

if (document.getElementById("map")) {
  const app = new App();
}
