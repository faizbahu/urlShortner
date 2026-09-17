import Url from "../models/urlModel.js";
import crypto from "crypto";
const createShortUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      return res.status(400).json({ message: "Original URL is required" });
    }
    const shortCode = crypto.randomBytes(4).toString("hex");
    const existingUrl = await Url.findOne({ shortUrl: shortCode });
    if (existingUrl) {
      return res.status(400).json({ message: "Short URL already exists" });
    }
    const newUrl = new Url({
      originalUrl,
      shortUrl: shortCode,
      user: req.user._id, // Assuming you have user authentication and req.user is set
    });
    await newUrl.save();
    const shortUrl = `${req.protocol}://${req.get("host")}/${shortCode}`;
    res.status(201).json({
      message: "Short URL created successfully",
      url: {
        id: newUrl._id,
        originalUrl: newUrl.originalUrl,
        shortCode: newUrl.shortCode,
        shortUrl,
        clicks: newUrl.clicks,
      },
    });
  } catch (error) {
    console.error("Error creating short URL:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const getUserUrls = async (req, res) => {
  try {
    const urls = await Url.find({ user: req.user._id });
    res.status(200).json({ urls });
  } catch (error) {
    console.error("Error fetching short URL:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const redirectToOriginalUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const url = await Url.findOne({ shortUrl: shortCode });
    if (!url) {
      return res.status(404).json({ message: "Short URL not found" });
    }
    url.clicks += 1;
    await url.save();
    res.redirect(url.originalUrl);
  } catch (error) {
    console.error("Error redirecting to original URL:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export { createShortUrl, getUserUrls, redirectToOriginalUrl };
