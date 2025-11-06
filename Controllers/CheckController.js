import { Ans } from "../ans/ans.js";

export const handleAnsController = async (req, res) => {
  try {
    const { ans, level, subpart } = req.body;
    console.log("📩 Received answer submission:", { ans, level, subpart });

    if (!ans || !level) {
      return res.status(400).json({ err: "Missing answer or level." });
    }

    const levelData = Ans[level];
    if (!levelData) {
      return res.status(404).json({ err: "Invalid level." });
    }

    let correctAnswer = null;
    let isMultiPart = false;

    // ✅ Determine if it's a multi-part level
    if (typeof levelData === "object" && !levelData.answer) {
      isMultiPart = true;

      // Check subpart validity
      if (!subpart || !levelData[subpart]) {
        return res.status(400).json({ err: "Missing or invalid subpart." });
      }

      correctAnswer = levelData[subpart].answer;
    } else {
      correctAnswer = levelData.answer;
    }

    const userAns = ans.trim().toLowerCase();
    const validAns = correctAnswer.trim().toLowerCase();
    console.log(`🔍 Validating answer. User: "${userAns}", Correct: "${validAns}"`);
    // ✅ If the answer is correct
    if (userAns === validAns) {
      const team = req.team;
      const currentLevel = parseInt(team.current_level, 10);
      const newLevel = parseInt(level, 10) + 1;

      if (isMultiPart) {
        // --- Multi-part Level Logic ---
        // 1️⃣ If part A is correct → don't advance yet
        // 2️⃣ If part B is correct → advance to next level
        
        if (subpart === "a") {
          console.log(`✅ Correct answer for Level ${level} Part A`);
          return res.status(200).json({
            success: true,
            correct: true,
            msg: `Part A of Level ${level} solved! Now proceed to Part B.`,
            part: "a",
            stayAtLevel: level,
          });
        }

        if (subpart === "b") {
          console.log(`✅ Correct answer for Level ${level} Part B`);
          team.current_level = currentLevel < newLevel ? newLevel : currentLevel;
          await team.save();

          return res.status(200).json({
            success: true,
            correct: true,
            msg: `Level ${level} completed! Proceed to Level ${newLevel}.`,
            newLevel,
          });
        }
      } else {
        // --- Single-part Level ---
        team.current_level = currentLevel < newLevel ? newLevel : currentLevel;
        await team.save();

        console.log(`✅ Correct single-part level ${level}`);
        return res.status(200).json({
          success: true,
          correct: true,
          msg: `Correct! Level ${level} cleared.`,
          newLevel,
        });
      }
    }

    // ❌ Incorrect Answer
    return res.status(200).json({
      success: true,
      correct: false,
      msg: "Incorrect answer. Try again.",
    });
  } catch (err) {
    console.error("❌ Error in handleAnsController:", err);
    return res.status(500).json({
      err: "Server error while verifying answer.",
    });
  }
};

