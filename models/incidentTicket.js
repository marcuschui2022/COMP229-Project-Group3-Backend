// require modules for the BusinessContacts Model
const mongoose = require("mongoose");

// create a BusinessContacts Schema
const IncidentTicket = mongoose.Schema(
  {
    // 130418-0000001
    recordNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    incidentDescription: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "New",
    },
    incidentPriority: {
      type: String,
      // enum: priority,
      default: "Low",
    },
    customerInformation: {
      type: String,
      required: true,
    },
    incidentNarrative: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updateAt: {
      type: Date,
      default: Date.now,
    },
    logs: {
      type: [],
      required: false,
    },
  },
  {
    // collection: "incident-ticket",
    collection: "incidenttickets",
  }
);

module.exports.IncidentTicket = mongoose.model(
  "IncidentTicket",
  IncidentTicket
);
