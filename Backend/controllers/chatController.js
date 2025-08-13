import Listing from "../models/Listing.js";

// Create or get chat between buyer & seller about a listing
export const createOrGetChat = async (req, res) => {
  const { listingId, sellerId } = req.body;
  const buyerId = req.user._id;
  if (!listingId || !sellerId)
    return res
      .status(400)
      .json({ message: "listingId and sellerId are required" });

  // verify listing exists (optional but good)
  const listing = await Listing.findById(listingId).select("_id owner");
  if (!listing) return res.status(404).json({ message: "Listing not found" });

  const participants = [buyerId, sellerId];

  let chat = await Chat.findOne({
    listing: listingId,
    participants: { $all: participants },
  });

  if (!chat) {
    chat = await Chat.create({ participants, listing: listingId });
  }
  res.status(201).json(chat);
};

// List chats for current user
export const getUserChats = async (req, res) => {
  const userId = req.user._id;
  const { page = 1, limit = 20 } = req.query;
  const pageNum = Math.max(1, parseInt(page));
  const pageSize = Math.min(50, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * pageSize;

  const [items, total] = await Promise.all([
    Chat.find({ participants: userId })
      .populate("listing", "title price images")
      .populate("participants", "name avatar")
      .sort("-updatedAt")
      .skip(skip)
      .limit(pageSize)
      .lean(),
    Chat.countDocuments({ participants: userId }),
  ]);

  res.json({
    page: pageNum,
    limit: pageSize,
    total,
    totalPages: Math.ceil(total / pageSize) || 1,
    items,
  });
};
