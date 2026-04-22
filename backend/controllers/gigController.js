import prisma from "../config/db.js";

// GET /api/gigs?category=&search=
export const getAllGigs = async (req, res) => {
  const { category, search, userId } = req.query;
  try {
    const gigs = await prisma.gig.findMany({
      where: {
        ...(category ? { category: { equals: category, mode: "insensitive" } } : {}),
        ...(userId ? { userId: Number(userId) } : {}),
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      include: {
        user: { select: { id: true, username: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(gigs);
  } catch (err) {
    console.error("GET /gigs error:", err);
    res.status(500).json({ error: "Failed to fetch gigs." });
  }
};

// GET /api/gigs/:id
export const getGigById = async (req, res) => {
  const { id } = req.params;
  try {
    const gig = await prisma.gig.findUnique({
      where: { id: Number(id) },
      include: {
        user: { select: { id: true, username: true, createdAt: true } },
      },
    });
    if (!gig) return res.status(404).json({ error: "Gig not found." });
    res.json(gig);
  } catch (err) {
    console.error("GET /gigs/:id error:", err);
    res.status(500).json({ error: "Failed to fetch gig." });
  }
};

// POST /api/gigs  — seller only
export const createGig = async (req, res) => {
  const { title, description, price, category, image, packages } = req.body;
  
  if (!title || !description || !price || !category) {
    return res.status(400).json({ error: "title, description, price, and category are required." });
  }
  
  try {
    const gig = await prisma.gig.create({
      data: {
        title,
        description,
        price: parseInt(price, 10),
        category,
        image: image || "",
        packages: packages || {},
        userId: req.user.userId,
      },
    });
    res.status(201).json(gig);
  } catch (err) {
    console.error("POST /gigs error:", err);
    res.status(500).json({ error: "Failed to create gig." });
  }
};

// DELETE /api/gigs/:id  — owner only
export const deleteGig = async (req, res) => {
  const { id } = req.params;
  try {
    const gig = await prisma.gig.findUnique({ where: { id: Number(id) } });
    if (!gig) return res.status(404).json({ error: "Gig not found." });
    if (gig.userId !== req.user.userId) {
      return res.status(403).json({ error: "Not authorised to delete this gig." });
    }
    await prisma.gig.delete({ where: { id: Number(id) } });
    res.json({ message: "Gig deleted successfully." });
  } catch (err) {
    console.error("DELETE /gigs/:id error:", err);
    res.status(500).json({ error: "Failed to delete gig." });
  }
};

// PUT /api/gigs/:id  — owner only
export const updateGig = async (req, res) => {
  const { id } = req.params;
  const { title, description, price, category, image, packages } = req.body;

  try {
    const gig = await prisma.gig.findUnique({ where: { id: Number(id) } });
    if (!gig) return res.status(404).json({ error: "Gig not found." });
    if (gig.userId !== req.user.userId) {
      return res.status(403).json({ error: "Not authorised to edit this gig." });
    }

    const updated = await prisma.gig.update({
      where: { id: Number(id) },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(price && { price: parseInt(price, 10) }),
        ...(category && { category }),
        ...(image !== undefined && { image }),
        ...(packages !== undefined && { packages }),
      },
    });

    res.json(updated);
  } catch (err) {
    console.error("PUT /gigs/:id error:", err);
    res.status(500).json({ error: "Failed to update gig." });
  }
};
