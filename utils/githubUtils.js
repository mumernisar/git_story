const axios = require("./httpClient");
const AppError = require("./appError");

/**
 * Fetches GitHub profile info (name, avatar, bio) and README in clean text.
 */
const fetchGitHubProfile = async (username) => {
  try {
    // 1. Get basic profile info
    const profileRes = await axios.get(
      `https://api.github.com/users/${username}`
    );
    const { name, avatar_url, bio } = profileRes.data;

    // 2. Try fetching README
    let readmeText = "";
    try {
      const readmeRes = await axios.get(
        `https://api.github.com/repos/${username}/${username}/readme`
      );
      const content = readmeRes.data.content;
      // decode base64 + remove HTML tags and links
      readmeText = Buffer.from(content, "base64").toString("utf8");
      readmeText = cleanMarkdown(readmeText);
    } catch (err) {
      // No README available or error fetching README: treat as missing README
      readmeText = "";
    }

    return { name, avatar_url, bio, readme: readmeText };
  } catch (err) {
    console.error(
      "Error fetching GitHub profile:",
      err && err.message ? err.message : err
    );
    // Convert to operational AppError so client receives useful status
    const status =
      err.response && err.response.status ? err.response.status : 502;
    throw new AppError("Failed to fetch GitHub profile", status);
  }
};

/**
 * Clean Markdown to plain-ish text for AI prompt
 * - removes HTML tags
 * - removes links
 * - removes excessive newlines
 */
const cleanMarkdown = (markdown) => {
  let text = markdown;

  // Remove HTML tags
  text = text.replace(/<\/?[^>]+(>|$)/g, "");

  // Remove Markdown links [text](url) => text
  text = text.replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1");

  // Remove bare URLs
  text = text.replace(/https?:\/\/\S+/g, "");

  // Remove excessive newlines
  text = text.replace(/\n\s*\n/g, "\n");

  // Trim spaces
  text = text.trim();

  return text;
};
module.exports = { fetchGitHubProfile };
