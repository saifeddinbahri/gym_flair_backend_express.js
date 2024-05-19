import EquipmentModel from '../models/Equipment.js';

//Show equipments
export async function showEquipments(req, res) {
    try {
      const equipments = await EquipmentModel.find();
  
      for (let i = 0; i < equipments.length; i++) {
        const equipment = equipments[i];
        
        if (equipment.reservedBy && equipment.reservedBy.end) {
          const currentDate = new Date();
          const endDate = new Date(equipment.reservedBy.end);
          
          if (endDate < currentDate) {
            console.log(endDate)
            console.log(currentDate)
            equipment.reservedBy = {};
            await equipment.save();
          }
        }
      }
  
      const availableEquipments = equipments.filter(equipment => {
        return !equipment.reservedBy.end; 
      });
  
      res.status(200).json(availableEquipments);
    } catch (error) {
      console.error('Error fetching and updating equipments:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  export async function allShowEquipments(req, res) {
    try {
      // Fetch equipments with user populated if reservedBy.user is not null
      const equipments = await EquipmentModel.find()
      let data = []
      // Transform the reservedBy field
      for (let i=0; i<equipments.length; i++) {
        let equipment = equipments[i]
        if(equipment.reservedBy.end){
          console.log(equipment.reservedBy)
          await equipment.populate('reservedBy.user', 'username')
        }
        const reservedByText = formatReservedBy(equipment.reservedBy);
        data=[...data, {
           nom: equipment.nom,
           prix: equipment.prix, 
           reservation: reservedByText,
           desc: equipment.description,
           image: equipment.image
          }] 
      }
      res.json(data);
    } catch (error) {
      console.error('Error fetching equipments:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  }

  const formatReservedBy = (reservedBy) => {
    if (!reservedBy || !reservedBy.start || !reservedBy.end) {
      return 'Not reserved';
    }
    console.log(reservedBy)
    const start = new Date(reservedBy.start);
    const end = new Date(reservedBy.end);
    const duration = (end - start) / (1000 * 60 * 60); // duration in hours
  
    return `${reservedBy.user.username} reserved on ${start.toDateString()} for ${duration} hours`;
  };

 

export default async function reserveEquipment(req, res) {
    try {
        
        const { equipmentId, start, end } = req.body;
    
        // Find the equipment by ID
        const equipment = await EquipmentModel.findById(equipmentId);
        if (!equipment) {
          return res.status(404).json({ error: 'Equipment not found' });
        }
    
        // Update the reservedBy field with user ID and reservation dates
        const dstart = new Date(start) 
        const dend = new Date(end)
        dstart.setHours(dstart.getHours()+1)
        dend.setHours(dend.getHours()+1)
        equipment.reservedBy = {
          user: req.userId,
          start: dstart,
          end: dend
        };
        // Save the updated equipment
        await equipment.save();
        console.log("this is when reserving")
        console.log(start)
        console.log(end)
        res.status(200).json({ message: 'Equipment reserved successfully' });
      } catch (error) {
        console.error('Error reserving equipment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}


//create equipment
export async function create(req, res) {
    try {
        const { nom, description, image, prix } = req.body;
        const equipement = new EquipmentModel({ nom, description, image, prix });
        await equipement.save();
        res.status(201).send('Equipment added successfully');
    } catch (error) {
        res.status(400).send(error.message)
    }
};



//Show equipment
export async function showEquipment(req,res) {
    const {id} = req.params;
    const equipement = await EquipmentModel.findById(id);
        if(equipement){
            res.json(equipement);
        }else{
            res.status(404).json({message:"Equipment not found"});
        }
    
}

//Edit equipment
export async function editEquipment (req, res)  {
    const {nom,description,image,stock} = req.body;
    const {id}=req.params;
    try {
        await EquipmentModel.findByIdAndUpdate(id, {nom,description,image,stock});
        res.json({ message: "Equipment updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//delete equipment
export async function deleteEquipment(req,res) {
    try {
       const {id} = req.params;
       await EquipmentModel.findByIdAndDelete(id)
       res.send('Equipment deleted successfully')
    } catch (error) {
        res.status(400).send(error.message)
    }
};
