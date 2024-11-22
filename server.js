const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors package

const app = express();
app.use(cors()); // Enable CORS
app.use(bodyParser.json());

// const transporter = nodemailer.createTransport({
//   host: '',
//   port: 123,
//   auth: {
//     user: '',  // your username
//     pass: ''   // your password
//   }
// });

app.post('/send-email', (req, res) => {
  const { toEmail, subject, message } = req.body;

  const mailOptions = {
    from: 'testing@demo.com',
    to: toEmail,
    subject: subject,
    text: message
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send({ message: 'Failed to send email', error });
    }
    res.status(200).send({ message: 'Email sent successfully', info });
  });
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
