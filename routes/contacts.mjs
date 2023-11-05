import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// Fetch all contacts
router.get("/", async (req, res) => {
  try {
    const collection = db.collection("contacts");
    const results = await collection.find({}).toArray();
    res.json(results);
  } catch (err) {
    res.status(500).json({
      error: "An error occurred while retrieving user information.",
    });
  }
});

// Fetch contact by ID
router.get("/id/:id", async (req, res) => {
  try {
    if (req.params.id.length === 24) {
      const contactId = new ObjectId(req.params.id);
      const collection = db.collection("contacts");

      const results = await collection.find({ _id: contactId }).toArray();
      res.json(results);
    } else {
      console.error("Incorrect contact ID.");
      res.status(400).json({
        error: "Incorrect contact ID.",
      });
    }
  } catch (err) {
    res.status(500).json({
      error: "An error occurred while retrieving contact by ID.",
    });
  }
});

// Fetch contacts whose birthday is next month
router.get("/birthdays-next-month", async (req, res) => {
  try {
    const collection = db.collection("contacts");

    const results = await collection
      .find({
        $expr: {
          $eq: [
            "$birthday.month",
            {
              $cond: {
                if: { $eq: [{ $month: new Date() }, 12] },
                then: 1,
                else: { $add: [{ $month: new Date() }, 1] },
              },
            },
          ],
        },
      })
      .project({ _id: 1, first_name: 1, last_name: 1, birthday: 1 })
      .sort({ "birthday.day": 1 })
      .toArray();

    res.json(results);
  } catch (err) {
    res.status(500).json({
      error: "An error occurred while retrieving next birthday." + err,
    });
  }
});

// Fetch contact whose birthday is coming next
router.get("/next-birthday", async (req, res) => {
  try {
    const collection = db.collection("contacts");
    const currentMonth = new Date().getMonth() + 1;

    const results = await collection
      .aggregate([
        {
          $addFields: {
            monthDiff: {
              $cond: {
                if: { $gte: ["$birthday.month", currentMonth] },
                then: { $subtract: ["$birthday.month", currentMonth] },
                else: {
                  $add: [12, { $subtract: ["$birthday.month", currentMonth] }],
                },
              },
            },
          },
        },
        {
          $sort: {
            monthDiff: 1,
            "birthday.day": 1,
          },
        },
      ])
      .project({ monthDiff: 0 })
      .limit(1)
      .toArray();

    res.json(results);
  } catch (err) {
    res.status(500).json({
      error: "An error occurred while retrieving next birthday." + err,
    });
  }
});

// Delete contact by ID
router.delete("/delete/:id", async (req, res) => {
  try {
    if (req.params.id.length === 24) {
      const contactId = new ObjectId(req.params.id);
      const collection = db.collection("contacts");

      const results = await collection.deleteOne({ _id: contactId });

      res.json([
        {
          deletedContactsCount: results.deletedCount,
        },
      ]);
    } else {
      res.status(400).json({
        error: "Incorrect contact ID.",
      });
    }
  } catch (err) {
    res.status(500).json({
      error: "An error occurred while deleting contact by ID.",
    });
  }
});

// Add a new contact
router.post("/add", async (req, res) => {
  try {
    const data = req.body;
    let collection = db.collection("contacts");

    const results = await collection.insertOne(data);
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({
      error: "An error occurred while adding a new contact.",
    });
  }
});

// Edit the contact
router.put("/edit", async (req, res) => {
  try {
    const data = req.body;
    const collection = db.collection("contacts");
    const contactId = new ObjectId(data._id);

    const contactFields = [
      "first_name",
      "last_name",
      "birthday",
      "email",
      "phone",
      "address",
      "age",
    ];

    const updatedFields = {};

    contactFields.forEach((field) => {
      // Add field in request body to the updatedFields list if field exist in contactFields
      if (data.hasOwnProperty(field)) {
        updatedFields[field] = data[field];
      }
    });

    if (Object.keys(updatedFields).length === 0) {
      res.status(400).json({
        error:
          "The request body is empty, and it must contain data for the update operation.",
      });
      return;
    }

    const results = await collection.updateOne(
      { _id: contactId },
      { $set: updatedFields }
    );

    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({
      error: "An error occurred while updating contact",
    });
  }
});

// Add age fields if not exists
router.get("/add-age-fields", async (req, res) => {
  try {
    let collection = db.collection("contacts");

    // Calculate age if the age field doesn't exist. If birthday month and day have already occurred this year, subtract current year by birthday year, otherwise, subtract 1 from the current year before subtracting it from the birthday year.
    const results = await collection.updateMany({ age: { $exists: false } }, [
      {
        $addFields: {
          age: {
            $cond: {
              if: {
                $or: [
                  {
                    $gt: [{ $month: new Date() }, "$birthday.month"],
                  },
                  {
                    $and: [
                      { $eq: [{ $month: new Date() }, "$birthday.month"] },
                      { $gte: [{ $dayOfMonth: new Date() }, "$birthday.day"] },
                    ],
                  },
                ],
              },
              then: {
                $subtract: [{ $year: new Date() }, "$birthday.year"],
              },
              else: {
                $subtract: [
                  { $subtract: [{ $year: new Date() }, 1] },
                  "$birthday.year",
                ],
              },
            },
          },
        },
      },
    ]);
    res.status(200).json({ modifiedContactsCount: results.modifiedCount });
  } catch (err) {
    res.status(500).json({
      error: "An error occurred while calculating and adding age fields.",
    });
  }
});

export default router;
