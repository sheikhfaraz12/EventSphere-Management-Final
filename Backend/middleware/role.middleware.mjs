export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Admin only" });
  next();
};

export const isExhibitor = (req, res, next) => {
  if (req.user.role !== "exhibitor") return res.status(403).json({ message: "Exhibitor only" });
  next();
};

export const isAttendee = (req, res, next) => {
  if (req.user.role !== "attendee") return res.status(403).json({ message: "Attendee only" });
  next();
};
