import mongoose, { Schema} from "mongoose";



const FavoriteSchema= new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    item: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref:"Product",
      unique:true
    },

  },
  { timestamps: { createdAt: true, updatedAt: false } }
);


FavoriteSchema.index({ user: 1, item: 1, itemType: 1 }, { unique: true });

export default mongoose.models.Favorite ||
  mongoose.model("Favorite", FavoriteSchema);
