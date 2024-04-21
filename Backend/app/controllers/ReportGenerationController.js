import { User } from "../models/UserModel.js";
import { Report } from "../models/ReportModel.js";
import puppeteer from "puppeteer";
import admin from "firebase-admin";

function isWithinRange(date, startDate, endDate) {
  const d = new Date(date);
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Check if the date is invalid
  if (isNaN(d)) {
    console.log("Invalid date:", date);
    return false;
  }

  // Set hours to 0 to compare only the date part
  d.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  return d >= start && d <= end;
}

async function deleteReport(reportId) {
  try {
    await Report.findByIdAndDelete(reportId);
    console.log("Report deleted");
  } catch (error) {
    console.error(`Error deleting report: ${error}`);
  }
}

export async function generateReport(req, res) {
  try {
    console.log("req.body: ", req.body);
    const { reportType, startDate: userStartDate } = req.body;

    // Check if the authenticated user is the same as the user to be updated
    if (req.user.userId !== req.params.id) {
      return res.status(403).send({ error: "Authorization failed." });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    if (!reportType || !userStartDate) {
      return res
        .status(400)
        .json({ message: "Report type and start date are required" });
    }

    let reportData = {};

    // Calculate the end date based on the reportType
    const startDate = new Date(userStartDate);
    const endDate =
      reportType === "weekly"
        ? new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000)
        : new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);

    // Set the time to the start and end of the day for the existing report check
    const startOfDay = new Date(
      Date.UTC(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate(),
        0,
        0,
        0
      )
    );
    const endOfDay = new Date(
      Date.UTC(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate(),
        23,
        59,
        59
      )
    );

    // Check if a report with the same user, reportType, and startDate already exists
    const existingReport = await Report.findOne({
      userId: req.params.id,
      reportType,
      startDate: { $gte: startOfDay, $lte: endOfDay },
    });

    if (existingReport) {
      if (existingReport.reportURL) {
        console.log("Report already exists");
        return res.status(200).json({ url: existingReport.reportURL });
      } else {
        // If the reportURL is empty, delete the report
        await deleteReport(existingReport._id);
      }
    }

    // Filter the user's data based on the startDate and endDate
    reportData = {
      glucoseData: user.healthProfile.glucoseReadings.filter((data) =>
        isWithinRange(data.timestamp, startDate, endDate)
      ),
      a1cData: user.healthProfile.A1cReadings.filter((data) =>
        isWithinRange(data.timestamp, startDate, endDate)
      ),
      riskFactors: user.healthProfile.riskFactors,
      riskAssessment:
        user.healthProfile.riskAssessment[
          user.healthProfile.riskAssessment.length - 1
        ],
    };

    let lastRiskAssessment =
      user.healthProfile.riskAssessment[
        user.healthProfile.riskAssessment.length - 1
      ].toObject();
    reportData.riskAssessment = {
      riskScore: lastRiskAssessment.riskScore,
      predictionResult: lastRiskAssessment.predictionResult,
      date: lastRiskAssessment.date,
    };

    // Create a new report
    const report = new Report({
      userId: req.params.id,
      reportType,
      reportData,
      startDate,
    });

    await report.save();

    console.log("Report created");

    // Generate PDF
    const browser = await puppeteer.launch({
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--headless",
        "--disable-gpu",
      ],
      headless: true,
      executablePath:
        process.env.NODE_ENV === "production"
          ? process.env.PUPPETEER_EXECUTABLE_PATH ||
            "/app/.apt/usr/bin/google-chrome"
          : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    });

    const page = await browser.newPage();

    // Define HTML template
    const html = `
    <html>
        <head>
            <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
        </head>

        <style>
            body { 
                font-family: "Montserrat", sans-serif; 
                padding: 20px;
            }
            .header { 
                text-align: center; 
                margin-bottom: 40px; 
            }
            h1 { 
                text-align: center; 
                color: #0a2227 
            }
            .section { 
                margin-bottom: 20px; 
                padding-top: 30px;
                break-inside: avoid;
                page-break-inside: avoid;
            }
            .section h2 { 
                color: #0a2227; 
            }
            .logo { 
                display: block; 
                margin: 0 auto; 
                width: 100px; 
            }
            .section p span {
                margin-right: 10px;
            }
            p {
                font-size: 16px;
                line-height: 1.5;
                font-family: "Montserrat", sans-serif;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
            }
            th, td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
            }
            th {
                background-color: #0a2227;
                color: white;
            }
        </style>

        <body>
            <div class="header">
                <img src="https://i.imgur.com/IchGIAe.png" alt="Logo" class="logo">
                <h1>SugarCheck Report</h1>
            </div>

            <div class="section">
                <h2>Personal Information</h2>
                <p>Name: ${user.firstName} ${user.lastName}</p>
                <p>Date of Birth: ${new Date(user.dob).toLocaleDateString(
                  "en-GB"
                )}</p>
                <p>Gender: ${
                  user.gender.charAt(0).toUpperCase() + user.gender.slice(1)
                }</p>
                <p>Email: ${user.email}</p>
            </div>

            <div class="section">
                <h2>Report Type:</h2>
                <p>${
                  reportType.charAt(0).toUpperCase() + reportType.slice(1)
                }</p>
                <p>
                    <span>From: ${new Date(startDate).toLocaleDateString(
                      "en-GB"
                    )}</span>
                    <span>To: ${new Date(endDate).toLocaleDateString(
                      "en-GB"
                    )}</span>
                </p>
            </div>

            <div class="section">
                <h2>Glucose Data:</h2>
                <table>
                    <tr>
                        <th>Time Recorded</th>
                        <th>Value (mg/dL)</th>
                    </tr>
                    ${reportData.glucoseData
                      .map(
                        (data) =>
                          `<tr><td>${new Date(data.timestamp).toLocaleString(
                            "en-GB"
                          )}</td><td>${data.glucoseValue}</td></tr>`
                      )
                      .join("")}    
                </table>
            </div>

            <div class="section">
                <h2>HbA1c Data:</h2>
                <table>
                    <tr>
                        <th>Time Estimated</th>
                        <th>Estimated Value</th>
                    </tr>
                    ${reportData.a1cData
                      .map(
                        (data) =>
                          `<tr><td>${new Date(data.timestamp).toLocaleString(
                            "en-GB"
                          )}</td><td>${data.estimatedA1c}</td></tr>`
                      )
                      .join("")}
                </table>
            </div>

            <div class="section">
                <h2>Risk Factors:</h2>
                <ul>
                    ${Object.entries(reportData.riskFactors)
                      .filter(([key]) => key !== "age" && key !== "gender")
                      .map(([key, value]) => {
                        // Split the key into words, capitalize the first letter of each word, then join them with spaces
                        let formattedKey = key
                          .split(/(?=[A-Z])/)
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ");

                        // Capitalize the first letter of the value
                        let formattedValue =
                          value.charAt(0).toUpperCase() + value.slice(1);

                        return `<li>${formattedKey}: ${formattedValue}</li>`;
                      })
                      .join("")}
                </ul>
            </div>

            <div class="section">
                <h2>Latest Risk Assessment:</h2>
                <ul>
                    ${Object.entries(reportData.riskAssessment)
                      .filter(([key]) => key !== "_id")
                      .map(([key, value]) => {
                        // Split the key into words, capitalize the first letter of each word, then join them with spaces
                        let formattedKey = key
                          .split(/(?=[A-Z])/)
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ");

                        // Capitalize the first letter of the value
                        let formattedValue =
                          key === "date"
                            ? new Date(value).toLocaleDateString("en-GB")
                            : value.charAt(0).toUpperCase() + value.slice(1);

                        return `<li>${formattedKey}: ${formattedValue}</li>`;
                      })
                      .join("")}
                </ul>
            </div>

            <div class="section">
                <h2>Next Steps:</h2>
                <p>Based on the latest risk assessment, here are some steps you can take to improve your health:</p>
                <ul>
                    <li>Exercise regularly</li>
                    <li>Follow a balanced diet</li>
                    <li>Get enough sleep</li>
                    <li>Manage stress</li>
                    <li>Quit smoking</li>
                </ul>

                <p>Remember to consult your healthcare provider before making any changes to your lifestyle.</p>
                <p>
                    <span>Disclaimer: This report is for informational purposes only and should not be considered as substitute for medical advice</span>
                    <span>Please consult a healthcare professional for a diagnosis and treatment plan.</span>
                </p>
            </div>
        </body>
</html>
`;

    await page.setContent(html);
    console.log("About to generate PDF");
    let pdf = await page.pdf({ format: "A4" });

    if (!pdf) {
      console.log("PDF generation failed");
      return res.status(500).json({ message: "Error generating PDF" });
    }
    console.log("PDF generated");
    await browser.close();

    // Upload the PDF to Firebase Cloud Storage
    const bucket = admin.storage().bucket();
    const file = bucket.file(`Reports/${report._id}.pdf`);

    // Create a stream from the PDF buffer
    const stream = file.createWriteStream({
      metadata: {
        contentType: "application/pdf",
      },
    });

    stream.on("error", (err) => {
      console.error(err);
      res.status(500).json({ message: "Error uploading to Firebase" });
    });

    // When the stream is finished, make the file public and return the URL
    stream.on("finish", async () => {
      await file.makePublic();
      const url = `https://storage.googleapis.com/${bucket.name}/${file.name}`;

      if (!url) {
        console.log("URL generation failed");
        return res.status(500).json({ message: "Error generating URL" });
      }

      console.log("URL generated");

      report.reportURL = url;
      await report.save();

      res.status(201).json({ url });
    });

    stream.end(pdf);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
}
