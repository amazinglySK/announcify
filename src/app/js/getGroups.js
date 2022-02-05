const getGroups = async () => {
  const response = await fetch("/group/");
  const jsonRes = await response.json();
  const groups = jsonRes.groups;
  return groups;
};

$(document).ready(() => {
  getGroups()
    .then((res) => {
      for (const group of res) {
        let group_link = document.createElement("a");
        let group_card = document.createElement("div");
        let group_title = document.createElement("h3");
        let group_img = document.createElement("img");
        $(group_link).attr({ href: `/faculty/groups/${group.group_id}` });
        $(group_title).attr({ class: "groupName" }).text(group.name);
        $(group_img).attr({
          class: "group_img",
          src: "http://localhost:3000/public/group_img.png",
        });
        $(group_card)
          .attr({ class: "group-card" })
          .append($(group_img), $(group_title));
        $(group_link).append($(group_card));
        $(".groupsContainer").append($(group_link));
      }
    })
    .catch((err) => {
      console.log(err);
      alert("Something went wrong in fetching the groups");
    });
});
