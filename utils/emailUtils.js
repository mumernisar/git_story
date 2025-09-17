const sgMail = require("@sendgrid/mail");
require("dotenv").config(); // make sure your .env is loaded

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendCompatibilityEmail = async (
  to,
  user1Avatar,
  user2Avatar,
  user1Name,
  user2Name,
  funnyMessage,
  compatibilityPercent
) => {
  const htmlTemplate = `
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, Helvetica, sans-serif; background-color: #f9f9f9; padding: 30px;">
  <tr>
    <td align="center">
      <!-- Avatar + Heart -->
      <table cellpadding="0" cellspacing="0" border="0" style="display: inline-block;">
        <tr>
          <!-- User 1 -->
          <td align="center" style="padding: 0 10px;">
            <img src="${user1Avatar}" width="100" height="100" alt="User 1" style="border-radius:50%; display:block;">
            <p style="margin: 5px 0 0 0; font-size: 14px; color: #333; font-weight: bold;">${user1Name}</p>
          </td>

          <!-- Heart with percent -->
          <td align="center" style="margin-left: -40px; position: relative;">
            <img src="https://cdn-icons-png.flaticon.com/512/833/833472.png" width="80" height="80" alt="Heart" style="display:block;">
            <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                         font-size: 16px; font-weight: bold; color: #fff;">${compatibilityPercent}%</span>
          </td>

          <!-- User 2 -->
          <td align="center" style="padding: 0 10px; margin-left: -40px;">
            <img src="${user2Avatar}" width="100" height="100" alt="User 2" style="border-radius:50%; display:block;">
            <p style="margin: 5px 0 0 0; font-size: 14px; color: #333; font-weight: bold;">${user2Name}</p>
          </td>
        </tr>
      </table>

      <!-- Spacer -->
      <div style="height: 25px;"></div>

      <!-- HONESTLY heading -->
      <h2 style="margin:0; font-size:24px; color:#e63946; font-family: 'Arial Black', Arial, sans-serif;">
        HONESTLY...
      </h2>

      <!-- Funny message -->
      <p style="margin:10px 0 0 0; font-size:16px; color:#555; line-height:1.4;">
        ${funnyMessage}
      </p>
    </td>
  </tr>
</table>

`;

  // Mail options
  const mailOptions = {
    to,
    from: process.env.FROM_EMAIL,
    subject: "Your Git Story 💘",
    text: funnyMessage,
    html: htmlTemplate,
  };

  try {
    const response = await sgMail.send(mailOptions);
    console.log("Email sent successfully to:", to);
    return response;
  } catch (error) {
    console.error("Error sending email:");
    if (error.response && error.response.body) {
      console.error(error.response.body); // SendGrid detailed error
    } else {
      console.error(error);
    }
    throw error;
  }
};

module.exports = { sendCompatibilityEmail };
