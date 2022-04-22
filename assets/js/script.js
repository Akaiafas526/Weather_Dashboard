const input = document.getElementById("search-input");
const today = document.getElementById("today");
const forecast = document.getElementById("forecast");
const submitButton = document.getElementById("submit");
const cityList = document.getElementById("city-list");
const apiKey = "8337e4d02a115b79233196cba37dc240";

let cityArray;
let storageCheck = JSON.parse(localStorage.getItem("cityStorage"));

if (storageCheck) cityArray = storageCheck;
else cityArray = [];

for (let i = 0; i < cityArray.length; i++) {
  let listItem = document.createElement("li");
  listItem.textContent = cityArray[i];
  listItem.style.cursor = "pointer";
  cityList.append(listItem);
  listItem.addEventListener("click", (event) => {
    event.preventDefault();
    today.innerHTML = "";
    forecast.innerHTML = "";
    getCoordinates(listItem.textContent);
  });
}

submitButton.addEventListener("click", (event) => {
  event.preventDefault();
  let searchCity = input.value;
  today.innerHTML = "";
  forecast.innerHTML = "";
  let listItem = document.createElement("li");
  listItem.textContent = searchCity;
  listItem.addEventListener("click", (event) => {
    event.preventDefault();
    getCoordinates(listItem.textContent);
  });
  listItem.style.cursor = "pointer";
  cityList.append(listItem);
  getCoordinates(searchCity);
  cityArray.push(searchCity);
  localStorage.setItem("cityStorage", JSON.stringify(cityArray));
});

function getCoordinates(cityName) {
  const geoCoordinates = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;
  fetch(geoCoordinates)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let lat = data[0].lat;
      let lon = data[0].lon;

      getWeather(lat, lon);
    });
}

function getWeather(lat, lon) {
  const oneCallApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&units=imperial&appid=${apiKey}`;
  fetch(oneCallApi)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      parseData(data);
    });
}

function parseData(data) {
  const todayWeather = data.current;
  const forecastWeather = data.daily;
  console.log(todayWeather);
  console.log(forecastWeather);
  //   today weather data
  const currentTemp = todayWeather.temp;
  const currentHumid = todayWeather.humidity;
  const uvi = todayWeather.uvi;
  const currentWind = todayWeather.wind_speed;
  const currentDay = todayWeather.dt;
  const currentWeekDay = moment.unix(currentDay).format("dddd");
  const currentDate = moment.unix(currentDay).format("MM/DD/YYYY");
  const currentIcon = todayWeather.weather[0].icon;

  const currentHtml = `
<div class="card" style="width: 18rem;">
    <div class="card-header">
    ${currentWeekDay}
    <br>
    ${currentDate}
    <img src='http://openweathermap.org/img/wn/${currentIcon}@2x.png'>
    </div>
  <ul class="list-group list-group-flush">
    <li class="list-group-item">Temperature: ${currentTemp} \xB0F</li>
    <li class="list-group-item">Humidity: ${currentHumid} %</li>
    <li class="list-group-item">UV Index: ${uvi}</li>
    <li class="list-group-item">Wind Speed: ${currentWind} mph</li>
  </ul>
</div>`;

  today.innerHTML = currentHtml;

  forecastFn(forecastWeather);
}
function forecastFn(data) {
  for (let i = 1; i <= 5; i++) {
    // forecast weather data
    console.log(data[i]);
    let weeklyTemp = data[i].temp.max;
    console.log(weeklyTemp);
    let weeklyHumid = data[i].humidity;
    let weeklyDay = data[i].dt;
    let weeklyWeekDay = moment.unix(weeklyDay).format("dddd");
    let weeklyDate = moment.unix(weeklyDay).format("MM/DD/YYYY");
    let weeklyWind = data[i].wind_speed;
    let weeklyIcon = data[i].weather[0].icon;

    let newEl = document.createElement("div");
    newEl.classList.add("card");
    newEl.style.width = "18rem";

    let weeklyHtml = `
    <div class="card-header">
    ${weeklyWeekDay}
    <br>
    ${weeklyDate}
    <img src='http://openweathermap.org/img/wn/${weeklyIcon}@2x.png'>
    </div>
  <ul class="list-group list-group-flush">
    <li class="list-group-item">Temperature: ${weeklyTemp} \xB0F</li>
    <li class="list-group-item">Humidity: ${weeklyHumid} %</li>
    <li class="list-group-item">Wind Speed: ${weeklyWind} mph</li>
  </ul>`;

    newEl.innerHTML = weeklyHtml;
    forecast.append(newEl);
  }
}
