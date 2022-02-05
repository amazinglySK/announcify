const createAnnouncement = async (data) => {
  try {
    const response = await fetch("/ann/new", {
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
        if (res.redirect_url) {
          alert("Announcement added successfully");
          window.location.href = res.redirect_url;
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Something went wrong");
      });
  });
});
