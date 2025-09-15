import $api from "../http/index.js";

class PostService {
  async getBlogPosts(blogSlug) {
    return $api.get(`/posts/blog-posts/get/${blogSlug}`);
  }

  async getBlogPost(postSlug) {
    return $api.get(`/posts/blog-post/get/${postSlug}`);
  }

  async getLatestPosts() {
    return $api.get("/posts/latest-posts/get");
  }

  async createPost(
    userId,
    postTitle,
    postBody,
    postTags,
    blogId,
    nicknameSlug,
  ) {
    return $api.post("/posts/create", {
      id: userId,
      title: postTitle,
      body: postBody,
      tags: postTags,
      blogId,
      nicknameSlug,
    });
  }

  async editPost(userId, postTitle, postBody, postTags, nicknameSlug, postId) {
    return $api.patch("/posts/edit", {
      id: userId,
      title: postTitle,
      body: postBody,
      tags: postTags,
      nicknameSlug,
      postId,
    });
  }

  async deletePost(postId) {
    return $api.delete(`/posts/delete/${postId}`);
  }

  async pinTogglePost(userId, postId) {
    return $api.patch("/posts/pin-toggle", {
      id: userId,
      postId,
    });
  }

  async hideTogglePost(userId, postId) {
    return $api.patch("/posts/hide-toggle", {
      id: userId,
      postId,
    });
  }

  async likePost(userId, postId) {
    return $api.patch("/posts/like", {
      id: userId,
      postId,
    });
  }

  async dislikePost(userId, postId) {
    return $api.patch("/posts/dislike", {
      id: userId,
      postId,
    });
  }
}

export default new PostService();
