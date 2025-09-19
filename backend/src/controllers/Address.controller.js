import { Address } from "../models/address.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addressController = asyncHandler(async (req, res) => {
    const  { fullName, Province, City, phone, Building, HouseNo, Floor, Street } = req.body;
    const requiredFiels = [fullName, Province, City, phone,  HouseNo ]
    const user=req.user
    if (!user) {
       throw new ApiError(400,"user must be loged in!") 
    }
    if (requiredFiels.some(field => !field)) {
        throw new ApiError(400, "all field is required!")
    }
    const address = await Address.create(
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
const editAddress=asyncHandler(async(req,res)=>{
    const  { fullName, Province, City, phone, Building, HouseNo, Floor, Street } = req.body;
    console.log('edit address body',req.body);
    const user=req.user
    if (!user) {
         throw new ApiError(400,"user must be loged in!")
    }
    try {
        
        const address=await Address.findOne({user:user.id})
        if (!address) {
            throw new ApiError(404,null,"address not founded",false)
        }
        address.fullName=fullName || address.fullName
        address.Province=Province || address.Province
        address.City=City || address.City
        address.phone=phone || address.phone
        address.Building=Building || address.Building
        address.HouseNo=HouseNo || address.HouseNo
        address.Floor=Floor || address.Floor
        address.Street=Street || address.Street
        await address.save()
        res.status(200).json(new ApiResponse(200,address,"address updated successfully",true))
    } catch (error) {
        console.log('edit address error',error);
        throw new ApiError(500,"internal server error") 
    }
})
const findAddress=asyncHandler(async(req,res)=>{
    const user=req.user

    if (!user) {
        throw new ApiError(400,"user must be loged in",false)
    }
    const address=await Address.findOne({user:user.id})
    if (!address) {
        throw new ApiError(404,null,"address not founded",false)
    }
    res.status(200).json(new ApiResponse(200,address,"address founded",true))
})
export{
    addressController,
    editAddress,
    findAddress
}
