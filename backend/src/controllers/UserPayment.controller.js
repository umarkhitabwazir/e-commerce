import{ UserPayment} from '../models/UserPayment.model.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Save or update user payment data
export const saveUserPayment =asyncHandler( async (req, res) => {
  try {
    const { paymentPlatform, accountUsername, accountNumber } = req.body;
const user=req.user
    if (!paymentPlatform || !accountUsername || !accountNumber) {
      throw new ApiError ('All fields are required' );
    }

     await UserPayment.findOneAndUpdate(
      { userId: user._id },
      {
        paymentPlatform,
        accountUsername,
        accountNumber,
      },
      { upsert: true, new: true }
    );

    res.status(200).json(new ApiResponse(200,null,"Payment data saved successfully"));
  } catch (error) {
    throw new ApiError(500,'Server Error')
  }
}
)
// Get user payment data
export const getUserPayment =asyncHandler( async (req, res) => {
 
    const paymentData = await UserPayment.findOne({ userId: req.user._id });

    if (!paymentData) {
      return res.status(404).json(new ApiError(404, 'No payment data found') );
    }

    res.status(200).json(new ApiResponse(200,paymentData));
 
})

// Delete user payment data
export const deleteUserPayment =asyncHandler( async (req, res) => {
  try {
    const deleted = await UserPayment.findOneAndDelete({ userId: req.user._id });

    if (!deleted) {
      return res.status(404).json({ message: 'No payment data found' });
    }

    res.status(200).json({ message: 'Payment data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
})
