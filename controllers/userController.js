import UserModel from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';





//Signup
export async function signup(req, res) {
    const { username, birth, email, phone, role, password } = req.body;
    try {
        // Check if the user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        // Create new user
        const newUser = new UserModel({ username, birth, email, phone, photo: req.file.filename, role, password });
        await newUser.save();
        res.json({ message: "User registered successfully" });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
};




// Signin
export async function signin (req, res) {
    const { username, password } = req.body;
    const cookieAge = 1000 * 60 * 60 * 24 * 30
    try {
        // Check if user exists
        const user = await UserModel.findOne({ username });
        
        if (!user) {
            return res.status(401).json({ message: "Invalid username " });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }
        // Create and send JWT token
        const token = jwt.sign({ userId: user._id }, 'your_secret_key', { expiresIn: '10 days' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export async function signWeb (req, res) {
    const { username, password } = req.body;
    console.log(req.body)
    const cookieAge = 1000 * 60 * 60 * 24 * 30
    try {
        // Check if user exists
        const user = await UserModel.findOne({ username });
        
        if (!user) {
            return res.status(401).json({ message: "Invalid username " });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }
        // Create and send JWT token
        const token = jwt.sign({ userId: user._id, role: user.role }, 'your_secret_key', { expiresIn: '10 days' });
        res.cookie('__md_e', token, {httpOnly: true, maxAge: cookieAge})
        res.json({ redirectTo: '/views/equipments' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




//show user
export async function profile (req,res) {
    const id = req.userId
    UserModel.findById(id)
       .then(user=>{
        if(user){
            res.json(user);
        }else {
            res.status(404).json({message:"User not found"});
        }
       })
       .catch(err=> res.status(500).json({message: err.message}));
}



//Edit profile
export async function editProfile (req, res)  {
    const {firstname, lastname,birth,email,phone,photo} = req.body;
    const {id}=req.params;
    try {
        await UserModel.findByIdAndUpdate(id, {firstname, lastname,birth,email,phone,photo});
        res.json({ message: "Profile updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export async function editProfileImage (req, res)  {
    try {
        let user = await UserModel.findByIdAndUpdate(req.userId, {photo: req.file.filename});
        res.status(200).json({ photo: req.file.filename });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export async function editUsername (req, res)  {
    const { username } = req.body
    try {
        let user = await UserModel.findOne({username})
        if(!user) {
            await UserModel.findByIdAndUpdate(req.userId, { username });
            res.status(200).json({ username })
        } else {
            res.status(409).json({message: 'username exist'})
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export async function editBirth (req, res)  {
    const { birth } = req.body
    try {
        let user = await UserModel.findByIdAndUpdate(req.userId, { birth });
        res.status(200).json({ birth });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export async function editEmail (req, res)  {
    const { email } = req.body
    try {
        let user = await UserModel.findOne({email})
        if(!user) {
            await UserModel.findByIdAndUpdate(req.userId, { email });
            console.log(user)
            res.status(200).json({ email });
        } else {
            res.status(409).json({message: 'email exist'})
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//delete profile
export async function deleteProfile (req,res) {
    try {
       const {id} = req.params;
       await UserModel.findByIdAndDelete(id)
       res.send('User deleted successfully')
    } catch (error) {
        res.status(400).send(error.message)
    }
};




//Change password
export async function editPassword(req, res) {
    const{ currentPassword, newPassword } = req.body;
    try {
        const user = await UserModel.findById(req.userId)
        if (!user) {
            return res.status(404).json({message:"user not found"});  
        }
        bcrypt.compare(currentPassword, user.password, async (err, valid) => {
            if(!valid) {
                return res.status(401).json({message:"incorrect current password"});
            }
            user.password = newPassword;
            await user.save()
            return res.status(200).json({message: "Password updated successfully"});
        })
    
        
    } catch(err) {
        console.log(err)
        res.status(500).json({message: 'An error occurred'})
    }
    
}

function generateAccessToken(id, role) {
    return jwt.sign({uid:id, role:role}, process.env.TOKEN_SECRET, { expiresIn: '30d' })
  }

