export interface Document {
  _id: string;
  userId: string;
  fileName: string;
  fileUrl: string;
  fileType: "resume" | "cover_letter";
  createdAt: string;
  updatedAt: string;
}