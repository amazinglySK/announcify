const createGroup = async (name) => {
  try {
    const data = { name };
    const response = await fetch("/group/new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const jsonRes = await response.json();
    return jsonRes;
  } catch (err) {
    throw err;
  }
};

$(document).ready(() => {
  $("#create_btn").on("click", (e) => {
    e.preventDefault();
    const group_name = $("#group_name").val();
    createGroup(group_name)
      .then((res) => {
        console.log(res);
        alert(res.message);
      })
      .catch((err) => {
        console.log(err);
        alert("Oops an error occured");
      });
  });
});
