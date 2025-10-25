import mongoose, { Schema } from "mongoose";

const addressSchema = new Schema({

  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "user is required"],
  },

  Province: {
    type: String,
    required: [true, "Province is required"],
  enum: [
  "Lahore",
  "Faisalabad",
  "Multan",
  "Rawalpindi",
  "Gujranwala",
  "Sialkot",
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
    "Faisalabad",
    "Rawalpindi",
    "Multan",
    "Gujranwala",
    "Sialkot",
    "Bahawalpur",
    "Sargodha",
    "Sheikhupura",
    "Rahim Yar Khan",
    "Jhang",
    "Gujrat",
    "Kasur",
    "Okara",
    "Vehari",
    "Mianwali",
    "Chiniot",
      // Sindh Cities
          "Karachi",
    "Hyderabad",
    "Sukkur",
    "Larkana",
    "Nawabshah",
    "Mirpur Khas",
    "Jacobabad",
    "Kashmore",
    "Badin",
    "Thatta",
    "Khairpur",
      // Khyber Pakhtunkhwa Cities
       "Peshawar",
    "Mardan",
    "Abbottabad",
    "Swat",
    "Kohat",
    "Charsadda",
    "Dera Ismail Khan",
    "Mansehra",
    "Bannu",
    "Nowshera",
      // Balochistan Cities
          "Quetta",
    "Gwadar",
    "Turbat",
    "Khuzdar",
    "Sibi",
    "Zhob",
    "Chaman",
    "Hub",
      // Islamabad Capital Territory
      "Islamabad",
      // Gilgit-Baltistan Cities
      "Gilgit",
    "Skardu",
    "Hunza",
    "Ghizer",
      // Azad Jammu and Kashmir Cities
       "Muzaffarabad",
    "Mirpur",
    "Kotli",
    "Bagh",
    "Rawalakot"
    ],
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

export const Address = mongoose.model("Address", addressSchema);