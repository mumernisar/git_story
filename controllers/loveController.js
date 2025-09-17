const { fetchGitHubProfile } = require("../utils/githubUtils");
const { generateCompatibility } = require("../utils/groqClient");
const { sendCompatibilityEmail } = require("../utils/emailUtils.js");

const catchAsync = require("../utils/catchAsync");

const calculateCompatibility = catchAsync(async (req, res, next) => {
  const { userOne, userTwo, email } = req.body;
  if (!userOne || !userTwo || !email) {
    return next(new AppError("userOne, userTwo, and email are required", 400));
  }

  const user1Profile = await fetchGitHubProfile(userOne);
  const user2Profile = await fetchGitHubProfile(userTwo);
  if (!user1Profile || !user2Profile) {
    return next(new AppError("Failed to fetch user profiles", 404));
  }

  const user1Text = `${user1Profile.name}\n${user1Profile.bio || ""}\n${
    user1Profile.readme || ""
  }`;
  const user2Text = `${user2Profile.name}\n${user2Profile.bio || ""}\n${
    user2Profile.readme || ""
  }`;

  const compatibility = await generateCompatibility(user1Text, user2Text);
  if (!compatibility) {
    return next(new AppError("Something went wrong", 502));
  }
  console.log("Compatibility Result:", compatibility.funny_message);
  await sendCompatibilityEmail(
    email,
    user1Profile.avatar_url,
    user2Profile.avatar_url,
    user1Profile.name,
    user2Profile.name,
    compatibility.funny_message,
    compatibility.compatibility_percent
  );
  
  res.json({ success: true, data: compatibility });
});

module.exports = { calculateCompatibility };
