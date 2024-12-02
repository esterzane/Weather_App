const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");
const API_KEY = "22038a70491f6e8a843fa6f83a67e41a"; // API key for OpenWeatherMap API

const createWeatherCard = (cityName, weatherItem, index) => {
    if (index === 0) {
        return `
        <div class="details">
            <h2>${cityName} (${weatherItem.dt_text.split(" ")[0]})</h2>
            <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
            <h4>Wind: ${weatherItem.wind.speed} km/h</h4>
            <h4>Humidity: ${weatherItem.main.humidity}%</h4>
            <div class="icon">
                <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="Weather icon"/>
                <h4>${weatherItem.weather[0].description}</h4>
            </div>
        </div>`;
    }  else { //HTML for the other five day forecast card 
        return `
        <li class="card">
        <h3>${weatherItem.dt_text.split(" ")[0]}</h3>
        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="Weather icon"/>
        <h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
        <h4>Wind: ${weatherItem.wind.speed} km/h</h4>
        <h4>Humidity: ${weatherItem.main.humidity}%</h4>
        </li>`;

    }
};

const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/forecast/?lat=${lat}&lon=${lon}&appid=${API_KEY}';

    fetch(WEATHER_API_URL)
        .then((res) => res.json())
        .then((data) => {
            // Filter the forecast to get only one forecast per day
            const uniqueForecastDays = [];
            const fiveDaysForecast = data.list.filter((forecast) => {
                const forecastDate = new Date(forecast.dt_txt).getDate();
                if (!uniqueForecastDays.includes(forecastDate)) {
                    return uniqueForecastDays.push(forecastDate);
                    return true;
                }
                return false; 
            });

            // Clearing previous weather data 

            cityInput.value = "";
            currentWeatherDiv.innerHTML = "";
            weatherCardsDiv.innerHTML = "";
            //Creating weather cards and adding them to the DOM 
            fiveDaysForecast.forEach((weatherItem, index) => {
                if (index === 0) {
                    currentWeatherDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
                }
                else {
                    weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
                }
            });

        })
        .catch(() => {
            alert("An error occured while fetching the weather forecast!");
        });
};

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if (!cityName) return;
    const GEOCODING_API_URL = 'http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}'

    // Get entered city coordinates (latitude, longitude, and name) from the API response 

    fetch(GEOCODING_API_URL)
    .then((res) => res.json())
    .then((data) => {
        if (!data.length) return alert ('No coordinates found for ${cityName}');
        const { name, lat, lon } = data[0];
        getWeatherDetails(name, lat, lon)
    })
    .catch(() => {
        alert("An error occured while fetching the coordinates!");
    });
};

searchButton.addEventListener("click", getCityCoordinates);