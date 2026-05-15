export const techTourData = {
  "vehicles-and-transport": {
    id: "vehicles-and-transport",
    title: "Vehicles and Transport Systems",
    imageName: "Vehicles and Transport Systems.png",
    nodes: [
      {
        id: "loc-tracking",
        title: "Location Tracking",
        howItWorks: "Built-in GPS and navigation history integrated with mobile apps like Tata iRA and Hyundai Blue Link.",
        detailedRisks: [
          { category: "Surveillance", detail: "Shared account credentials can be exploited to track a user's movements and identify frequent locations." }
        ],
        context: "Governed by the Information Technology Act 2000 and IPC Section 354D; tracking without consent is a criminal act.",
        coordinates: { x: 25, y: 35 }
      },
      {
        id: "remote-access",
        title: "Remote Access Intimidation",
        howItWorks: "Vehicles are linked directly to mobile numbers, personal emails, and cloud accounts for remote management.",
        detailedRisks: [
          { category: "Unauthorized Access", detail: "Remote features (locking, engine start, AC) can be misused to intimidate or harass victims." }
        ],
        context: "Regularly change app passwords and reset infotainment systems to secure access.",
        coordinates: { x: 80, y: 55 }
      },
      {
        id: "data-persistence",
        title: "Infotainment Data Persistence",
        howItWorks: "Cars store synced call logs, contacts, voice commands, and navigation history via Bluetooth connectivity.",
        detailedRisks: [
          { category: "Data Persistence", detail: "Personal call logs and contacts often remain stored in infotainment systems even after a phone is disconnected." }
        ],
        coordinates: { x: 45, y: 75 }
      }
    ]
  },
  "smart-home-devices": {
    id: "smart-home-devices",
    title: "Smart Home Devices",
    imageName: "Smart Home Devices.png",
    nodes: [
      {
        id: "smart-cctv",
        title: "CCTV Hacking",
        howItWorks: "Cameras provide live video streaming and motion alerts directly to linked mobile applications.",
        detailedRisks: [
          { category: "Covert Monitoring", detail: "Victims can be watched or recorded without their knowledge or consent due to hacked feeds." }
        ],
        context: "Secure home Wi-Fi with WPA3 and physically cover cameras when not in use.",
        coordinates: { x: 30, y: 20 }
      },
      {
        id: "smart-locks",
        title: "Smart Lock Manipulation",
        howItWorks: "Offers remote entry control via internet-connected applications.",
        detailedRisks: [
          { category: "Psychological Intimidation", detail: "Remote manipulation of lights and door locks can be used to create a climate of fear." }
        ],
        context: "Violations fall under the IT Act 2000 and IPC Sections 354C (Voyeurism) and 354D (Stalking).",
        coordinates: { x: 75, y: 35 }
      },
      {
        id: "voice-assistants",
        title: "Voice Assistant Exposure",
        howItWorks: "These devices are 'always listening,' executing voice commands and controlling the home ecosystem.",
        detailedRisks: [
          { category: "Audio Surveillance", detail: "Potentially recording private conversations and exposing personal data through linked accounts." }
        ],
        coordinates: { x: 50, y: 50 }
      }
    ]
  },
  "mobile-phones": {
    id: "mobile-phones",
    title: "Mobile Phones",
    imageName: "Mobile Phones.png",
    nodes: [
      {
        id: "spyware",
        title: "Spyware & Stalking Apps",
        howItWorks: "Secretive software—often disguised as harmless utility apps—designed to record calls, intercept messages, and monitor movements.",
        detailedRisks: [
          { category: "Total Surveillance", detail: "Captures WhatsApp chats, real-time GPS location, and can secretly record microphone audio." }
        ],
        context: "Crimes are addressed under the IT Act and IPC Sections 354D and 66E (Privacy violation).",
        coordinates: { x: 50, y: 25 }
      },
      {
        id: "account-access",
        title: "OTP Interception",
        howItWorks: "Exploitation of shared passwords and the interception of OTPs via unauthorized SIM access.",
        detailedRisks: [
          { category: "Unauthorized Access", detail: "Grants total access to your cloud storage, banking apps, and social media profiles." }
        ],
        context: "Use biometric authentication and conduct regular audits of app permissions.",
        coordinates: { x: 80, y: 40 }
      },
      {
        id: "whatsapp-web",
        title: "WhatsApp Web Linking",
        howItWorks: "Linking the main account to WhatsApp Web on a computer without the victim's knowledge.",
        detailedRisks: [
          { category: "Message Interception", detail: "Allows remote, real-time reading of private conversations." }
        ],
        context: "Log out from all linked WhatsApp devices and perform factory resets if spyware is suspected.",
        coordinates: { x: 30, y: 80 }
      }
    ]
  },
  "computers-online-accounts": {
    id: "computers-online-accounts",
    title: "Computers & Online Accounts",
    imageName: "Computers & Online Accounts.png",
    nodes: [
      {
        id: "email-compromise",
        title: "Phishing & Email Hacking",
        howItWorks: "Hackers target the primary email address via phishing emails or guessing weak, reused passwords.",
        detailedRisks: [
          { category: "Email Compromise", detail: "Can expose a user's entire digital identity, including academic records and government IDs." }
        ],
        context: "Regulated by the IT Act 2000 and IPC Section 66 (Hacking and data theft).",
        coordinates: { x: 40, y: 20 }
      },
      {
        id: "saved-passwords",
        title: "Saved Password Export",
        howItWorks: "Shared family computers allow for the easy export of passwords stored within web browsers.",
        detailedRisks: [
          { category: "Credential Misuse", detail: "Anyone with physical access to the unlocked computer can easily view, export, and misuse all your saved passwords." }
        ],
        context: "Enable Two-Factor Authentication (2FA) and avoid saving credentials on shared systems.",
        coordinates: { x: 75, y: 35 }
      },
      {
        id: "keyloggers",
        title: "Keyloggers on Shared Devices",
        howItWorks: "Hidden software that secretly records every single keystroke typed on shared or public computers.",
        detailedRisks: [
          { category: "Malicious Software", detail: "Keyloggers can capture every keystroke, including bank details, in real time." }
        ],
        coordinates: { x: 25, y: 55 }
      }
    ]
  },
  "tracking-technologies": {
    id: "tracking-technologies",
    title: "Tracking Technologies",
    imageName: "Tracking Technologies.png",
    nodes: [
      {
        id: "gps-trackers",
        title: "Hidden GPS Chassis Trackers",
        howItWorks: "Miniature devices hidden in personal belongings or vehicles that transmit location data to remote apps.",
        detailedRisks: [
          { category: "Movement Monitoring", detail: "Provides detailed knowledge of a user's location, daily schedules, and meeting patterns." }
        ],
        context: "Tracking without consent is illegal under IPC Sections 354D and 66E.",
        coordinates: { x: 30, y: 25 }
      },
      {
        id: "airtag",
        title: "AirTag Surveillance",
        howItWorks: "Devices like Apple AirTags or Samsung SmartTags can be secretly placed in bags to track movement via global crowdsourced networks.",
        detailedRisks: [
          { category: "Physical Safety", detail: "High risk of confrontation if a stalker knows exactly when a victim is alone or on their regular route." }
        ],
        context: "Utilize Bluetooth scanner apps to detect unauthorized tags and regularly inspect bags.",
        coordinates: { x: 70, y: 35 }
      },
      {
        id: "movement",
        title: "Movement Monitoring",
        howItWorks: "Aggregating continuous tracking data to build a comprehensive behavioral profile.",
        detailedRisks: [
          { category: "Pattern Profiling", detail: "Accurately predicts your future locations, significantly increasing vulnerability." }
        ],
        coordinates: { x: 50, y: 80 }
      }
    ]
  },
  "everyday-apps": {
    id: "everyday-apps",
    title: "Everyday Apps & Connected Services",
    imageName: "Everyday Apps & Connected Services.png",
    nodes: [
      {
        id: "navigation-apps",
        title: "Ride-Sharing Location History",
        howItWorks: "Apps like Uber and Ola permanently store search history, home/work addresses, and trip logs.",
        detailedRisks: [
          { category: "Navigation & Transit", detail: "Exposure of home and work locations through shared Uber or Ola accounts." }
        ],
        coordinates: { x: 40, y: 20 }
      },
      {
        id: "financial-apps",
        title: "UPI Fraud",
        howItWorks: "UPI applications (GPay, PhonePe) link your bank accounts directly to your active mobile number.",
        detailedRisks: [
          { category: "Financial Services", detail: "Vulnerabilities to UPI fraud and the exposure of private spending patterns." }
        ],
        context: "Governed by the IT Act 2000 and IPC Sections 420 and 66C.",
        coordinates: { x: 75, y: 40 }
      },
      {
        id: "fitness",
        title: "Fitness Route Predictability",
        howItWorks: "Fitness apps and wearables track your GPS running routes, continuous heart rate, and sleep cycles.",
        detailedRisks: [
          { category: "Health Metrics", detail: "Fitness apps and wearables reveal predictable daily workout routes and schedules." }
        ],
        context: "Use strong, unique passwords for every service and never share OTPs.",
        coordinates: { x: 20, y: 50 }
      }
    ]
  }
};
