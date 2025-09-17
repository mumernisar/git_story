const axios = require("axios");
const axiosRetryMod = require("axios-retry");
// Support CommonJS and ESM default export shapes
const axiosRetry =
  axiosRetryMod && axiosRetryMod.default
    ? axiosRetryMod.default
    : axiosRetryMod;
const axiosRetryExponential =
  (axiosRetryMod && axiosRetryMod.exponentialDelay) ||
  (axiosRetry && axiosRetry.exponentialDelay);
const axiosRetryIsNetworkOrIdempotentRequestError =
  (axiosRetryMod && axiosRetryMod.isNetworkOrIdempotentRequestError) ||
  (axiosRetry && axiosRetry.isNetworkOrIdempotentRequestError);

const client = axios.create({
  timeout: 10000, // 10s default timeout for external requests
  headers: { "User-Agent": "github-love-compatibility/1.0" },
});

// Retry on network errors and 5xx responses, with exponential backoff
axiosRetry(client, {
  retries: 2,
  retryDelay: axiosRetryExponential,
  shouldResetTimeout: true,
  retryCondition: (error) => {
    // Retry on network errors or 5xx responses
    return (
      (typeof axiosRetryIsNetworkOrIdempotentRequestError === "function" &&
        axiosRetryIsNetworkOrIdempotentRequestError(error)) ||
      (error.response && error.response.status >= 500)
    );
  },
});

module.exports = client;
