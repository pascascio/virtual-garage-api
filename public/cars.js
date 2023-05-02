

async function buildCarsTable(carsTable, carsTableHeader, token, role, message) {
  console.log("in build table")
  try {
    const response = "";
    if (role === "admin"){
      console.log("inside admin role")
       response = await fetch("/api/v1/admin", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } else {
      console.log("inside client role")
     response = await fetch("/api/v1/cars", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  }
    const data = await response.json();
    console.log("data", data)
    var children = [carsTableHeader];
    if (response.status === 200) {
      if (data.count === 0) {
        carsTable.replaceChildren(...children); // clear this for safety
        return 0;
      } else {
        for (let i = 0; i < data.cars.length; i++) {
          let editButton = `<td><button type="button" class="editButton" data-id=${data.cars[i]._id}>edit</button></td>`;
          let deleteButton = `<td><button type="button" class="deleteButton" data-id=${data.cars[i]._id}>delete</button></td>`;
          let rowHTML = `${data.cars[i].year}</td><td>${data.cars[i].make}</td><td>${data.cars[i].model}</td><td>${data.cars[i].repairConcerns}<td>${data.cars[i].status}</td>${editButton}${deleteButton}`;
          let rowEntry = document.createElement("tr");
          rowEntry.innerHTML = rowHTML;
          children.push(rowEntry);
        }
        carsTable.replaceChildren(...children);
      }
      return data.count;
    } else {
      message.textContent = data.msg;
      return 0;
    }
  } catch (err) {
    console.log(err)
    message.textContent = "A communication error occurred.";
    return 0;
  }
}



document.addEventListener("DOMContentLoaded", () => {
  const logoff = document.getElementById("logoff");
  const message = document.getElementById("message");
  const logon = document.getElementById("logon");
  const register = document.getElementById("register");
  const logonDiv = document.getElementById("logon-div");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const logonButton = document.getElementById("logon-button");
  const logonCancel = document.getElementById("logon-cancel");
  const registerDiv = document.getElementById("register-div");
  const name = document.getElementById("name");
  const email1 = document.getElementById("email1");
  const password1 = document.getElementById("password1");
  const password2 = document.getElementById("password2");
  const registerButton = document.getElementById("register-button");
  const registerCancel = document.getElementById("register-cancel");
  const cars = document.getElementById("cars");
  const carsTable = document.getElementById("cars-table");
  const carsTableHeader = document.getElementById("cars-table-header");
  const addCar = document.getElementById("add-car");
  const editCar= document.getElementById("edit-car");
  const year = document.getElementById("year");
  const make = document.getElementById("make");
  const model = document.getElementById("model")
  const status = document.getElementById("status");
  const addingCar = document.getElementById("adding-car");
  const repairConcerns = document.getElementById("repair-concerns");
  const carsMessage = document.getElementById("cars-message");
  const editCancel = document.getElementById("edit-cancel");
  const adminCars = document.getElementById("admin-cars");
  const techComments = document.getElementById("tech-comments");
  const adminCarsMessage = document.getElementById("admin-cars-message");
  const adminTable = document.getElementById("admin-cars-table");
  const adminCarsTableHeader= document.getElementById("admin-cars-table-header");
  const adminAddingCar = document.getElementById("admin-adding-car");


 
  // section 2 

  let showing = registerDiv;
  let token = null;
  let role = null;
  document.addEventListener("startDisplay", async () => {
    showing = registerDiv;
    token = localStorage.getItem("token");
    role = localStorage.getItem("role");
    if (token && role) {
      //if the user is logged in
      logoff.style.display = "block";
      console.log("before count")
      const count = await buildCarsTable(
        carsTable,
        carsTableHeader,
        token,
        role,
        message
      );
      if (count > 0) {
        carsMessage.textContent = "";
        carsTable.style.display = "block";
      } else {
        carsMessage.textContent = "There are no cars to display for this user.";
        carsTable.style.display = "none";
      }
      cars.style.display = "block";
      showing = cars;
    } else {
      registerDiv.style.display = "block";
    }
  });

  var thisEvent = new Event("startDisplay");
  document.dispatchEvent(thisEvent);
  var suspendInput = false;

  // section 3

  document.addEventListener("click", async (e) => {
    if (suspendInput) {
      return; // we don't want to act on buttons while doing async operations
    }
    if (e.target.nodeName === "BUTTON") {
      message.textContent = "";
    }
    if (e.target === logoff) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      token = null;
      role = null;
      showing.style.display = "none";
      registerDiv.style.display = "block";
      showing = registerDiv;
      carsTable.replaceChildren(carsTableHeader); // don't want other users to see
      message.textContent = "You are logged off.";
      logoff.style.display = "none"
    } else if (e.target === logon) {
      showing.style.display = "none";
      logonDiv.style.display = "block";
      showing = logonDiv;
    } 
    else if (e.target === register) {
      showing.style.display = "none";
      registerDiv.style.display = "block";
      showing = registerDiv;
    } else if (e.target === logonCancel || e.target == registerCancel) {
      showing.style.display = "none";
      registerDiv.style.display = "block";
      showing = registerDiv;
      email.value = "";
      password.value = "";
      name.value = "";
      email1.value = "";
      password1.value = "";
      password2.value = "";
    } else if (e.target === logonButton) {
      suspendInput = true;
      try {
        const response = await fetch("/api/v1/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.value,
            password: password.value,
          }),
        });
        const data = await response.json();
        console.log("logindata", data)
        if (response.status === 200) {
          message.textContent = `Logon successful.  Welcome ${data.user.name}`;
          token = data.token;
          role = data.user.role;
          localStorage.setItem("token", token);
          localStorage.setItem("role", role);
          showing.style.display = "none";
          thisEvent = new Event("startDisplay");
          email.value = "";
          password.value = "";
          document.dispatchEvent(thisEvent);
        } else {
          message.textContent = data.msg;
        }
      } catch (err) {
        console.log("loginerror", err)
        message.textContent = "A communications error occurred.";
      }
      suspendInput = false;
    } else if (e.target === registerButton) {
      if (password1.value != password2.value) {
        message.textContent = "The passwords entered do not match.";
      } else {
        suspendInput = true;
        try {
          const response = await fetch("/api/v1/auth/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: name.value,
              email: email1.value,
              password: password1.value,
            }),
          });
          const data = await response.json();
          if (response.status === 201) {
            message.textContent = `Registration successful.  Welcome ${data.user.name}`;
            token = data.token;
            localStorage.setItem("token", token);
            showing.style.display = "none";
            thisEvent = new Event("startDisplay");
            document.dispatchEvent(thisEvent);
            name.value = "";
            email1.value = "";
            password1.value = "";
            password2.value = "";
          } else {
            message.textContent = data.msg;
          }
        } catch (err) {
          message.textContent = "A communications error occurred.";
        }
        suspendInput = false;
      }
    } // section 4
    else if (e.target === addCar) {
      showing.style.display = "none";
      editCar.style.display = "block";
      showing = editCar;
      delete editCar.dataset.id;
      year.value = "";
      make.value = "";
      model.value = "";
      repairConcerns.value = "";
      status.value = "pending";
      addingCar.textContent = "add";
    } else if (e.target === editCancel) {
      showing.style.display = "none";
      year.value = "";
      make.value = "";
      model.value = "";
      repairConcerns.value = "";
      status.value = "pending";
      thisEvent = new Event("startDisplay");
      document.dispatchEvent(thisEvent);
    } else if (e.target === addingCar) {

      if (!editCar.dataset.id) {
        // this is an attempted add
        suspendInput = true;
        try {
          const response = await fetch("/api/v1/cars", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              year: year.value, 
              make: make.value, 
              model: model.value, 
              repairConcerns: repairConcerns.value, 
              status: status.value,
            }),
          });
          const data = await response.json();
          if (response.status === 201) {
            //successful create
            message.textContent = "The car entry was created.";
            showing.style.display = "none";
            thisEvent = new Event("startDisplay");
            document.dispatchEvent(thisEvent);
            year.value = "";
            make.value = "";
            model.value = "";
            repairConcerns.value = "";
            status.value = "pending";
          } else {
            // failure
            message.textContent = data.msg;
          }
        } catch (err) {
          message.textContent = "A communication error occurred.";
        }
        suspendInput = false;
      } else {
        // this is an update
        suspendInput = true;
        try {
          const carID = editCar.dataset.id;
          const response = await fetch(`/api/v1/cars/${carID}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
             year: year.value, 
             make: make.value, 
             model: model.value, 
             repairConcerns: repairConcerns.value,
              status: status.value,
            }),
          });
          const data = await response.json();
          if (response.status === 200) {
            message.textContent = "The entry was updated.";
            showing.style.display = "none";
            year.value = "";
            make.value = "";
            model.value = "";
            repairConcerns.value = "";
            status.value = "pending";
            thisEvent = new Event("startDisplay");
            document.dispatchEvent(thisEvent);
          } else {
            message.textContent = data.msg;
          }
        } catch (err) {

          message.textContent = "A communication error occurred.";
        }
      }
      suspendInput = false;
    } // section 5
    else if (e.target.classList.contains("editButton")) {
      editCar.dataset.id = e.target.dataset.id;
      suspendInput = true;
      try {
        const response = await fetch(`/api/v1/cars/${e.target.dataset.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.status === 200) {
          year.value = data.car.year;
          make.value = data.car.make;
          model.value = data.car.model;
          repairConcerns.value = data.car.repairConcerns;
          status.value = data.car.status;
          showing.style.display = "none";
          showing = editCar;
          showing.style.display = "block";
          addingCar.textContent = "update";
          message.textContent = "";
        } else {
          // might happen if the list has been updated since last display
          message.textContent = "The cars entry was not found";
          thisEvent = new Event("startDisplay");
          document.dispatchEvent(thisEvent);
        }
      } catch (err) {
        message.textContent = "A communications error has occurred.";
      }
      suspendInput = false;
    }

    //fixing delete button
    else if (e.target.classList.contains("deleteButton")) {
      editCar.dataset.id = e.target.dataset.id;
      suspendInput = true;
      try {
        const response = await fetch(`/api/v1/cars/${e.target.dataset.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.status === 200) {
          message.textContent = "car deleted";
          thisEvent = new Event("startDisplay");
          document.dispatchEvent(thisEvent);
        } else {
          // might happen if the list has been updated since last display
          message.textContent = "The cars entry was not found"
        }
      } catch (err) {
        console.log(err)
        message.textContent = "A communications error has occurred.";
      }
      suspendInput = false;
    }

//fixing delete button






  })
}); // fin