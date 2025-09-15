import $api from "../http/index.js";

class BlogService {
  async getUserBlogs(nicknameSlug) {
    return $api.get(`/blogs/user-blogs/get/${nicknameSlug}`);
  }

  async getUserBlog(slug) {
    return $api.get(`/blogs/user-blog/get/${slug}`);
  }

  async getPopularBlogs() {
    return $api.get("/blogs/popular-blogs/get");
  }

  async createBlog(userId, blogTitle, nicknameSlug) {
    return $api.post("/blogs/create", {
      id: userId,
      title: blogTitle,
      nicknameSlug,
    });
  }

  async updateBlogTitle(userId, blogId, blogNewTitle) {
    return $api.patch("/blogs/title/update", {
      id: userId,
      blogId,
      title: blogNewTitle,
    });
  }

  async updateBlogCover(data) {
    return $api.patch("/blogs/cover/update", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  async deleteBlog(blogId) {
    return $api.delete(`/blogs/delete/${blogId}`);
  }

  async pinToggleBlog(userId, blogId) {
    return $api.patch("/blogs/pin-toggle", {
      id: userId,
      blogId,
    });
  }

  async hideToggleBlog(userId, blogId) {
    return $api.patch("/blogs/hide-toggle", {
      id: userId,
      blogId,
    });
  }
}

export default new BlogService();
