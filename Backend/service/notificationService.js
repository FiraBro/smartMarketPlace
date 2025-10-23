// services/notificationService.js
import nodemailer from "nodemailer";
import { Notification } from "../models/Notification.js";
import { User } from "../models/User.js";

class NotificationService {
  // 📨 Send immediate notification
  async sendNotification(notificationData) {
    try {
      const {
        recipientType,
        channel,
        subject,
        message,
        type,
        specificUsers,
        specificSellers,
        sentBy,
      } = notificationData;

      console.log("Sending notification:", { recipientType, channel, subject });

      // 1️⃣ Get recipients
      const recipients = await this.getRecipients(
        recipientType,
        specificUsers,
        specificSellers
      );

      if (recipients.length === 0) {
        return {
          success: false,
          error: "No recipients found for the selected criteria",
        };
      }

      let emailResults = [];
      let userNotifications = [];

      // 2️⃣ Send notifications by channel
      if (channel === "email" || channel === "both") {
        console.log(`Sending emails to ${recipients.length} recipients`);
        emailResults = await this.sendEmailNotifications(
          recipients,
          subject,
          message
        );
      }

      if (channel === "in_app" || channel === "both") {
        console.log(
          `Creating in-app notifications for ${recipients.length} users`
        );
        userNotifications = await this.createUserNotifications(
          recipients,
          subject,
          message,
          type,
          sentBy
        );
      }

      // 3️⃣ Save admin master notification record
      const notification = new Notification({
        subject,
        message,
        channel,
        type,
        recipientType,
        specificUsers,
        specificSellers,
        sentBy,
        status: "sent",
        sentAt: new Date(),
        stats: this.calculateStats(
          recipients.length,
          emailResults,
          userNotifications
        ),
      });

      await notification.save();

      // 4️⃣ Save user notifications (for in-app)
      let createdNotifications = [];
      if (userNotifications.length > 0) {
        createdNotifications = await Notification.insertMany(userNotifications);
        console.log(
          `✅ Created ${createdNotifications.length} in-app notifications`
        );
      }

      return {
        success: true,
        notificationId: notification._id,
        emailResults,
        userNotifications: createdNotifications,
        stats: notification.stats,
      };
    } catch (error) {
      console.error("Notification service error:", error);
      return { success: false, error: error.message };
    }
  }

  // 👥 Get recipients based on type
  async getRecipients(recipientType, specificUsers = [], specificSellers = []) {
    try {
      let query = { status: "active" };

      switch (recipientType) {
        case "all":
          break;
        case "users":
          query.userType = "buyer";
          break;
        case "sellers":
          query.userType = "seller";
          break;
        case "specific":
          if (specificUsers.length === 0 && specificSellers.length === 0)
            return [];
          return await User.find({
            _id: { $in: [...specificUsers, ...specificSellers] },
            status: "active",
          });
        default:
          throw new Error(`Invalid recipient type: ${recipientType}`);
      }

      const recipients = await User.find(query);
      console.log(
        `Found ${recipients.length} recipients for type: ${recipientType}`
      );
      return recipients;
    } catch (error) {
      console.error("Error getting recipients:", error);
      return [];
    }
  }

  // ✉️ Send email notifications
  async sendEmailNotifications(recipients, subject, message) {
    try {
      const emailRecipients = recipients
        .filter((u) => u.email)
        .map((u) => u.email);

      if (emailRecipients.length === 0) {
        console.log("No valid email recipients found");
        return [];
      }

      const results = [];
      for (const email of emailRecipients) {
        try {
          await this.sendNotificationEmail(email, subject, message);
          results.push({ recipient: email, success: true });
          console.log(`📧 Sent email to ${email}`);
        } catch (err) {
          console.error(`❌ Failed to send to ${email}:`, err.message);
          results.push({
            recipient: email,
            success: false,
            error: err.message,
          });
        }
      }

      return results;
    } catch (error) {
      console.error("Error sending email notifications:", error);
      return [];
    }
  }

  // 📩 Single email sender
  async sendNotificationEmail(email, subject, message) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"Marketplace Admin" <${process.env.SMTP_USER}>`,
      to: email,
      subject,
      html: this.formatEmailHTML(subject, message),
    };

    await transporter.sendMail(mailOptions);
  }

  formatEmailHTML(subject, message) {
    return `
      <html>
        <head>
          <style>
            body { font-family: Arial; background: #f9fafb; color: #333; }
            .card { max-width:600px; margin:20px auto; background:#fff; padding:20px; border-radius:10px; box-shadow:0 2px 5px rgba(0,0,0,0.1); }
            .header { background:#3b82f6; color:white; padding:10px 20px; border-radius:10px 10px 0 0; }
            .content { padding:20px; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header"><h2>${subject}</h2></div>
            <div class="content">${message}</div>
          </div>
        </body>
      </html>
    `;
  }

  // 🧠 Create user in-app notifications
  async createUserNotifications(recipients, subject, message, type, sentBy) {
    return recipients.map((user) => ({
      user: user._id,
      title: subject,
      message,
      type,
      channel: "in_app",
      read: false,
      sentBy,
    }));
  }

  // 📊 Calculate stats
  calculateStats(totalRecipients, emailResults, userNotifications) {
    const emailSent = emailResults.filter((r) => r.success).length;
    const emailFailed = emailResults.filter((r) => !r.success).length;
    const inAppSent = userNotifications.length;

    return {
      totalRecipients,
      emailSent,
      emailFailed,
      inAppSent,
      emailOpened: 0,
      inAppRead: 0,
    };
  }

  // 🕐 Schedule notification (for later)
  async scheduleNotification(notificationData) {
    try {
      const notification = new Notification({
        ...notificationData,
        status: "scheduled",
      });
      await notification.save();
      console.log(`📅 Scheduled notification ${notification._id}`);
      return { success: true, notificationId: notification._id };
    } catch (err) {
      console.error("Error scheduling notification:", err);
      return { success: false, error: err.message };
    }
  }
}

export default new NotificationService();
