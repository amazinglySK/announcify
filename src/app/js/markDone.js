const markDone = async (post_id) => {
  try {
    let res = {};
    const response = await fetch(`/ann/${post_id}/submit`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      res.status = "OK";
    }
    return res;
  } catch (err) {
    console.log(err);
  }
};

$(document).ready((e) => {
  $("#done_btn").on("click", (e) => {
    e.preventDefault();
    let post_id = window.location.href.split("/").slice(-1)[0];
    markDone(post_id)
      .then((res) => {
        if ((res.status = "OK")) {
          alert("Successfully marked done");
          return;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});
