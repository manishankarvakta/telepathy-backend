/**
 * Rooms API
 * 1. get all Rooms
 * 2. get Rooms by group
 * 3. get Rooms by id
 * 3.1 get Rooms by parent
 * 3.2 get master Rooms
 * 4. create one
 * 5. create many
 * 6. updateOne
 * 7. delete one
 */

import express from "express"
import expressAsyncHandler from "express-async-handler"

const roomsRouter = express.Router()


// COUNT Rooms
roomsRouter.get(
  "/count",
  expressAsyncHandler(async (req, res) => {
    const total = await Rooms.countDocuments({});
    res.status(200).json(total);
  })
);


export default roomsRouter