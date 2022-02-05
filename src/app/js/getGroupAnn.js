function createAnnCard(Ann) {
  let link = document.createElement("a");
  let parentDiv = document.createElement("div");
  let titleText = document.createElement("h4");
  let descriptionText = document.createElement("p");
  let dateText = document.createElement("p");
  $(titleText).text(Ann.title);
  $(descriptionText).text(Ann.description);
  // $(dateText).text(Ann.dateOfPost.toLocaleString);
  $(parentDiv)
    .attr({
      class: "ann-card",
    })
    .append($(titleText), $(descriptionText), $(dateText));
  $(link)
    .attr({
      href: `/ann/${Ann.uid}`,
    })
    .append($(parentDiv));

  $(".recentsContainer").append($(link));
}

const getGroupAnnouncements = async () => {
  const group_id = window.location.href.endsWith("/")
    ? window.location.href.split("/").slice(-2)[0]
    : window.location.href.split("/").slice(-1)[0];
  const response = await fetch(`/group/${group_id}`);
  const jsonRes = await response.json();
  return jsonRes;
};

$(document).ready(() => {
  const group_id = window.location.href.split("/").slice(-1)[0];
  $("#new-ann-btn").attr({ href: `/faculty/groups/${group_id}/new` });
  getGroupAnnouncements()
    .then((res) => {
      console.log(res);
      $(".group_name").text(res.group_name);
      for (const ann of res.announcements) {
        createAnnCard(ann);
      }
    })
    .catch((err) => {
      console.log(err);
      alert("Something went wrong while getting announcements");
    });
});
