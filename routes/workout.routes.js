const express = require("express");
const { User, Running, Swimming, Cycling, Location } = require("../db/models");

const router = express.Router();

// Получение всех тренировок
router.get("/", async (req, res) => {
  try {
    const runningWorkouts = await Running.findAll({
      include: [{ model: User }, { model: Location, as: "location" }],
    });

    const cyclingWorkouts = await Cycling.findAll({
      include: [{ model: User }, { model: Location, as: "location" }],
    });

    const swimmingWorkouts = await Swimming.findAll({
      include: [{ model: User }, { model: Location, as: "location" }],
    });

    // Добавляем тип тренировки к каждому объекту
    const workouts = [
        ...runningWorkouts.map((workout) => ({
          ...workout.toJSON(),
          type: "running",
          description: makeDescription("running", workout.date),
          location: workout.location ? workout.location.toJSON() : null // Получаем местоположение

        })),
        ...cyclingWorkouts.map((workout) => ({
          ...workout.toJSON(),
          type: "cycling",
          description: makeDescription("cycling", workout.date),
          location: workout.location ? workout.location.toJSON() : null // Получаем местоположение
        })),
        ...swimmingWorkouts.map((workout) => ({
          ...workout.toJSON(),
          type: "swimming",
          description: makeDescription("swimming", workout.date),
          location: workout.location ? workout.location.toJSON() : null // Получаем местоположение
        })),
      ];

    function makeDescription (type, date)  {
      // prettier-ignore
      const months = ["January","February","March","April","May","June","July","August","September","October","November","December",];
      const description = `${type[0].toUpperCase()}${type.slice(1)} ${
        months[date.getMonth()]
      } ${date.getDate()}`;
      return description;
    };

    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: `Ошибка сервера ${error}` });
  }
});

// Создание тренировки
router.post("/:type", async (req, res) => {
  const { type } = req.params;
  const workoutData = req.body;

  try {
    // Создайте запись о местоположении
    const location = await Location.create({
      latitude: workoutData.location.latitude,
      longitude: workoutData.location.longitude,
    });

    let workout;
    if (type === "running") {
      workout = await Running.create({
        ...workoutData,
        locationId: location.id,
      });
    } else if (type === "cycling") {
      workout = await Cycling.create({
        ...workoutData,
        locationId: location.id,
      });
    } else if (type === "swimming") {
      workout = await Swimming.create({
        ...workoutData,
        locationId: location.id,
      });
    }

    res.status(201).json(workout);
  } catch (error) {
    res.status(500).json({ message: `Ошибка сервера: ${error}` });
  }
});

module.exports = router;
