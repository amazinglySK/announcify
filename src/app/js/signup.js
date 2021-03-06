const signupUser = async (data) => {
  const response = await fetch("/api/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const jsonRes = await response.json();
  console.log("Sending the request");
  if (!response.ok) {
    console.error("The route did not respond");
    return;
  }
  console.log("Success.. User signed up");
  return jsonRes;
};

$(document).ready(() => {
  console.log("Hello");
  $("#submit_btn").on("click", (e) => {
    e.preventDefault();
    const data = {
      official_name: $("#name").val(),
      username: $("#user_name").val(),
      password: $("#password").val(),
      email: $("#email").val(),
      school_id: $("#s_no").val(),
    };
    console.log(data);
    const confirm_password = $("#confirm_password").val();

    if (data.password !== confirm_password) {
      alert("The passwords do not match.. Kindly recheck them");
      return;
    }

    signupUser(data).then((res) => {
      console.log(res);
      if (res.redirect_url) {
        alert("You are logged in");
        window.location.href = res.redirect_url;
      }
    });
  });
});
