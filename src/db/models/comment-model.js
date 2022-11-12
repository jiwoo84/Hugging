import { model } from "mongoose";
import { commentSchema } from "../schemas/comment-schema";

const Comment = model("Comment", commentSchema);

export { Comment };
