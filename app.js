const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const searchbox = document.querySelector('.search-box');
const errorMessage = document.querySelector('.error-message');
const api = {
    key: '171fd74387792ee634916c0ed03aeec2',
    baseUrl: 'https://api.openweathermap.org/data/2.5'
}

// Try to fetch current location weather
getGeolocation();

// Listen to enter key pressing when searching for a city
searchbox.addEventListener('keypress', setQuery);

function setQuery(evt) {
    if (evt.keyCode == 13) {
        getWeather(searchbox.value);
    }
}

function getWeather(city) {
    fetch(`${api.baseUrl}/weather?q=${city}&units=metric&APPID=${api.key}`)
    .then(weather => {
        return weather.json();
    })
    .then(displayResults)
    .catch(error => {
        errorMessage.style.display = 'block';
        errorMessage.innerHTML = `<p>The city doesn't exist.</p>`;
    })
}

// Format and show the weather for the chosen city
function displayResults(weather) {
    let city = document.querySelector('.location .city');
    city.innerText = `${weather.name}, ${weather.sys.country}`;
    
    let date = document.querySelector('.location .date');
    let now = new Date();
    date.innerText = dateFormat(now);
    
    let temp = document.querySelector('.current-weather .temp');
    temp.innerHTML = `${Math.round(weather.main.temp)}<span>°c</span>`;
    
    let weather_current = document.querySelector('.current-weather .weather');
    weather_current.innerText = `${weather.weather[0].main}`;
    
    let hilow = document.querySelector('.current-weather .hi-low');
    hilow.innerText = `Min ${Math.round(weather.main.temp_min)}°c / Max ${Math.round(weather.main.temp_max)}°c`;
}

// Format date
function dateFormat(d) {
    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`;
}

function getGeolocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition( setPosition, showError );
    } else {
        errorMessage.style.display = 'block';
        errorMessage.innerHTML = `<p>Browser doesn't support geolocation.</p>`;
    }
}

function setPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    getCurrentLocationWeather(latitude, longitude);
}

// Show error if geolocation permission is not accepted
function showError(error) {
    errorMessage.style.display = 'block';
    errorMessage.innerHTML = `<p>${error.message}</p>`;
}

function getCurrentLocationWeather(lat, lng) {
    fetch(`${api.baseUrl}/weather?lat=${lat}&lon=${lng}&units=metric&APPID=${api.key}`)
    .then(weather => {
        return weather.json();
    })
    .then(displayResults)
    .catch(error => {
        errorMessage.style.display = 'block';
        errorMessage.innerHTML = `<p>Oops, something went wrong.</p>`;
    })
}

