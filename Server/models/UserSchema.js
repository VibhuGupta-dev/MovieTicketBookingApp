import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    role: {
      type: String,
      enum: ["user", "owner"],
      default: "user"
    },

    phoneNumber: {
      type: String,
      required: true
    },

    password: {
      type: String,
      required: true,
      select: false
    },
    orderHistory: [
   {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order"
    },
    totalAmount: Number,
    status: String,
     orderedAt: {
      type: Date,
      default: Date.now
    }
  }
]

  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
