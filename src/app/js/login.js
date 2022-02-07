const loginUser = async (data) => {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const jsonRes = await response.json();
  console.log("Sending the request");
  if (!response.ok) {
    console.error("Something went wrong");
    alert("You are not authorized");
    return;
  }
  return jsonRes;
};

$(document).ready(() => {
  console.log("Hello");
  $("#submit_btn").on("click", (e) => {
    e.preventDefault();
    const data = {
      username: $("#user_name").val(),
      password: $("#password").val(),
    };
    loginUser(data).then((res) => {
      console.log(res);
      if (res.redirect_url) {
        alert("You are logged in");
        window.location.href = res.redirect_url;
        return;
      }
      alert(res.message || "Something went wrong");
    });
  });
});
