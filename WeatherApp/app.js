const date = document.querySelector("#date");
const locationName = document.querySelector("#locationName");
const temp = document.querySelector("#temp");
const input = document.querySelector("#input");
const button = document.querySelector("#search");
const weather = document.querySelector("#weather");
const forecastDays = document.querySelectorAll(".day");
const forecastDates = document.querySelectorAll(".date");

const locationIcon = document.createElement("i");
locationIcon.classList.add("fa-solid", "fa-location-dot");

const tempIcon = document.createElement("i");

const weatherIcon = document.createElement("i");

const tempSelector = document.createElement("button");
tempSelector.classList.add("tempSelectorButton");

let dateInterval;

const display = async () => {
    try{
        const config = {params: {q:input.value, appid: '450c822bc77c325d20d898180b7948ed', units: 'metric'}};
        const currentWeatherURL = 'https://api.openweathermap.org/data/2.5/weather';
        const currentWeather = await axios.get(currentWeatherURL, config);

        currentWeatherData(currentWeather.data.name, currentWeather.data.sys.country, currentWeather.data.main.temp, 
            currentWeather.data.weather[0].main, currentWeather.data.weather[0].id, currentWeather.data.timezone);

        const weatherForecastURL = 'https://api.openweathermap.org/data/2.5/forecast';
        const weatherForecast = await axios.get(weatherForecastURL, config);
        console.log(weatherForecast);

        // forecastDates.forEach((date, index) => {
        //     date.textContent = weatherForecast.data.list.filter(item => item.dt_txt.includes("15:00:00"))[index].dt_txt;
        // })

    }catch(e){
        console.error(e);
        locationName.textContent = e.response.statusText;
        temp.textContent = "";
        weather.textContent = "";
        date.textContent = "";
    }
}


const currentWeatherData = (responseName, responseCountry, responseTemp, responseWeather, responseID, responseTimezone) => {
    
    showDate(responseTimezone);

    locationName.textContent = `${responseName}, ${responseCountry}`;
    locationName.insertAdjacentElement("afterbegin", locationIcon);
    locationName.style.animation = "fadeIn 1s ease-in forwards";

    temp.textContent = `${Math.round(responseTemp) + ' °C'}`;
    tempCheck(responseTemp);
    temp.insertAdjacentElement("afterbegin", tempIcon);
    temp.style.animation = "fadeIn 0.8s ease-in forwards";

    selector(responseTemp);
    temp.insertAdjacentElement("beforeend", tempSelector);
    
    weather.textContent = responseWeather;
    weatherCheck(responseID);
    weather.insertAdjacentElement("afterbegin", weatherIcon);
    weather.style.animation = "fadeIn 0.8s ease-in forwards";

    setTimeout(() => {
        locationName.style.animation = "";
        temp.style.animation = "";
        weather.style.animation = "";
        date.style.animation = "";
    }, 1000);
}

const calculateDate = (timezone) => {
    return(
        currentDate = new Date(Date.now() + timezone * 1000)
    );
    //timezone*1000: 3600000
    //Date.now(): 1675100632526
    //Date.now() + responseTimezone * 1000: 1675104577810
    //currentDate: Mon Jan 30 2023 19:44:36 GMT+0100 (közép-európai téli idő)
}


const showDate = (timezone) => {
    clearInterval(dateInterval);
    date.style.animation = "fadeIn 0.8s ease-in forwards";

    const update = () => {
        calculateDate(timezone);
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        date.textContent = `${days[currentDate.getDay()-1]}, ${currentDate.getDate()} ${months[currentDate.getMonth()]} ${currentDate.getFullYear()} | 
        ${String(currentDate.getHours()-1).padStart(2, "0")}:${String(currentDate.getMinutes()).padStart(2, "0")}:${String(currentDate.getSeconds()).padStart(2, "0")}`;
    }
    //the update function executed before the interval, because then it removes 1s delay on the first display
    update();
    dateInterval = setInterval(update, 1000);
}


const selector = (responseData) => {
    let isFahrenheit = false;
    tempSelector.textContent = "°F";
    tempSelector.addEventListener("click", () => {
        if(!isFahrenheit){
            temp.textContent = `${convertToFahrenheit(responseData) + ' °F'}`;
            tempSelector.textContent = "°C";
            isFahrenheit = true;
        }else{
            temp.textContent = `${Math.round(responseData) + ' °C'}`;
            tempSelector.textContent = "°F";
            isFahrenheit = false;
        }
        temp.append(tempSelector);
        temp.insertAdjacentElement("afterbegin", tempIcon)
    })
}


const weatherCheck = (weatherID) => {
    weatherIcon.classList.remove("fa-solid", "fa-sun", "fa-wind", "fa-tornado", "fa-cloud", "fa-cloud-rain",
    "fa-cloud-showers-heavy", "fa-cloud-bolt", "fa-snowflake", "fa-smog");

    const conditions = [
        {id: [800], class: "fa-solid fa-sun"},
        {id: [771], class: "fa-solid fa-wind"},
        {id: [781], class: "fa-solid fa-tornado"},
        {id: [500,501], class: "fa-solid fa-cloud-rain"},
        {id: [502,503,504,511,520,521,522,531], class: "fa-solid fa-cloud-showers-heavy"},
        {id: [801,802,803,804], class: "fa-solid fa-cloud"},
        {id: [200,201,202,210,211,212,221,230,231,232], class: "fa-solid fa-cloud-bolt"},
        {id: [300,301,302,310,311,312,313,314,321], class: "fa-solid fa-cloud-rain"},
        {id: [600,601,602,611,612,613,615,616,620,621,622], class: "fa-solid fa-snowflake"},
        {id: [701,711,721,731,741,751,761,762], class: "fa-solid fa-smog"}
    ];

    conditions.forEach((condition) => {
        if(condition.id.includes(weatherID)){
            weatherIcon.classList.add(...condition.class.split(" "));
            return;
        }
    });
}


const tempCheck = (temp) => {
    tempIcon.classList.remove("fa-solid", "fa-temperature-empty", "fa-temperature-quarter", "fa-temperature-half",
    "fa-temperature-three-quarters", "fa-temperature-full");


    const temperatures = [
        {temp: -5, class: "fa-solid fa-temperature-empty"}, 
        {temp: 10, class: "fa-solid fa-temperature-quarter"}, 
        {temp: 25, class: "fa-solid fa-temperature-half"}, 
        {temp: 35, class: "fa-solid fa-temperature-three-quarters"}, 
        {temp: Infinity, class: "fa-solid fa-temperature-full"}
    ];
      
    for (let i = 0; i < temperatures.length; i++){
        if(temp < temperatures[i].temp){
            tempIcon.classList.add(...temperatures[i].class.split(" "));
            break;
        }
    }
}


const convertToFahrenheit = (celsius) => {
    const fahrenheit = Math.round((celsius*1.8) + 32);
    return fahrenheit;
}


button.addEventListener("click", display);


window.addEventListener("keypress", (event) => {
    (event.code === "Enter") ? display() : null;
})


window.addEventListener("keydown", (event) => {
    const div = document.querySelector(".display");
    const elements = div.querySelectorAll("*");
    if(event.key === "Delete"){
        elements.forEach((element) => {
            element.textContent = "";
            input.value = "";
        })
    }
})