# GitHub Compatibility Generator

A web app that calculates compatibility between two GitHub users by analyzing their profiles and README content, generating a percentage score and a humorous message, then sending a styled email with avatars, names, and results.

**Deployed Version:** [https://git-story.onrender.com/](https://git-story.onrender.com/)

---

**Try it out here:** [https://reqbin.com/s4rauusa](https://reqbin.com/s4rauusa)

**Note**: Server spins down after inactivity. So, maybe first visit the deployed version to wake it then use the API through reqbin above.

## API

### POST `/api/calculate`

**Body (JSON):**

```json
{
  "userOne": "username",
  "userTwo": "username",
  "email": "email"
}
```

## Description

A web app that calculates compatibility between two GitHub users by analyzing their profiles and README content. It generates a percentage score and a message, then sends a styled email with avatars, names, and results.

**Deployed Version:** [https://git-story.onrender.com/](https://git-story.onrender.com/)

## API

### POST `/api/calculate`

**Request Body:**

```json
{
  "userOne": "username",
  "userTwo": "username",
  "email": "email"
}
```

- `userOne` – GitHub username of the first user
- `userTwo` – GitHub username of the second user
- `email` – Email address to receive the compatibility result

Returns a JSON response with the compatibility score and message, and sends a styled email to the provided address.

## Tech Stack

- **Backend:** Node.js, Express
- **Email Service:** SendGrid
- **AI Engine:** OpenAI GPT via Groq client
- **Email Templates:** HTML/CSS
- **Deployment:** Render

## Local Setup

1. **Clone the repository**

```bash
git clone <repo-url>
cd <repo-folder>
```

2. **Install dependencies**

```bash
npm install
```

3. **Create a .env file in the root directory with the following variables:**

```
SENDGRID_API_KEY=your_sendgrid_api_key
FROM_EMAIL=your_verified_sendgrid_email
OPENAI_API_KEY=your_openai_api_key
```

4. **Run the server**

```bash
Copy code
npm start
```

Server will run on http://localhost:8000

Test the API by sending a POST request to /api/calculate with body:

```json
{
  "userOne": "username1",
  "userTwo": "username2",
  "email": "example@example.com"
}
```
