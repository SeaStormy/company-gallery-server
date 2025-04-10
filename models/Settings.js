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
    sections: {
      contactInfo: {
        title: {
          type: String,
          required: false,
        },
        address: {
          en: {
            type: String,
            required: false,
          },
          vi: {
            type: String,
            required: false,
          },
        },
        phone: {
          type: String,
          required: false,
        },
        email: {
          type: String,
          required: false,
        },
      },
      workingHours: {
        title: {
          type: String,
          required: false,
        },
        weekdays: {
          en: {
            type: String,
            required: false,
          },
          vi: {
            type: String,
            required: false,
          },
        },
        saturday: {
          en: {
            type: String,
            required: false,
          },
          vi: {
            type: String,
            required: false,
          },
        },
        sunday: {
          en: {
            type: String,
            required: false,
          },
          vi: {
            type: String,
            required: false,
          },
        },
      },
    },
    landingPageTitle: {
      en: {
        type: String,
        required: false,
      },
      vi: {
        type: String,
        required: false,
      },
    },
    landingPageDescription: {
      en: {
        type: String,
        required: false,
      },
      vi: {
        type: String,
        required: false,
      },
    },
    notification: {
      text: {
        en: {
          type: String,
          required: false,
        },
        vi: {
          type: String,
          required: false,
        },
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
