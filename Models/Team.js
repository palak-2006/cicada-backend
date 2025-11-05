import mongoose from "mongoose";

const teamSchema = mongoose.Schema({
  team_name: {
    type: String,
    required: true,
    unique: true,
  },
  leader_email: {
    type: String,
    required: true,
    unique: true,
    match: /.+\@.+\..+/,
  },
  leader_name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  member1_name: {
    type: String,
  },
  member1_email: {
    type: String,
    match: /.+\@.+\..+/,
  },
  member2_name: {
    type: String,
  },
  member2_email: {
    type: String,
    match: /.+\@.+\..+/,
  },
  current_level: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model("Team", teamSchema);
