var ddlCountry = document.getElementById("ddl-country");
var ddlState = document.getElementById("ddl-state");
var stateWrapper = document.getElementById("stateWrapper");
var cityWrapper = document.getElementById("cityWrapper");
var streetWrapper = document.getElementById("streetWrapper");
var submitBtnWrapper = document.getElementById("submitBtnWrapper");
var submitBtn = document.getElementById("submitBtn");
var mapBtnWrapper = document.getElementById("mapBtnWrapper");
var mapWrapper = document.getElementById("mapWrapper");
var cityInput = document.getElementById("city-input");
var streetInput = document.getElementById("street-input");
var latWrapper = document.getElementById("latWrapper");
var lngWrapper = document.getElementById("lngWrapper");
var latCoords = document.getElementById("latCoords");
var lngCoords = document.getElementById("lngCoords");
var formAlert = document.getElementById("form-alert");
var alertMsg = document.getElementById("alertMsg");
var key = "AIzaSyDDYT08cfLogSuNS_h9weS2oskDoq48Du0";

var lat;
var lng;

$(document).ready(function () {
  $("#ddl-country").select2();
  $("#ddl-state").select2();

  var countries = {
    url: "https://location.wlfpt.co/api/v1/countries",
    method: "GET",
    contentType: "application/json",
  };

  $.ajax(countries).done(function (response) {
    response.forEach(function (item) {
      var option = document.createElement("option");
      option.text = item.name;
      option.value = item.name;

      ddlCountry.append(option);
    });
  });
});

function getStates() {
  var selectedCountry = ddlCountry.value;
  var myHeaders = new Headers();

  myHeaders.append("Content-Type", "application/json");
  myHeaders.append(
    "Cookie",
    "__cfduid=daf7e402e01fdaec224e4cb158753e1c21618522350"
  );

  var states = $.post("https://countriesnow.space/api/v0.1/countries/states", {
    country: selectedCountry,
  });

  states.done(function (data) {
    $("#ddl-state").empty();
    stateWrapper.classList.remove("hidden");
    let countryStates = data.data.states;

    countryStates.forEach(function (item) {
      var option = document.createElement("option");

      //   if (item.name === "Puerto Rico") {
      //     option.setAttribute("id", "puertoRico");
      //     // option.text = item.name;
      //     // option.value = item.state_code;
      //   } else {
      //     option.text = item.name;
      //     option.value = item.state_code;
      //   }

      option.text = item.name;
      option.value = item.state_code;

      ddlState.append(option);
    });
  });
}

$("#ddl-country").on("change", function () {
  stateWrapper.classList.add("hidden");
  cityWrapper.classList.add("hidden");
  streetWrapper.classList.add("hidden");
  latWrapper.classList.add("hidden");
  lngWrapper.classList.add("hidden");
  mapBtnWrapper.classList.add("hidden");
  mapWrapper.classList.add("hidden");

  getStates();
});

$("#ddl-state").on("change", function () {
  cityWrapper.classList.remove("hidden");
  streetWrapper.classList.remove("hidden");
  submitBtnWrapper.classList.remove("hidden");
});

$("#submitBtn").on("click", function () {
  if (streetInput.value.length > 0 && cityInput.value.length > 0) {
    streetInputVal = streetInput.value.replace(/\s/g, "+");
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=
    ${streetInputVal},+
    ${cityInput.value},+
    ${ddlState.value}&key=${key}`
    )
      .then(function (response) {
        if (response.status !== 200) {
          alert(
            "Looks like there was a problem. Status Code: " + response.status
          );
          return;
        }
        response.json().then(function (data) {
          let locationData = data.results[0].geometry.location;
          lat = locationData.lat;
          lng = locationData.lng;

          latWrapper.classList.remove("hidden");
          lngWrapper.classList.remove("hidden");
          mapBtnWrapper.classList.remove("hidden");
          latCoords.value = lat;
          lngCoords.value = lng;
        });
      })
      .catch(function (err) {
        console.log("Fetch Error :-S", err);
      });
  } else {
    formAlert.classList.remove("hidden");
    $("#form-alert").animate({ left: "100px" }).fadeIn(2000);

    alertMsg.innerHTML = "Please fill out all address info!";
    setTimeout(function () {
      $("#form-alert").fadeOut(500);
    }, 3000);

    streetInput.value.length < 1
      ? (streetInput.style.border = "3px solid red")
      : (streetInput.style.border = "1px solid #ced4da");
    cityInput.value.length < 1
      ? (cityInput.style.border = "3px solid red")
      : (cityInput.style.border = "1px solid #ced4da");
  }

  $("#city-input").on("change", function () {
    console.log(cityInput.value.length);
    cityInput.value.length < 1
      ? (cityInput.style.border = "3px solid red")
      : (cityInput.style.border = "1px solid #ced4da");
  });
});
//1px solid #ced4da
$("#mapBtn").on("click", function () {
  const cityLocation = { lat: lat, lng: lng };
  mapWrapper.classList.remove("hidden");
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: cityLocation,
  });
  const marker = new google.maps.Marker({
    position: cityLocation,
    map: map,
  });
});
