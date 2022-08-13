export const getPaginatedPosts = (req, res) => {
  res.status(200).send("getPaginatedPosts")
}

export const addPost = (req, res) => {
  res.status(200).send("addPost")
}

export const getPostsById = (req, res) => {
  res.status(200).send("getPostsById: " + req.params.id)
}

export const updatePost = (req, res) => {
  res.status(200).send("updatePost: " + req.params.id)
}

export const deletePost = (req, res) => {
  res.status(200).send("deletePost: " + + req.params.id)
}