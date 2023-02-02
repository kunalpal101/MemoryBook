var back_uri = "http://127.0.0.1:4000";

function date_now() {
  if (document.querySelector("#date").value == "") {
    document.querySelector("#date").valueAsDate = new Date();
  } else {
    document.querySelector("#date").value = "";
  }
}

let username, password;

const start_prg = function () {
  const queryString = window.location.search;

  const urlParams = new URLSearchParams(queryString);
  username = urlParams.get("username");
  console.log(username);

  password = urlParams.get("password");
  console.log(password);

  var elements = document.getElementById("nav-title");
  elements.innerHTML =
    "<i class='bi bi-person-circle'></i>   Welcome, " + username;
};

start_prg();

function submit_mem() {
  //console.log(queryString);
  const mem_date = document.getElementById("date").value,
    mem_time = document.getElementById("time").value,
    mem_privacy =
      document.getElementById("private_1").checked == true
        ? "private"
        : "public",
    mem_head = document.getElementById("mem-header").value,
    mem_desc = document.getElementById("mem-desc").value;

  console.log(
    mem_time +
      " \n " +
      mem_date +
      " \n " +
      mem_privacy +
      " \n " +
      mem_head +
      " \n " +
      mem_desc
  );

  const fetchData = async () => {
    try {
      let response = await fetch(back_uri + "/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          time: mem_time,
          date: mem_date,
          privacy: mem_privacy,
          heading: mem_head,
          body: mem_desc,
        }),
      });

      if (response.status == 200) {
        window.alert("Submitted succesfully!!");
        // window.alert("Press okay to go back to the home page.");
        // setTimeout(function () {
        //   window.location.replace(back_uri);
        // }, 2000);
      } else {
        throw "Some Error";
      }
    } catch (error) {
      window.alert("Error! Check console");
      console.log(error);
    }
  };
  fetchData();
}

function boom() {
  console.log("Done?");
}

async function generate() {
  //document.getElementById("own-mem-wrapper").classList.add("blur-effect");
  //document.getElementById("loader-block").setAttribute("visibility: visible");

  let response = await fetch(back_uri + "/fetchmem", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
    }),
  });

  if (response.status == 200) {
    let data = await response.json();
    //console.log(data[0].memories);

    var size = data.length;

    //for custom images
    var unsplash = 500;
    document.getElementById("cols").innerHTML = "";

    var getMem = async function () {
      for (i = 0; i < size; i++, unsplash++) {
        var body = document.createElement("div");
        body.className = "card-col";
        body.ontouchstart = "this.classList.toggle('hover');";
        body.innerHTML =
          "<div class='card-container'> <div class='front' onload='boom();' style='background-image: url(https://unsplash.it/" +
          unsplash +
          "/" +
          unsplash +
          "/);'>" +
          " <div class='inner'> <p>" +
          data[i].memories.heading +
          "</p> <span>" +
          data[i].memories.date +
          "</span> </div> </div>" +
          "<div class='back'> <div class='inner'> <p>" +
          data[i].memories.description +
          " </p></div> </div></div>";

        document.getElementById("cols").appendChild(body);
      }
    };

    getMem();
  } else console.log("Error");

  function blur_thingy() {
    document.getElementById("own-mem-wrapper").classList.remove("blur-effect");
    document.getElementById("loader-block").style.visibility = "hidden";
  }

  setTimeout(blur_thingy, 4500);
}

//alert thingy
const alertPlaceholder = document.getElementById("liveAlertPlaceholder");

const alert = (message, type) => {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible fade show" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    "</div>",
  ].join("");

  alertPlaceholder.append(wrapper);
};

// const alertTrigger = document.getElementById("liveAlertBtn");
// if (alertTrigger) {
//   alertTrigger.addEventListener("click", () => {
//     alert("Nope, not working yet", "danger");
//   });
// }

//fetching friends memory
async function fetchfrndmem() {
  let frndName = document.getElementById("frndName").value;

  if (frndName == username) {
    alert("That's your own name, dummy. Try again.", "danger");
  } else {
    let response = await fetch(back_uri + "/fetchmem", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: frndName,
      }),
    });

    if (response.status == 200) {
      var data = await response.json();
      // if (data[1].memories.privacy == "private") console.log("private");
      // else console.log("not private");
      //document.getElementById("mem-list-model").model("show").addClass("modal-front");

      var size = data.length;

      //for custom images
      var unsplash = 500;
      document.getElementById("friend-cols").innerHTML = "";

      var getMem = async function () {
        for (i = 0; i < size; i++, unsplash++) {
          var body = document.createElement("div");
          body.className = "card-col";
          body.ontouchstart = "this.classList.toggle('hover');";
          body.innerHTML =
            "<div class='card-container'> <div class='front' onload='boom();' style='background-image: url(https://unsplash.it/" +
            unsplash +
            "/" +
            unsplash +
            "/);'>" +
            " <div class='inner'> <p>" +
            data[i].memories.heading +
            "</p> <span>" +
            data[i].memories.date +
            "</span> </div> </div>" +
            "<div class='back'> <div class='inner'> <p>" +
            data[i].memories.description +
            " </p></div> </div></div>";

          document.getElementById("friend-cols").appendChild(body);
        }
      };

      getMem();
      function blur_thingy() {
        document
          .getElementById("friend-mem-wrapper")
          .classList.remove("blur-effect");
        document.getElementById("loader-block-2").style.visibility = "hidden";
      }

      setTimeout(blur_thingy, 4500);
      $("#mem-friend-list-model").modal("show").addClass("modal-front");
    } else if (response.status == 404) {
      console.log("Friend not found");
      alert(
        "Alas!! Friend not found. <i class='bi bi-emoji-frown-fill'></i> ",
        "danger"
      );
    }
  }
}

//window.onload(generate());
