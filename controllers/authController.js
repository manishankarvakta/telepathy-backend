import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Register new user
export const registerUser = async (req, res) => {
  // console.log(req.body)

  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(req.body.password, salt);
  req.body.password = hashedPass
  // const newUser = new User(req.body);
  // const {phone} = req.body
  // try {
  //   // addition new
  //   const oldUser = await User.findOne({ phone });

  //   if (oldUser)
  //     return res.status(400).json({ status:false,  message: "User already exists with this phone no" });

  //   // changed
  //   const user = await newUser.save();
  //   // console.log(user)

  //   const token = jwt.sign(
  //     { phone: user.phone, name: user.name, id: user._id },
  //     process.env.JWTKEY,
  //     { expiresIn: "1h" }
  //   );
  //   res.status(200).json({status: true, token: token,
  //     data: {name: user.name, phone: user.phone,id: user._id, profilePicture: user.profilePicture} 
  //    });
  // } catch (error) {
  //   res.status(500).json({ status:false, message: error.message });
  // }
  try {
    const { name, phone, password, identityKey, preKeys, signedPreKeys } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ status:false,  message: "User already exists with this phone no" });
    }

    // Create new user
    const newUser = new User({
      name, 
      phone,
      password,
      identityKey,
      preKeys,
      signedPreKeys,
    });

    console.log(newUser)
    const user = await newUser.save();

      const token = jwt.sign(
      { phone: user.phone, name: user.name, id: user._id },
      process.env.JWTKEY,
      { expiresIn: "1h" }
    );
    res.status(200).json({status: true, token: token,
      data: {
        name: user.name, 
        phone: user.phone,
        id: user._id, 
        profilePicture: user.profilePicture,
        identityKey:user.identityKey,
        registrationId:user.registrationId,
        preKeys:user.preKeys,
        signedPreKeys:user.signedPreKeys,
      } 
     });
    // res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error', error });
  }
};

// Login User

// Changed
export const loginUser = async (req, res) => {
  const { phone, password } = req.body;

  try {
    const user = await User.findOne({ phone: phone });

    if (user) {
      // console.log(user)
      const validity = await bcrypt.compare(password, user.password);

      if (!validity) {
        res.status(400).json({status: false, message: "wrong password"});
      } else {
        const token = jwt.sign(
          { phone: user.phone,name: user.name, id: user._id },
          process.env.JWTKEY,
          { expiresIn: "1h" }
        );
        res.status(200).json({status: true, token: token, 
          data: {
            name: user.name, 
            phone: user.phone,
            id: user._id,  
            profilePicture: user.profilePicture,
            identityKey:user.identityKey,
            registrationId:user.registrationId,
            preKeys:user.preKeys,
            signedPreKeys:user.signedPreKeys,
          } 
        });
      }
    } else {
      res.status(404).json({status: false, message: "User not found"});
    }
  } catch (err) {
    res.status(500).json(err);
  }
};