import { model, Schema } from "mongoose";
import { IPost } from "../dtos/post";

const postSchema = new Schema<IPost>({
  title: {type: String, required: true},
  body: {type: String, required: true},
  tags: {type: [String], required: true}
})

const Posts = model<IPost>("posts", postSchema);

export default Posts;