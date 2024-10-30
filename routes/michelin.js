import express from "express"
import db from "../config/database.js"
import { ObjectId } from "mongodb"

const router = express.Router()

//Test
router.get("/", async (req, res) => {
  let collection = await db.collection("michelin")
  let results = await collection.find({}).limit(5).toArray()

  res.send(results).status(200)
})

// 1./country/:country
router.get("/country/:country", async (req, res) => {
  let collection = await db.collection("michelin")
  let { country } = req.params
  let results = await collection.find({ country }).limit(5).toArray()

  res.send(results).status(200)
})

// 2./country/:cuisine
router.get("/cuisine/:cuisine", async (req, res) => {
  let collection = await db.collection("michelin")
  let { cuisine } = req.params
  let results = await collection
    .find({ cuisine: { $in: [`${cuisine}`] } })
    .limit(5)
    .toArray()

  res.send(results).status(200)
})

//3./countByCountry
router.get("/countByCountry", async (req, res) => {
  let collection = await db.collection("michelin")
  let results = await collection
    .aggregate([{ $group: { _id: "$country", numOfCountry: { $sum: 1 } } }])
    .toArray()

  res.send(results).status(200)
})

//4./noChefField
router.get("/noChefField", async (req, res) => {
  let collection = await db.collection("michelin")
  let results = await collection
    .aggregate([{ $match: { chef: { $exists: false } } }, { $limit: 5 }])
    .toArray()

  res.send(results).status(200)
})

//5. /chineseInLondon
router.get("/chineseInLondon", async (req, res) => {
  let collection = await db.collection("michelin")
  let results = await collection
    .aggregate([{ $match: { cuisine: { $in: ["Chinese"] }, city: "London" } }])
    .toArray()

  res.send(results).status(200)
})

//6. /creativeAndInnovative
router.get("/creativeAndInnovative", async (req, res) => {
  let collection = await db.collection("michelin")
  let results = await collection
    .aggregate([{ $match: { cuisine: { $all: ["Creative", "Innovative"] } } }])
    .toArray()

  res.send(results).status(200)
})

//7. /thaiCuisineNotInThailand
router.get("/thaiCuisineNotInThailand", async (req, res) => {
  let collection = await db.collection("michelin")
  let results = await collection
    .aggregate([
      { $match: { cuisine: { $in: ["Thai"] }, country: { $ne: "Thailand" } } }
    ])
    .toArray()

  res.send(results).status(200)
})

//8. /cuisine2/:cuisine[?stars=n], /cuisine2/Sushi/cuisine2/Sushi?stars=3
router.get("/cuisine2/:cuisine", async (req, res) => {
  let collection = await db.collection("michelin")
  let { cuisine } = req.params
  let { stars } = req.query

  const query = { cuisine }
  if (stars) {
    query.stars = parseInt(stars)
  }

  let results = await collection.find(query).toArray()

  res.status(200).json(results)
})

//9. /top10Cuisines
router.get("/top10Cuisines", async (req, res) => {
  let collection = await db.collection("michelin")
  let results = await collection
    .aggregate([
      { $group: { _id: "$cuisine", numOfRestaurant: { $sum: 1 } } },
      { $sort: { numOfRestaurant: -1 } },
      { $limit: 10 }
    ])
    .toArray()

  res.send(results).status(200)
})

//10. /thailandWithStreetfoodOrStars3
router.get("/thailandWithStreetfoodOrStars3", async (req, res) => {
  let collection = await db.collection("michelin")
  let results = await collection
    .aggregate([
      {
        $match: {
          country: "Thailand",
          $or: [{ cuisine: "Street Food" }, { stars: 3 }]
        }
      }
    ])
    .toArray()

  res.send(results).status(200)
})

export default router
