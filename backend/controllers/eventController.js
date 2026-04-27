import * as eventService from '../services/eventService.js';

export const getEvents = async (req, res, next) => {
  try {
    const events = await eventService.getAllEvents();
    res.json(events);
  } catch (err) { next(err); }
};

export const createEvent = async (req, res, next) => {
  try {
    const event = await eventService.createEvent(req.body, req.files);
    res.status(201).json(event);
  } catch (err) { next(err); }
};

export const updateEvent = async (req, res, next) => {
  try {
    const event = await eventService.updateEvent(req.params.id, req.body, req.files);
    res.json(event);
  } catch (err) { next(err); }
};

export const deleteEvent = async (req, res, next) => {
  try {
    await eventService.deleteEvent(req.params.id);
    res.json({ message: "Event deleted" });
  } catch (err) { next(err); }
};
