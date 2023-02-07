const time = document.querySelector("#time");
const locationName = document.querySelector("#locationName");
const temp = document.querySelector("#temp");
const input = document.querySelector("#input");
const button = document.querySelector("#search");
const weather = document.querySelector("#weather");

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
        const url = 'https://api.openweathermap.org/data/2.5/weather';
        const response = await axios.get(url, config);
        weatherData(response.data.name, response.data.sys.country, response.data.main.temp, 
            response.data.weather[0].main, response.data.weather[0].id, response.data.timezone);
    }catch(e){
        console.error(e);
        locationName.textContent = e.response.statusText;
        temp.textContent = "";
        weather.textContent = "";
        time.textContent = "";
        clearInterval(dateInterval);
    }
}


const weatherData = (responseName, responseCountry, responseTemp, responseWeather, responseID, responseTimezone) => {
    
    showTime(responseTimezone);

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
        time.style.animation = "";
        locationName.style.animation = "";
        temp.style.animation = "";
        weather.style.animation = "";
    }, 1000);
}


const showTime = (timezone) => {
    const timezoneGMT = timezone/3600;
    clearInterval(dateInterval);
    time.style.animation = "fadeIn 0.8s ease-in forwards";

    const update = () => {
        const localTime = new Date();
        const utcTime = localTime.getTime() + (localTime.getTimezoneOffset()*60000);
        const destinationTime = new Date(utcTime + (timezoneGMT*3600000));

        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let year = destinationTime.getFullYear();
        let month = months[destinationTime.getMonth()];
        let day = destinationTime.getDate();
        let hours = destinationTime.getHours();
        let minutes = destinationTime.getMinutes();
        let seconds = destinationTime.getSeconds();
        
        time.textContent = `${String(day).padStart(2, "0")} ${String(month).padStart(2, "0")} ${year} |
        ${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    }
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
            clearInterval(dateInterval);
        })
    }
})