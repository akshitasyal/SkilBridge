import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { verifySeller } from "../middleware/verifySeller.js";
import { requireFields } from "../middleware/validate.js";
import { getAllGigs, getGigById, createGig, deleteGig, updateGig } from "../controllers/gigController.js";

const router = Router();

// GET /api/gigs?category=&search=
router.get("/", getAllGigs);

// GET /api/gigs/:id
router.get("/:id", getGigById);

// POST /api/gigs  — seller only (validates required fields before hitting the DB)
router.post("/", authenticate, verifySeller, requireFields(["title", "description", "price", "category", "image"]), createGig);

// PUT /api/gigs/:id  — owner only
router.put("/:id", authenticate, updateGig);

// DELETE /api/gigs/:id  — owner only
router.delete("/:id", authenticate, deleteGig);

export default router;
