const createAnnouncement = async (data) => {
  try {
    const group_id = window.location.href.endsWith("/")
      ? window.location.href.split("/").slice(-3)[0]
      : window.location.href.split("/").slice(-2)[0];
    const response = await fetch(`/group/${group_id}/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw err;
    }
    const jsonRes = await response.json();
    return jsonRes;
  } catch (err) {
    throw err;
  }
};

$(document).ready((e) => {
  console.log("HELLO");
  let links = [];
  $("#add_btn").on("click", (e) => {
    e.preventDefault();
    let link = $("#link").val();
    links.push(link);
    let $link = $(`<a href = "${link}">${link}</a>`);
    $(".link_display").append($link);
  });
  $("#submit_btn").on("click", (e) => {
    e.preventDefault();
    const data = {
      title: $("#title").val(),
      description: $("#description").val(),
      content: $("#content").val(),
      completed: [],
      links: links,
    };
    createAnnouncement(data)
      .then((res) => {
        console.log(res);
        alert("Announcement added successfully");
      })
      .catch((err) => {
        console.log(err);
        alert("Something went wrong");
      });
  });
});
