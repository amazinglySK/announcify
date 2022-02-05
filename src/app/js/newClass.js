const createClass = async (data) => {
  const res = await fetch("/api/class", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const jsonRes = await res.json();

  console.log("Sending the request");

  if (!res.ok) {
    console.error("Something went wrong while calling the API");
    return;
  }

  console.log("Class Added");

  return jsonRes;
};

$(document).ready((e) => {
  console.log("Hello");
  $("#add_btn").on("click", (e) => {
    e.preventDefault();
    const grade = $("#grade").val();
    const section = $("#section").val();
    const data = {
      grade: grade,
      section: section,
      class_name: `${grade}-${section}`,
    };

    createClass(data).then((res) => {
      if (res.redirect_url) {
        alert("Successfully created the class");
        window.location.href = res.redirect_url;
        return;
      }
      alert("Oops.. something went wrong");
    });
  });
});
