import nodemailer from "nodemailer";

export async function POST(request) {
  const body = await request.json(); // Get request body containing email data

  //   const { to, subject, message } = body;

  //   if (!to || !subject || !message) {
  //     return new Response(JSON.stringify({ error: 'Missing fields' }), {
  //       status: 400,
  //     });
  //   }

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: "587",
      secure: false, // true for 465, false for other ports
      auth: {
        user: "", // Your email
        pass: "", // Your email password or app-specific password
      },
    });

    // Send email
    const mailOptions = {
      from: `"Your Name" <${process.env.EMAIL_USER}>`, // Sender address
      to: "", // List of receivers
      subject: "subject", // Subject line
      text: "hi hi", // Plain text body
    };

    await transporter.sendMail(mailOptions);

    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully!" }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
      }
    );
  }
}
