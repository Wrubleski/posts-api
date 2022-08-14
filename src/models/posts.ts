import { model, Schema } from "mongoose";
import { v4 as uuidv4 } from 'uuid';
import { IPost } from "../dtos/post";

const postSchema = new Schema<IPost>({
  id: {type: String, default: () => uuidv4()},
  title: {type: String, required: true},
  body: {type: String, required: true},
  tags: {type: [String], required: true}
})

const Posts = model<IPost>("posts", postSchema);

export default Posts;