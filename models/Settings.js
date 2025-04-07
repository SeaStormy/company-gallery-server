const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    logo: {
      type: String,
      required: false,
    },
    landingPageImage: {
      type: String,
      required: false,
    },
    landingPageTitle: {
      type: String,
      required: false,
    },
    landingPageDescription: {
      type: String,
      required: false,
    },
    notification: {
      text: {
        type: String,
        required: false,
      },
      isActive: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Settings', settingsSchema);
