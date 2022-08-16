import { Document, Types } from 'mongoose';
import { IPost } from '../dtos/post';

export const postBuilder: (
  document: Document<unknown, any, IPost> &
    IPost & {
      _id: Types.ObjectId;
    },
) => IPost = (document) => {
  const post: IPost = {
    id: document._id.toString(),
    title: document.title,
    body: document.body,
    tags: document.tags,
  };

  return post;
};
