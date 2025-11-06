import Team from "../Models/Team.js";
import jwt from "jsonwebtoken";

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            console.log('No token provided');
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }
        const decoded = jwt.verify(token, "thisismysecrect");
        const team = await Team.findById(decoded.userId).select("-password");
        if (!team) {
            return res.status(404).json({ error: "Unauthorized: Team not found" });
        }
        req.team = team;
        next();
    } catch (error) {
        console.error("Error in protectRoute:", error);
        res.status(401).json({ error: "Unauthorized: Token is invalid or expired" });
    }
};

export { protectRoute };
