import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
  worldId: { type: String, unique: true, required: true },
  walletAddress: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now },
  mainReward: { type: Number, default: 0 },
  stakingReward: { type: Number, default: 0 },
  stakeStart: { type: Date, default: Date.now },
  autoLogin: { type: Boolean, default: false },
  onChainBalance: { type: String, default: "0" }
});
export default mongoose.models.User || mongoose.model("User", UserSchema);