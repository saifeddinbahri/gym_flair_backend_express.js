import CourModel from '../models/Cour.js';

//Show cours
export async function showCours(req,res) {
    
    try {
        const courses = await CourModel.find({}).populate('reservedBy').populate('coach').lean().exec();

        courses.forEach(course => {
            course.count = course.reservedBy.length
            const userExists = course.reservedBy.some(user => {
                return user._id.equals(req.userId);
            });
            course.booked = userExists
            delete course.reservedBy;
        });
        
        res.status(200).json({courses})
    } catch (error) {
        res.status(500).json({"message": "Server error"})
        console.error("Error:", error);
    }
    
}

//create cour
export async function create(req, res) {
    try {
        const { nom, capacite, date, start, end, coach }=req.body;
        const cour = new CourModel({nom, capacite, date, start, end, coach});
        await cour.save();
        res.status(200).send('Cour added successfully');
    } catch (error) {
        res.status(400).send(error.message)
    }
};

export async function reserveCours(req, res) {
    const { courseId } = req.body
    try {
        const updatedCourse = await CourModel.findByIdAndUpdate(
            courseId,
            { $push: { reservedBy: req.userId } },
            { new: true }
        ).exec();
        
        if (!updatedCourse) {
            res.status(400).json({"message": "failed to book course"})
            console.log("Course not found.");
            return;
        }
        res.status(200).json({"message": "success"})
        console.log("Course updated:", updatedCourse);
    } catch (error) {
        res.status(500).json({"messgae": "Server error"})
        console.error("Error:", error);
    }
}

//Show cour
export async function showCour(req,res) {
    const {id} = req.params;
    const cour = await CourModel.findById(id);
        if(cour){
            res.json(cour);
        }else{
            res.status(404).json({message:"Cour not found"});
        }
    
}

//Edit cour
export async function editCour (req, res)  {
    const {nom,capacite,jours,heuredebut,heurefin,equipments,coachs} = req.body;
    const {id}=req.params;
    try {
        await CourModel.findByIdAndUpdate(id, {nom,capacite,jours,heuredebut,heurefin,equipments,coachs});
        res.json({ message: "Cour updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//delete cour
export async function deleteCour(req,res) {
    try {
       const {id} = req.params;
       await CourModel.findByIdAndDelete(id)
       res.send('Cour deleted successfully')
    } catch (error) {
        res.status(400).send(error.message)
    }
};
