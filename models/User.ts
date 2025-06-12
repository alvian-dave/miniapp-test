import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  worldId: string;
  // walletAddress dihapus/opsional
  mainReward: number;
  lastClaimUpdate: Date;
  stakeAmount: number;
  stakingReward: number;
  stakeStart: Date;
}

const UserSchema = new Schema<IUser>({
  worldId: { type: String, required: true, unique: true },
  // walletAddress dihapus
  mainReward: { type: Number, default: 0 },
  lastClaimUpdate: { type: Date, default: Date.now },
  stakeAmount: { type: Number, default: 0 },
  stakingReward: { type: Number, default: 0 },
  stakeStart: { type: Date, default: Date.now },
});

export default (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>("User", UserSchema);