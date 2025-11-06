import Team from "../Models/Team.js";
import generateCookie from "../util/helper/generateCookie.js";
import bcrypt from "bcrypt";

const signupController = async (req, res) => {
  try {
    const {
      team_name,
      leader_email,
      leader_name,
      member1_name,
      member1_email,
      member2_name,
      member2_email,
    } = req.body;
    let { password } = req.body;

    if (!team_name || !leader_email || !leader_name || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const team = await Team.findOne({
      $or: [
        { team_name },
        {
          leader_email: leader_email,
        },
        {
          member1_email: member1_email,
        },
        {
          member2_email: member2_email,
        },
      ],
    });

    if (team) {
      res
        .status(404)
        .json({
          err: "team already exists or maybe team members are already registered",
        });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const newTeam = new Team({
      team_name,
      leader_email,
      leader_name,
      password: hashedPass,
      member1_name,
      member1_email,
      member2_name,
      member2_email,
    });

    await newTeam.save();

    if (newTeam) {
      generateCookie(newTeam._id, res);
      // return everything except password
      const { password, ...rest } = newTeam._doc;
      console.log(rest, " registered team details");
      res.status(201).json({team: rest});
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `server error ${error}` });
  }
};

const loginController = async (req, res) => {
  try {
    const { leader_email, password } = req.body;
    if (!leader_email || !password) {
      return res.status(400).json({ err: "All fields are required" });
    }

    const team = await Team.findOne({ leader_email });
    if (!team) {
      return res.status(401).json({ err: "Invalid credentials" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, team.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ err: "Invalid credentials" });
    }
    const { password: excluded, ...teamWithoutPassword } = team.toObject();
    generateCookie(team._id, res);

    console.log(teamWithoutPassword, "login team details");
    return res.status(200).json({ team: teamWithoutPassword });
  } catch (err) {
    console.error(err);
    if (!res.headersSent) {
      return res.status(500).json({ err: "Internal server error" });
    }
  }
};

const logoutController = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.log("Error in signupUser: ", error);
    res.status(500).json({ error });
  }
};

export {
  signupController,
  loginController,
  logoutController,
};
