$(document).ready(() => {
  loadPosts();
});

async function loadPosts() {
  // call backend api
  const posts = await axios.get("/api/post", {
    params: { postedBy: profileUserId },
  });

  // console.log(posts);
  // console.log(profileUserId);
  
  // display post of particular clicked user
  for (let post of posts.data) {
    const html = createPostHtml(post);
    $(".userPostsContainer").prepend(html);
  }
}
