function createStudentCard(data) {
  let newCard = document.createElement("div");
  $(newCard).attr({
    class: "student_card",
    id: "student_id",
  });
  let name = document.createElement("h4");
  let s_no = document.createElement("p");
  $(name)
    .attr({
      class: "name",
    })
    .text(data.official_name);
  $(s_no)
    .attr({
      class: "s_no",
    })
    .text(data.school_id);
  $(newCard).append(
    $(name),
    $(s_no),
    $("<i class='fa-solid fa-circle-minus'></i>")
  );
  return newCard;
}

async function registerStudents(data) {
  console.log(data);

  console.log("Sending request");

  const payload = {
    students: data,
  };

  const res = await fetch("/api/students", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    console.log("Something went wrong");
    return;
  }
  let jsonRes = await res.json();
  return ["OK", jsonRes.failed];
}

async function loadClass() {
  const response = await fetch("/api/class");
  const jsonRes = await response.json();
  console.log(jsonRes);
  return jsonRes;
}

$(document).ready((e) => {
  let studentsToRegister = [];
  loadClass().then((res) => {
    let className = res.class;
    $("#className").text(className);
  });
  // Create a div card with name, class and s.no.
  // Create a button with send mails option
  // Post the API request
  // Add a "-" button to remove the accidental entry
  $("#submit_btn").on("click", (e) => {
    e.preventDefault();
    let data = {
      official_name: $("#name").val(),
      username: $("#name").val().split(" ")[0],
      email: $("#email").val(),
      school_id: $("#s_no").val(),
    };
    studentsToRegister.push(data);
    let new_student_card = createStudentCard(data);
    $("#student-container").append($(new_student_card));
    console.log("Done appending");
  });
  $("#sendMail").on("click", (e) => {
    e.preventDefault();
    $("#student-container").empty();
    registerStudents(studentsToRegister).then((res) => {
      if (res[0] == "OK") {
        console.log("Students added");
      }

      for (const student in res[1]) {
        let pendingStudentCard = createStudentCard(student);
        $("#student-container").append($(pendingStudentCard));
      }
    });
    studentsToRegister = [];
  });
});
