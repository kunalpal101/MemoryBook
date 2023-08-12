//const e = require("express");

swipeAnimation();

//Backend API
//var back_uri = "http://127.0.0.1:4000";
<<<<<<< HEAD
var back_uri = "https://smoggy-boa-sun-hat.cyclic.app";
=======

const back_uri = window.location.href.replace(/\/$/, "");
>>>>>>> dev

const login_btn = document.getElementById("log-in");

login_btn.onclick = function () {
  show();
};

/*function for login*/
function show() {
  const user_id = document.getElementById("log-username").value,
    user_pwd = document.getElementById("log-password").value;
  //console.log(`Username is ${user_id} and Password is ${user_pwd}`);

  fetch(back_uri + "/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: user_id,
      password: user_pwd,
    }),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      if (data.Auth == "Success") auth_success(data);
      else if (data.Auth == "Decline") auth_failed();
      else if (data.Auth == "Decline password") auth_failed_password();
    });
}

function auth_success(data) {
  window.alert("Login succesfull!");
  console.log(data);
  window.location.href =
    "../HomePage/index.html?username=" +
    data.username +
    "&password=" +
    data.password;
  //window.location.href = "www.google.com";
}

function auth_failed(data) {
  //console.log(data);
  window.alert("Login failed!! Username not found.");
}

function auth_failed_password() {
  window.alert("Login failed!! Wrong Password");
}

/*function for signup*/
function signup() {
  console.log("Yo");
  const sign_id = document.getElementById("sign-user").value,
    sign_pwd = document.getElementById("sign-pass").value,
    sign_cnf_pwd = document.getElementById("sign-cnf-pass").value;
  console.log(
    `Username is ${sign_id} and Password is ${sign_pwd} and ${sign_cnf_pwd}`
  );
  if (sign_pwd != sign_cnf_pwd) {
    window.alert("Password missmatch!");
    return;
  }

  // fetch(back_uri + "/signup", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     username: sign_id,
  //     password: sign_pwd,
  //   }),
  // })
  //   .then((res) => {
  //     return res.json();
  //   })
  //   .then((data) => {
  //     if (data == null) {
  //       window.alert("Error");
  //       return;
  //     }
  //     console.log(data);
  //   });

  const fetchData = async () => {
    try {
      let response = await fetch(back_uri + "/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: sign_id,
          password: sign_pwd,
        }),
      });
      // window.location.preventDefault();
      if (response.status == 200) {
        let data = await response.json();
        console.log(data);
        window.alert("It's done!");
        //window.location.reload();
      } else if (response.status == 400) {
        throw "Duplication Error";
      } else {
        throw "Error at fetching backend";
      }
    } catch (error) {
      window.alert("Error! Check console");
      console.log(error);
      //window.location.reload();
    }
  };
  fetchData();

  console.log("End");
}

/*function for swiping animation*/
function swipeAnimation() {
  const signupButton = document.getElementById("signup-button"),
    loginButton = document.getElementById("login-button"),
    userForms = document.getElementById("user_options-forms");

  /**
   * Add event listener to the "Sign Up" button
   */
  signupButton.addEventListener(
    "click",
    () => {
      userForms.classList.remove("bounceRight");
      userForms.classList.add("bounceLeft");
    },
    false
  );

  loginButton.addEventListener(
    "click",
    () => {
      userForms.classList.remove("bounceLeft");
      userForms.classList.add("bounceRight");
    },
    false
  );
}
