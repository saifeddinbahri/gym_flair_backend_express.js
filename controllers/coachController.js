import CoachModel from '../models/Coach.js';

//Show coachs
export async function showCoachs(req,res) {
    
    const coachs = await CoachModel.find();
        if(coachs){
            res.json(coachs);
        }else{
            res.status(404).json({message:"Coachs not found"});
        }
    
}

//create coach
export async function create(req, res) {
    try {
        const {firstname, lastname,email,phone,photo,speciality}=req.body;
        const coach = new CoachModel({firstname, lastname,email,phone,photo,speciality});
        await coach.save();
        res.status(201).send('Coach added successfully');
    } catch (error) {
        res.status(400).send(error.message)
    }
};



//Show coach
export async function showCoach(req,res) {
    const {id} = req.params;
    const coach = await CoachModel.findById(id);
        if(coach){
            res.json(coach);
        }else{
            res.status(404).json({message:"Coach not found"});
        }
    
}

//Edit coach
export async function editCoach (req, res)  {
    const {firstname, lastname,email,phone,photo,speciality} = req.body;
    const {id}=req.params;
    try {
        await CoachModel.findByIdAndUpdate(id, {firstname, lastname,email,phone,photo,speciality});
        res.json({ message: "Coach updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//delete coach
export async function deleteCoach(req,res) {
    try {
       const {id} = req.params;
       await CoachModel.findByIdAndDelete(id)
       res.send('Coach deleted successfully')
    } catch (error) {
        res.status(400).send(error.message)
    }
};
