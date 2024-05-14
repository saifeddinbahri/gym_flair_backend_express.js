import EventModel from "../models/Event.js";

export async function getEvents(req,res) {
try {
        const events = await EventModel.find({}).populate('reservedBy').lean().exec();

        events.forEach(event => {
            event.count = event.reservedBy.length
            const userExists = event.reservedBy.some(user => {
                return user._id.equals(req.userId);
            });
            event.booked = userExists
            delete event.reservedBy;
        });
        
        res.status(200).json({events})
    } catch (error) {
        res.status(500).json({"message": "Server error"})
        console.error("Error:", error);
    }
    
}

export async function createEvent(req, res) {
    try {
        const { nom, date, start, photo, desc }=req.body;
        const cour = new EventModel({nom, date, start, photo, desc});
        await cour.save();
        res.status(200).send('Event added successfully');
    } catch (error) {
        res.status(400).send(error.message)
    }
}

export async function reserveEvent(req, res) {
    const { eventId } = req.body
    try {
        const updatedEvent = await EventModel.findByIdAndUpdate(
            eventId,
            { $push: { reservedBy: req.userId } },
            { new: true }
        ).exec();
        
        if (!updatedEvent) {
            res.status(400).json({"message": "failed to join event"})
            console.log("event not found.");
            return;
        }
        res.status(200).json({"message": "success"})
        console.log("event updated:", updatedEvent);
    } catch (error) {
        res.status(500).json({"messgae": "Server error"})
        console.error("Error:", error);
    }
}