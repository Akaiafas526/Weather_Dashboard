const input = document.getElementById("search-input");
const today = document.getElementById("today");
const forecast = document.getElementById("forecast");
const submitButton = document.getElementById("submit");
const apiKey = "8337e4d02a115b79233196cba37dc240";
let city;

function getCoordinates(cityName) {
  const geoCoordinates = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;
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
getCoordinates("Austin");

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
  const currentWeekDay = moment.unix(currentDay).format('dddd')
  const currentDate = moment.unix(currentDay).format('MM/DD/YYYY')
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

    forecastFn(forecastWeather)

}
function forecastFn(data) {
    for(let i = 1; i <= 5; i++) {
        console.log(data[i])
        let weeklyTemp = data.temp['max'];
        console.log(weeklyTemp)
        let weeklyHumid = data.humidity;
        let weeklyDay = data.dt;
        let weeklyWind = data.wind_speed;
        let weeklyIcon = data.weather;
    }
}
