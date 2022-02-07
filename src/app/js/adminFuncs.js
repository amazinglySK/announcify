const createGroup = async (name) => {
  try {
    const data = { name };
    const response = await fetch("/group/new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const jsonRes = await response.json();
    console.log(response);
    console.log(jsonRes);
    return jsonRes;
  } catch (err) {
    throw err;
  }
};

const joinGroup = async (code) => {
  const response = await fetch(`/group/${code}/add`, {
    method: "POST",
    headers: { "Conent-Type": "application/json" },
  });
  const jsonRes = await response.json();
  return jsonRes;
};

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

const loadClass = async () => {
  const response = await fetch("/api/class");
  const jsonRes = await response.json();
  return jsonRes;
};

$(document).ready((e) => {
  let studentsToRegister = [];
  loadClass().then((res) => {
    console.log("Sent request");
    console.log(res);
    let className = res.class;
    if (className !== undefined) {
      $("#createClass").fadeOut("slow");
      $("#className").text(className);
    }
  });
  $("#create_btn").on("click", (e) => {
    e.preventDefault();
    const group_name = $("#group_name").val();
    createGroup(group_name)
      .then((res) => {
        console.log(res);
        alert(res.message);
        window.location.href = res.redirect_url;
      })
      .catch((err) => {
        console.log(err);
        alert("Oops an error occured");
      });
  });
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
  $("#sendMail").on("click", (e) => {
    e.preventDefault();
    $("#student-container").empty();
    registerStudents(studentsToRegister).then((res) => {
      if (res[0] == "OK") {
        alert("Students added successfully");
      }

      for (const student in res[1]) {
        let pendingStudentCard = createStudentCard(student);
        $("#student-container").append($(pendingStudentCard));
      }
    });
    studentsToRegister = [];
  });
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
