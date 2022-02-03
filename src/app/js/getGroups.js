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
        let class_card = document.createElement("div");
        let class_title = document.createElement("h3");
        let class_img = document.createElement("img");
        $(class_title).attr({ class: "groupName" }).text(group.name);
        $(class_img).attr({ class: "group_img" });
        $(class_card).attr({ class: "group-card" }).append($(class_title));
        $(".groupsContainer").append($(class_card));
      }
    })
    .catch((err) => {
      console.log(err);
      alert("Something went wrong in fetching the groups");
    });
});
