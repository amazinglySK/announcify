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
  console.log(Ann.uid);
  $(link)
    .attr({
      href: `/ann/${Ann.uid}`,
    })
    .append($(parentDiv));

  $(".recentsContainer").append($(link));
}

async function getAnnouncements() {
  try {
    const response = await fetch("/ann/");
    const jsonRes = await response.json();
    return jsonRes.announcements;
  } catch (err) {
    console.log(err);
  }
}

$(document).ready((e) => {
  console.log("Hello world");
  getAnnouncements().then((res) => {
    for (i = 0; i <= res.length - 1; i++) {
      createAnnCard(res[i]);
    }
  });
});
