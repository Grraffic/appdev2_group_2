const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");

// Create
router.post("/", async (req, res) => {
  try {
    const { name, date, time, status } = req.body;
    const newAppointment = new Appointment({ name, date, time, status });
    await newAppointment.save();
    res.status(201).json(newAppointment);
  } catch (err) {
    res.status(500).json({ error: "Failed to create appointment" });
  }
});

// Read
router.get("/", async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
});

// Update
router.put("/:id", async (req, res) => {
  try {
    const { name, date, time, status } = req.body;
    const updated = await Appointment.findByIdAndUpdate(
      req.params.id,
      { name, date, time, status },
      { new: true }
    );
    if (!updated)
      return res.status(404).json({ error: "Appointment not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update appointment" });
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Appointment.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ error: "Appointment not found" });
    res.json({ message: "Appointment deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete appointment" });
  }
});

module.exports = router;
