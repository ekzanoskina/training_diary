const express = require("express");
const { User, Running, Swimming, Cycling, Location } = require("../db/models");

const router = express.Router();

// Получение всех тренировок
router.get("/", async (req, res) => {
  try {
    const user = req.session.user || null;
    console.log(user);
    if (!user) {
      return res.status(401).json({ message: "Пользователь не авторизован" });
    }

    // Получаем идентификатор пользователя
    const userId = user.id; // Предполагается, что идентификатор пользователя хранится в req.session.user.id

    // Фильтруем тренировки по userId
    const runningWorkouts = await Running.findAll({
      where: { userId }, // Фильтр по userId
      include: [{ model: User }, { model: Location, as: "location" }],
    });

    const cyclingWorkouts = await Cycling.findAll({
      where: { userId }, // Фильтр по userId
      include: [{ model: User }, { model: Location, as: "location" }],
    });

    const swimmingWorkouts = await Swimming.findAll({
      where: { userId }, // Фильтр по userId
      include: [{ model: User }, { model: Location, as: "location" }],
    });

    // Добавляем тип тренировки к каждому объекту
    const workouts = [
      ...runningWorkouts.map((workout) => ({
        ...workout.toJSON(),
        type: "running",
        description: makeDescription("running", workout.date),
        // location: workout.location ? workout.location.toJSON() : null // Получаем местоположение
      })),
      ...cyclingWorkouts.map((workout) => ({
        ...workout.toJSON(),
        type: "cycling",
        description: makeDescription("cycling", workout.date),
        // location: workout.location ? workout.location.toJSON() : null // Получаем местоположение
      })),
      ...swimmingWorkouts.map((workout) => ({
        ...workout.toJSON(),
        type: "swimming",
        description: makeDescription("swimming", workout.date),
        // location: workout.location ? workout.location.toJSON() : null // Получаем местоположение
      })),
    ];

    function makeDescription(type, date) {
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const description = `${type[0].toUpperCase()}${type.slice(1)} ${
        months[date.getMonth()]
      } ${date.getDate()}`;
      return description;
    }

    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: `Ошибка сервера ${error}` });
  }
});

// Создание тренировки
router.post("/", async (req, res) => {
  const workoutData = req.body;
  const type = workoutData.type;
  const user = req.session.user || null;
  const userId = user.id;

  try {
    // Создайте запись о местоположении
    const location = await Location.create({
      latitude: workoutData.location.latitude,
      longitude: workoutData.location.longitude,
    });

    let workout;

    // Вычисление pace и speed
    if (type === "running") {
      const distance = workoutData.distance; // в км
      const duration = workoutData.duration; // в минутах

      // Расчет pace
      const pace = (duration / distance).toFixed(1);
      workout = await Running.create({
        ...workoutData,
        userId,
        locationId: location.id,
        pace: pace, // Округляем до 1 знака после запятой
      });
    } else if (type === "cycling") {
      const distance = workoutData.distance; // в км
      const duration = workoutData.duration; // в минутах

      // Расчет speed
      const speed = (distance / (duration / 60)).toFixed(1); // speed в км/ч

      workout = await Cycling.create({
        ...workoutData,
        userId,
        locationId: location.id,
        speed: speed, // Добавляем рассчитанную скорость
      });
    } else if (type === "swimming") {
      const distance = workoutData.distance; // в км
      const duration = workoutData.duration; // в минутах

      // Расчет speed
      const pace = (distance / (duration / 60)).toFixed(1); // speed в км/ч
      workout = await Swimming.create({
        ...workoutData,
        userId,
        pace,
        locationId: location.id,
      });
    } else {
      return res.status(400).json({ message: "Неизвестный тип тренировки" });
    }

    res.status(201).json(workout);
  } catch (error) {
    console.error(error); // Логируем ошибку для отладки
    res.status(500).json({ message: `Ошибка сервера: ${error.message}` });
  }
});

// Удаление тренировки по ID
router.delete("/", async (req, res) => {
  const workoutId = req.body.id;
  const workoutType = req.body.type;

  try {
    let deletedWorkout;
    if (workoutType === "running") {
      deletedWorkout = await Running.findByPk(workoutId);
    } else if (workoutType === "cycling") {
      deletedWorkout = await Cycling.findByPk(workoutId);
    } else if (workoutType === "swimming") {
      deletedWorkout = await Swimming.findByPk(workoutId);
    }

    if (!deletedWorkout) {
      return res.status(404).send("Тренировка не найдена");
    }
    deletedWorkout.destroy();
    res.status(204).send(); // Успешно удалено, без содержимого
  } catch (error) {
    console.error("Ошибка при удалении:", error);
    res.status(500).send("Ошибка при удалении тренировки");
  }
});
router.put('/:type/:id', async (req, res) => {
  const { type, id } = req.params;
  const updateData = req.body;

  let Model;
  switch (type) {
      case 'running':
          Model = Running;
          break;
      case 'swimming':
          Model = Swimming;
          break;
      case 'cycling':
          Model = Cycling;
          break;
      default:
          return res.status(400).json({ message: 'Invalid workout type' });
  }

  try {
      const workout = await Model.findByPk(id);

      if (!workout) {
          return res.status(404).json({ message: 'Workout not found' });
      }
      workout.update(updateData)
      return res.status(200).json(workout);
  } catch (error) {
      console.error('Error updating workout:', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = router;
