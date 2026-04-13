const Event = require('../models/Event');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

const getEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createEvent = async (req, res) => {
    try {
        const { title, description, date, location, type, capacity, imageUrl } = req.body;

        const event = await Event.create({
            title,
            description,
            date,
            location,
            type,
            capacity,
            imageUrl
        });

        // Broadcast email to all users silently
        try {
            const users = await User.find({}, 'email name');
            const emailPromises = users.map(user => {
                const message = `Hello ${user.name},\n\nA new event "${title}" has been added to CampusConnect! It is scheduled for ${new Date(date).toLocaleDateString()} at ${location}.\n\nCheck it out and register on the platform.`;
                const htmlStr = `<p>Hello ${user.name},</p><p>A new event "<strong>${title}</strong>" has been added to CampusConnect!</p><ul><li><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</li><li><strong>Location:</strong> ${location}</li></ul><p>Check it out and register on the platform!</p>`;
                
                return sendEmail({
                    email: user.email,
                    subject: `New Event Alert: ${title}`,
                    message: message,
                    html: htmlStr
                });
            });
            // We do not await this so the API response isn't blocked
            Promise.all(emailPromises).catch(err => console.error('Email broadcast failed:', err));
        } catch (emailErr) {
            console.error('Error fetching users for email broadcast:', emailErr);
        }

        res.status(201).json(event);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        await event.deleteOne();
        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if(!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        
        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        res.status(200).json(updatedEvent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const registerForEvent = async (req, res) => {
    try {
        console.log(`[Registration] User ${req.user.name} (${req.user._id}) attempting to register for event ${req.params.id}`);

        const event = await Event.findById(req.params.id);
        if (!event) {
            console.log(`[Registration Blocked] Event ${req.params.id} not found`);
            return res.status(404).json({ message: 'Event not found' });
        }

        // Robust check for existing registration
        const isAlreadyRegistered = event.registeredStudents.some(
            studentId => studentId.toString() === req.user._id.toString()
        );

        if (isAlreadyRegistered) {
            console.log(`[Registration Blocked] User already registered for event: ${event.title}`);
            return res.status(400).json({ message: 'Already registered for this event' });
        }

        if (event.registeredStudents.length >= event.capacity) {
            console.log(`[Registration Blocked] Event at full capacity: ${event.title}`);
            return res.status(400).json({ message: 'Event is at full capacity' });
        }

        event.registeredStudents.push(req.user._id);
        await event.save();

        const user = await User.findById(req.user._id);
        user.registeredEvents.push(event._id);
        await user.save();

        console.log(`[Registration Success] ${req.user.name} registered for ${event.title}`);
        res.status(200).json({ message: 'Successfully registered for event', event });
    } catch (error) {
        console.error('[Registration Error]', error);
        res.status(500).json({ message: error.message });
    }
};

const getMyEvents = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate({
            path: 'registeredEvents',
            options: { sort: { date: 1 } }
        });
        res.status(200).json(user.registeredEvents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getEvents,
    createEvent,
    deleteEvent,
    updateEvent,
    registerForEvent,
    getMyEvents
};
