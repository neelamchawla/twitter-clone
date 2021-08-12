// disable button
$(document).ready(function () {
    $('#post-text').on('input change', function () {
        if ($(this).val() != '') {
            $('#submitPostButton').prop('disabled', false);
        } else {
            $('#submitPostButton').prop('disabled', true);
            $('#submitPostButton').css("background-color", "#99c9e8");
            $('#submitPostButton').css("cursor", "default");
        }
    });
});

// 2. refresh post when we add new post
async function refreshPosts() {
    $('.postsContainer').empty();
    const posts = await axios.get('/api/post');
    // console.log(posts);

    for (let post of posts.data) {
        console.log(post);

        // 3. create html tag to push newPost
        const html = createPostHtml(post)
        $(".postsContainer").prepend(html);
    }
}

refreshPosts();

// 1. Creating a new post
$('#submitPostButton').click(async () => {
    const postText = $('#post-text').val();
    await axios.post('/api/post', { content: postText });
    $('#post-text').val("");
    refreshPosts();
});

// 5. Like the post
$('.postsContainer').on('click', '.likeButton', async (event) => {

    const button = $(event.target);
    const postId = getPostIdFromElement(button);
    // console.log(postId);

    const postData = await axios.patch(`/api/posts/${postId}/like`);
    // console.log(postData);

    // show dynamic updated like count
    button.find("span").text(postData.data.likes.length);
    // if (postId == postData.data._id) {
    //     button.find("i").css('color', 'red');
    // } else {
    //     button.find("i").css('color', 'black');
    // }
});

// 8. submit reply to retweet: add listerner on submit btn to post the reply
$('#submitReplyButton').click(async (event) => {

    const element = $(event.target);
    // get the data from text box
    const postText = $('#reply-text-container').val();

    // 8. attribute passed to get the id of post
    const replyTo = element.attr('data-id');

    const postData = await axios.post("/api/post", {
        content: postText,
        replyTo: replyTo,
    });

  // console.log(postData);
    
  // automatically refresh when we submit post
  location.reload();
});

// 7. create comment modal function
// this replyTo will be created on 1 post box to which we are replying;
// update in routes/api/post -> create new post
$('#replyModal').on('show.bs.modal', async (event) => {
    // console.log('modal opened');

    // event.relatedTarget => return element on mouse enter/leave
    const button = $(event.relatedTarget);
    const postId = getPostIdFromElement(button);
    // console.log(postId);

    // 8. create attribute to pass the id of post
    $('#submitReplyButton').attr('data-id', postId);

    const postData = await axios.get(`/api/posts/${postId}`);

    const html = createPostHtml(postData.data);

    // empty modal box each time we press replyTo button
    $('#originalPostContainer').empty();
    
    // display post data above textarea for replyto comment
    $('#originalPostContainer').append(html);

});

// 6. get ID of the liked post
function getPostIdFromElement(element) {

    const isRoot = element.hasClass('post');

    const rootElement = isRoot === true ? element : element.closest('.post');
    const postId = rootElement.data().id;

    return postId;
}

// 3. html tag for newPost
function createPostHtml(postData) {

    const postedBy = postData.postedBy;

    if (postedBy._id === undefined) {
        return console.log("User object not populated");
    }

    const displayName = postedBy.firstName + " " + postedBy.lastName;

    // const timestamp = postData.createdAt();
    const timestamp = timeDifference(new Date(), new Date(postData.createdAt));

    // replyTo -> html container box
    let replyFlag = "";
    if (postData.replyTo && postData.replyTo._id) {
        if (!postData.replyTo._id) {
        // return alert("Reply to is not populated");
        } else if (!postData.replyTo.postedBy._id) {
        // return alert("Posted by is not populated");
        }

    // const replyTo = postData.replyTo ? `replying to ${displayName}` : "";
    const replyToUsername = postData.replyTo.postedBy.username;
    replyFlag = `<span class='replyFlag'>
                    Replying to <a href='/profile/${replyToUsername}'>@${replyToUsername}</a>
                </span>`;
  }

    return `<div class='post' data-id='${postData._id}'>

                <div class='mainContentContainer'>
                    <div class='userImageContainer'>
                        <img src='${postedBy.profilePic}'>
                    </div>
                    <div class='postContentContainer'>
                        <div class='header'>
                            <a href='/profile/${postedBy.username}' class='displayName'>${displayName}</a>
                            <span class='username'>@${postedBy.username}</span>
                            <span class='date'>${timestamp}</span>
                            ${replyFlag}
                        </div>
                        <div class='postBody'>
                            <span>${postData.content}</span>
                        </div>
                        <div class='postFooter'>
                        <div class='postButtonContainer'>
                            <button type="button" class="tweetBtn" data-bs-toggle="modal" data-bs-target="#replyModal">
                                <i class='far fa-comment'></i>
                            </button>
                        </div>
                        <div class='postButtonContainer green'>
                            <button class='tweetBtn retweet'>
                                <i class='fas fa-retweet'></i>
                            </button>
                        </div>
                        <div class='postButtonContainer red'>
                            <button class='tweetBtn likeButton'>
                                <i class='far fa-heart'></i>
                                <span>${postData.likes.length}</span>
                            </button>
                        </div>
                </div>
            </div>
        </div>
    </div>`;
}

// 4. timestamp formate
function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {

        if (elapsed / 1000 < 30) {

            return "Just now";
        }

        return Math.round(elapsed / 1000) + ' seconds ago';
    }

    else if (elapsed < msPerHour) {
        return Math.round(elapsed / msPerMinute) + ' minutes ago';
    }

    else if (elapsed < msPerDay) {
        return Math.round(elapsed / msPerHour) + ' hours ago';
    }

    else if (elapsed < msPerMonth) {
        return Math.round(elapsed / msPerDay) + ' days ago';
    }

    else if (elapsed < msPerYear) {
        return Math.round(elapsed / msPerMonth) + ' months ago';
    }

    else {
        return Math.round(elapsed / msPerYear) + ' years ago';
    }
}
