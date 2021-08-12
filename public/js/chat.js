const socket = io();

// display all msgs
async function loadMsgs() {
  const allMsgs = await axios.get("/allmessages");
  // console.log(allMsgs);
  
  const time = timeDifference(new Date(),new Date(msg.createdAt))

  for (let msg of allMsgs.data) {
    $("#all-msg-container").append(
      `<li class="chats">
        <span>${msg.user}</span>
        <span>${msg.createdAt}</span>
        <!-- <p class="chatMsg">${msg.content}</p> -->
        <div>
          <span>${time}</span>
        </div>
      </li>`
    );
  }
}

loadMsgs();

// send msgs into db
$("#send-msg-btn").click(() => {
  const textMsg = $("#msg-text").val();
  // console.log(textMsg);

  socket.emit("send-msg", {
    user: currentUser,
    msg: textMsg,
  });

  $("#msg-text").val("");
});

// receive msgs on webpage
socket.on("recived-msg", (data) => {
  // console.log(data);
  const time = timeDifference(new Date(),new Date(data.createdAt))

  $("#all-msg-container").append(
    `<li class="chats">
        <span>${data.user}</span>
        <!-- <span>${data.createdAt}</span> -->
        <span>${time}</span>
        <p class="chatMsg">${data.msg}</p>
     </li>`
  );
});

console.log(currentUser);

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

    return Math.round(elapsed / 1000) + " seconds ago";
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + " minutes ago";
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + " hours ago";
  } else if (elapsed < msPerMonth) {
    return Math.round(elapsed / msPerDay) + " days ago";
  } else if (elapsed < msPerYear) {
    return Math.round(elapsed / msPerMonth) + " months ago";
  } else {
    return Math.round(elapsed / msPerYear) + " years ago";
  }
}