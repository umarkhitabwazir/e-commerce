import mongoose, { Schema } from "mongoose";

let addressSchema = new Schema({
    fullName: {
        type: String,
        required: [true, "fullname is required"],
        trim: true
    },
    user:{
      type:Schema.Types.ObjectId,
      ref:"User",
      required:[true,"user is required"],
  },

    Province: {
        type: String,
        required: [true, "Province is required"],
        enum: [
            "Punjab",
            "Sindh",
            "Khyber Pakhtunkhwa",
            "Balochistan",
            "Islamabad Capital Territory",
            "Gilgit-Baltistan",
            "Azad Jammu and Kashmir"
        ],
        trim: true
    },
    City: {
        type: String,
        enum: [
            // Punjab Cities
            "Lahore",
            "Rawalpindi",
            "Faisalabad",
            "Gujranwala",
            "Multan",
            "Sialkot",
            // Sindh Cities
            "Karachi",
            "Hyderabad",
            "Sukkur",
            "Larkana",
            "Nawabshah",
            // Khyber Pakhtunkhwa Cities
            "Peshawar",
            "Abbottabad",
            "Mardan",
            "Swat",
            // Balochistan Cities
            "Quetta",
            "Gwadar",
            "Turbat",
            // Islamabad Capital Territory
            "Islamabad",
            // Gilgit-Baltistan Cities
            "Gilgit",
            "Skardu",
            // Azad Jammu and Kashmir Cities
            "Muzaffarabad",
            "Mirpur",
            "Kotli"
        ],
        trim: true
    },
    phone: {
        type: Number,
        required: [true, "number is required"],
        trim: true
    },
    Building: {
        type: String,
        required: false,
        trim: true,
      },
      HouseNo: {
        type: String,
        required: [true, "House No is required"],
        trim: true,
      },
      Floor: {
        type: String,
        required: false,
        trim: true,
      },
      Street: {
        type: String,
        required: false,
        trim: true,
      },
})

export let Address=mongoose.model("Address", addressSchema);