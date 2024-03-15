import { User } from "../models/UserModel.js";

export async function addGlucoseLog(req, res) {
  try {
    console.log("req.body: ", req.body);
    let glucoseValue = req.body.glucose_value;
    let timestamp = req.body.timestamp;

    // Check if the authenticated user is the same as the user to be updated
    if (req.user.userId !== req.params.id) {
      return res.status(403).send({ error: "Authorization failed." });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    const newReading = {
      glucoseValue: glucoseValue,
      timestamp: timestamp,
    };

    const createdReading =
      user.healthProfile.glucoseReadings.create(newReading);
    user.healthProfile.glucoseReadings.push(createdReading);

    await user.save();

    const data = {
      glucoseValue: glucoseValue,
      timestamp: timestamp,
      id: createdReading._id,
    };

    res.status(200).send({
      data,
      message: "Glucose value added successfully",
    });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).send(error);
  }
}

export async function fetchGlucoseLog(req, res) {
  try {
    // Check if the authenticated user is the same as the user to be updated
    if (req.user.userId !== req.params.id) {
      return res.status(403).send({ error: "Authorization failed." });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    const date = new Date(req.params.date);
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    // Filter the glucose readings to include only those from the specified date
    const glucoseReadingsForDate = user.healthProfile.glucoseReadings.filter(
      (reading) => {
        const readingDate = new Date(reading.timestamp);
        return readingDate >= startOfDay && readingDate <= endOfDay;
      }
    );

    // Extract the glucose values and timestamps
    const glucoseValues = glucoseReadingsForDate.map(
      (reading) => reading.glucoseValue
    );
    const timestamps = glucoseReadingsForDate.map((reading) => {
      const readingDate = new Date(reading.timestamp);
      return readingDate;
    });
    const glucoseIds = glucoseReadingsForDate.map((reading) => reading._id);

    const data = {
      glucoseValues,
      timestamps,
      glucoseIds,
    };

    res.status(200).send({
      data,
      message: "Glucose values fetched successfully",
    });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).send(error);
  }
}

export async function updateGlucoseLog(req, res) {
  try {
    // Check if the authenticated user is the same as the user to be updated
    if (req.user.userId !== req.params.id) {
      return res.status(403).send({ error: "Authorization failed." });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    const reading = user.healthProfile.glucoseReadings.id(req.params.readingId);

    if (!reading) {
      return res.status(404).send({ error: "Reading not found" });
    }

    reading.glucoseValue = req.body.glucoseValue;
    reading.timestamp = req.body.timestamp;

    await user.save();

    res.status(200).send({
      message: "Glucose value and timestamp updated successfully",
    });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).send(error);
  }
}

export async function deleteGlucoseLog(req, res) {
  try {
    // Check if the authenticated user is the same as the user to be updated
    if (req.user.userId !== req.params.id) {
      return res.status(403).send({ error: "Authorization failed." });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    const reading = user.healthProfile.glucoseReadings.id(req.params.readingId);

    if (!reading) {
      return res.status(404).send({ error: "Reading not found" });
    }

    user.healthProfile.glucoseReadings.remove(reading);

    await user.save();

    res.status(200).send({
      message: "Glucose value deleted successfully",
    });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).send(error);
  }
}

export async function fetchLatestValues(req, res) {
  try {
    // Check if the authenticated user is the same as the user to be updated
    if (req.user.userId !== req.params.id) {
      return res.status(403).send({ error: "Authorization failed." });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const pastWeekGlucoseReadings = user.healthProfile.glucoseReadings.filter(
      (reading) => new Date(reading.timestamp) >= oneWeekAgo
    );

    const latestGlucoseReadings = pastWeekGlucoseReadings
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10);

    const glucoseValues = latestGlucoseReadings.map(
      (reading) => reading.glucoseValue
    );
    const timestamps = latestGlucoseReadings.map((reading) => {
      const readingDate = new Date(reading.timestamp);
      return readingDate;
    });
    const glucoseIds = latestGlucoseReadings.map((reading) => reading._id);

    const data = {
      glucoseValues,
      timestamps,
      glucoseIds,
    };

    res.status(200).send({
      data,
      message: "Latest glucose values from the past week fetched successfully",
    });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).send(error);
  }
}
