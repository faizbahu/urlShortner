import express from "express";
import validateUrl from "../middleware/validateUrl.js";
import {
  createShortUrl,
  getUserUrls,
  redirectToOriginalUrl,
} from "../controllers/urlController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();


// Protected routes
router.post("/", protect, validateUrl, createShortUrl);

router.get("/", protect, getUserUrls);



export default router;
