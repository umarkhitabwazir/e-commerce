import { Address } from "../models/address.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

let addressController = asyncHandler(async (req, res) => {
    const { fullName, Province, City, phone, Building, HouseNo, Floor, Street } = req.body;
    let requiredFiels = [fullName, Province, City, phone,  HouseNo ]
    let user=req.user
    if (!user) {
       throw new ApiError(400,"user must be loged in!") 
    }
    if (requiredFiels.some(field => !field)) {
        throw new ApiError(400, "all field is required!")
    }
    let address = await Address.create(
      {  fullName,
        Province,
        City,
        user:user.id,
        phone,
        Building,
        HouseNo,
        Floor,
        Street}
    )
    if (!address) {
        throw new ApiError(400,"address not created please try again!")
    }
    res.status(201).json(new ApiResponse(201,address,"address created successfully!"))
})
let findAddress=asyncHandler(async(req,res)=>{
    let user=req.user

    if (!user) {
        throw new ApiError(400,"user must be loged in",false)
    }
    let address=await Address.findOne({user:user.id})
    if (!address) {
        throw new ApiError(404,null,"address not founded",false)
    }
    res.status(200).json(new ApiResponse(200,address,"address founded",true))
})
export{
    addressController,
    findAddress
}
