const createClass = async (data) => {
  const res = await fetch("/api/class", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  console.log("Sending the request");

  if (!res.ok) {
    console.error("Something went wrong while calling the API");
    return;
  }

  console.log("Class Added");

  return "OK";
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
      if (res === "OK") {
        alert("Successfully created the class");
        return;
      }
      alert("Oops.. something went wrong");
    });
  });
});
