import ChatModel from "../models/chatModel.js";
import User from "../models/userModel.js";

export const createChat = async (req, res) => {
  // console.log(req.body)
  const newChat = new ChatModel({
    members: [{
      id: req.body.senderId,
      publicKey: req.body.sPublicKey,
    }, 
    {id: req.body.receiverId,
      publicKey: req.body.rPublicKey
    }],
    status: "active"
  });
  try {
    const result = await newChat.save();
    // console.log(result)
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const userChats = async (req, res) => {
  try {
    const chat = await ChatModel.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const userListChats = async (req, res) => {
  const userId = req.params.userId
  // console.log(userId)
  try {
    const chat = await ChatModel.aggregate([
      {
        $match: {
          members: {
            $elemMatch: { id: userId } // Match if the members array contains the userId in any of the map entries
          }
        }
      },
      {
        $unwind: "$members" // Unwind the members array to work with individual objects
      },
      {
        $match: {
          "members.id": { $ne: userId } // Exclude the current user from the members array
        }
      },
      {
        $unwind: "$members" // Unwind the members array to work with individual objects
      },
      {
        $match: {
          "members.id": { $ne: userId } // Exclude the current user from the members array
        }
      },
      {
        $addFields: {
          reciverId: "$members.id",
          publicKey: "$members.publicKey",
        },
      },
      {
        $project: {
          _id: 1,
          reciverId: { $toObjectId: '$reciverId' },
          rPublicKey: "$members.publicKey",
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'reciverId',
          foreignField: '_id',
          as: 'receiverDetails',
        },
      },
      {
        $unwind: '$receiverDetails',
      },
      {
        $project: {
          _id: 1,
          reciverId: 1,
          rPublicKey:1,
          name: '$receiverDetails.name',
          phone: '$receiverDetails.phone',
          profilePicture: {
            $ifNull: ['$receiverDetails.profilePicture', null],
          },

        },
      },
    ])
    // console.log('Chats:', chat);  

    // const list = [{
    //   id:"",
    //   name:"",
    //   profilePicture:"",
    //   message:"",
    //   time:"",
    // }]

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const findChat = async (req, res) => {
  try {
    const chat = await ChatModel.findOne({
      members: { $all: 
        [{ $elemMatch: { id: req.params.firstId } },
          { $elemMatch: { id: req.params.secondId } }]
         },
    });
    // console.log(chat)
    if(chat === null ){
      res.status(200).json({status:false, data:chat}) 
    }else{
      res.status(200).json({status:true, data:chat})

    }
  } catch (error) {
    res.status(500).json(error)
  }
};


export const findReceiver = async (req, res) =>{
  console.log(req.params)

}