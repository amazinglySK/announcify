const loginUser = async (data) => {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  console.log("Sending the request");
  if (!response.ok) {
    console.error("The route did not respond");
    return;
  }
  console.log("Success.. User signed up");
  return "OK";
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
      if (res == "OK") {
        alert("You are logged in");
      }
    });
  });
});
