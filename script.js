const cityInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".searchButton");
const locationBtn = document.querySelector(".locationButton");
const currentWeatherDiv = document.querySelector(".currentWeather");
const weatherCardsDiv = document.querySelector(".weatherCards");
const API_KEY = "337fafe15448a20effb1702ff010d84a"; 

const createWeatherCard = (cityName, weatherItem, index) => {
    if (index === 0) { 
        return `<div class="details">
                    <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                    <h6>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
                    <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                    <h6>Humidity: ${weatherItem.main.humidity}%</h6>
                </div>
                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                    <h6>${weatherItem.weather[0].description}</h6>
                </div>`;
    } else {
        return `<li class="card">
                    <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                    <h6>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
                    <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                    <h6>Humidity: ${weatherItem.main.humidity}%</h6>
                </li>`;
            
    }
}

const setWeatherBackground = (weatherItem) => {

    if (weatherItem.textContent === 'Clear') {
        console.log("1");
        document.body.style.backgroundImage = "url('./clear_sky.jpg')";
    } else if (weatherItem.textContent === 'Clouds' || weatherItem.textContent === 'Haze' || weatherItem.textContent === 'Scattered Clouds'
    ) {
        document.body.style.backgroundImage = "url('./cloudy.jpg')";
        console.log("2");
    } else if (weatherItem.textContent === 'Rain') {
        document.body.style.backgroundImage = "url('./light_rain.jpg')";
        console.log("3");
    } else if (weatherItem.textContent === 'Snow') {
        document.body.style.backgroundImage = "url('./snowy.jpeg')";
        console.log("4");
    } else if (weatherItem.textContent === 'Thunderstorm') {
        document.body.style.backgroundImage = "url('./thunderstorm.jpg')";
        console.log("5");
    }
     else if (weatherItem.textContent === 'Overcast Clouds') {
    document.body.style.backgroundImage = "url('./Overcast_Clouds.jpg')";
    console.log("6");
     }
     else if (weatherItem.textContent === 'Light Rain') {
        document.body.style.backgroundImage = "url('./light_rain.jpg')";
        console.log("7");
    }
     else if (weatherItem.textContent === 'Heavy Rain') {
            document.body.style.backgroundImage = "url('./Heavy.jpg')";
            console.log("8");
    }
    }


const getWeatherDetails = (cityName, latitude, longitude) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL)
        .then(response => response.json())
        .then(data => {
            const uniqueForecastDays = [];
            const fiveDaysForecast = data.list.filter(forecast => {
                const forecastDate = new Date(forecast.dt_txt).getDate();
                if (!uniqueForecastDays.includes(forecastDate)) {
                    return uniqueForecastDays.push(forecastDate);
                }
            });

            cityInput.value = "";
            currentWeatherDiv.innerHTML = "";
            weatherCardsDiv.innerHTML = "";

            fiveDaysForecast.forEach((weatherItem, index) => {
                const html = createWeatherCard(cityName, weatherItem, index);
                if (index === 0) {
                    currentWeatherDiv.insertAdjacentHTML("beforeend", html);
                    setWeatherBackground(weatherItem.weather[0]);
                } else {
                    weatherCardsDiv.insertAdjacentHTML("beforeend", html);
                }
            });
        })
        .catch(() => {
            alert("An error occurred while fetching the weather forecast!");
        });
}

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if (cityName === "") return;
    const API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            if (!data.length) return alert(`No coordinates found for ${cityName}`);
            const { lat, lon, name } = data[0];
            getWeatherDetails(name, lat, lon);
        })
        .catch(() => {
            alert("An error occurred while fetching the coordinates!");
        });
}

const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords;
            const API_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
            fetch(API_URL)
                .then(response => response.json())
                .then(data => {
                    const { name } = data[0];
                    getWeatherDetails(name, latitude, longitude);
                })
                .catch(() => {
                    alert("An error occurred while fetching the city name!");
                });
        },
        error => { 
            if (error.code === error.PERMISSION_DENIED) {
                alert("Geolocation request denied. Please reset location permission to grant access again.");
            } else {
                alert("Geolocation request error. Please reset location permission.");
            }
        });
}

locationBtn.addEventListener("click", getUserCoordinates);
searchBtn.addEventListener("click", getCityCoordinates);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());
