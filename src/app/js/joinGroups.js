const joinGroup = async (code) => {
  const response = await fetch(`/group/${code}/add`, {
    method: "POST",
    headers: { "Conent-Type": "application/json" },
  });
  const jsonRes = await response.json();
  return jsonRes;
};

$(document).ready(() => {
  $("#join_btn").on("click", (e) => {
    e.preventDefault();
    const group_code = $("#group_code").val();
    joinGroup(group_code)
      .then((res) => {
        alert(res.message);
        window.location.href = res.redirect_url;
      })
      .catch((err) => {
        console.log(err);
      });
  });
});
