import mongoose, { model } from "mongoose";

const { Schema } = mongoose;

// Report Schema
const reportSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    reportType: { type: String, default: "" },
    reportData: { type: Object, default: {} },
    reportURL: { type: String, default: "" },
    startDate: { type: Date, default: Date.now },
  },
  { collection: "Report", timestamps: true }
);

const Report = model("Report", reportSchema);

export { Report };
