import ChatModel from "../models/chatModel.js";

export const createChat = async (req, res) => {
  // console.log(req.body)
  const newChat = new ChatModel({
    members: [req.body.senderId, req.body.receiverId],
    status: "active"
  });
  try {
    const result = await newChat.save();
    console.log(result)
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
  console.log(userId)
  try {
    const chat = await ChatModel.aggregate([
      {
        $match: {
          members: userId,
        },
      },
      {
        $addFields: {
          reciverId: {
            $arrayElemAt: [
              {
                $filter: {
                  input: '$members',
                  cond: { $ne: ['$$this', userId] },
                },
              },
              0,
            ],
          },
        },
      },
      {
        $project: {
          _id: 1,
          reciverId: { $toObjectId: '$reciverId' },
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
          name: '$receiverDetails.name',
          phone: '$receiverDetails.phone',
          profilePicture: {
            $ifNull: ['$receiverDetails.profilePicture', null],
          },
        },
      },
      {
            $lookup: {
              from: 'messages',
              let: { chatId: '$_id', reciverId: '$reciverId' },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ['$chatId', '$$chatId'] },
                        { $eq: ['$senderId', '$$reciverId'] },
                      ],
                    },
                  },
                },
                {
                  $sort: { createdAt: -1 },
                },
                {
                  $limit: 1,
                },
              ],
              as: 'lastMessage',
            },
          },
    ])
    console.log('Chats:', chat);  

    const list = [{
      id:"",
      name:"",
      profilePicture:"",
      message:"",
      time:"",
    }]
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const findChat = async (req, res) => {
  try {
    const chat = await ChatModel.findOne({
      members: { $all: [req.params.firstId, req.params.secondId] },
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