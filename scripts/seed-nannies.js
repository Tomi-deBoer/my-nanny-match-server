try {
  process.loadEnvFile();
} catch (error) {
  console.warn(".env file not found");
}

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const https = require("https");

const User = require("../models/user.model");
const NannyProfile = require("../models/nannyProfile.model");

const NUMBER_OF_NANNIES = 50;

const skills = [
  "Newborn care",
  "First aid",
  "Cooking",
  "Homework help",
  "Swimming",
  "Arts & crafts",
  "Outdoor activities",
  "Special needs care",
  "Pet friendly",
  "Multilingual"
];

const availabilityOptions = [
  {
    day: "Monday",
    from: "08:00",
    to: "17:00"
  },
  {
    day: "Tuesday",
    from: "08:00",
    to: "17:00"
  },
  {
    day: "Wednesday",
    from: "08:00",
    to: "17:00"
  },
  {
    day: "Thursday",
    from: "08:00",
    to: "17:00"
  },
  {
    day: "Friday",
    from: "08:00",
    to: "17:00"
  }
];

function getRandomItems(array, min, max) {
  const shuffled = [...array].sort(() => Math.random() - 0.5);

  const amount =
    Math.floor(Math.random() * (max - min + 1)) + min;

  return shuffled.slice(0, amount);
}

function getRandomExperience() {
  return Math.floor(Math.random() * 11) + 1;
}

function getRandomHourlyRate() {
  return Math.floor(Math.random() * 11) + 12;
}

function getRandomAvailability() {
  return getRandomItems(
    availabilityOptions,
    2,
    availabilityOptions.length
  );
}

function getRandomVerifiedStatus() {
  return Math.random() < 0.75;
}

function fetchRandomUsers(amount) {
  return new Promise((resolve, reject) => {
    const url =
      `https://randomuser.me/api/?gender=female&results=${amount}&nat=nl`;

    https.get(url, (response) => {
      let data = "";

      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        try {
          const parsedData = JSON.parse(data);

          resolve(parsedData.results);
        } catch (error) {
          reject(error);
        }
      });
    }).on("error", reject);
  });
}

async function seedNannies() {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Connected to MongoDB.");

    console.log(
      `Fetching ${NUMBER_OF_NANNIES} random users...`
    );

    const randomUsers = await fetchRandomUsers(
      NUMBER_OF_NANNIES
    );

    console.log(
      `Received ${randomUsers.length} random users.`
    );

    const passwordHash = await bcrypt.hash(
      "Nanny123!",
      10
    );

    let createdCount = 0;

    for (const randomUser of randomUsers) {
      const existingUser = await User.findOne({
        email: randomUser.email
      });

      if (existingUser) {
        console.log(
          `Skipping existing user: ${randomUser.email}`
        );

        continue;
      }

      const user = await User.create({
        name: `${randomUser.name.first} ${randomUser.name.last}`,
        email: randomUser.email,
        phoneNr: randomUser.phone,
        password: passwordHash,
        role: "nanny"
      });

      await NannyProfile.create({
        userId: user._id,
        profileImage: randomUser.picture.large,
        experienceInYears: getRandomExperience(),
        hourlyRate: getRandomHourlyRate(),
        skills: getRandomItems(skills, 3, 6),
        availability: getRandomAvailability(),
        isVerified: getRandomVerifiedStatus()
      });

      createdCount++;

      console.log(
        `Created nanny ${createdCount}/${NUMBER_OF_NANNIES}: ${user.name}`
      );
    }

    console.log("");
    console.log(
      `Successfully created ${createdCount} nanny profiles.`
    );

    console.log(
      "Default password for all seeded nannies: Nanny123!"
    );
  } catch (error) {
    console.error("Error seeding nannies:", error);
  } finally {
    await mongoose.disconnect();

    console.log("Disconnected from MongoDB.");
  }
}

seedNannies();