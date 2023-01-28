const locationName = document.querySelector("#locationName");
const temp = document.querySelector("#temp");
const input = document.querySelector("#input");
const button = document.querySelector("#search");
const weather = document.querySelector("#weather");
const errorResponse = document.querySelector("#error");

const locationIcon = document.createElement("i");
locationIcon.classList.add("fa-solid", "fa-location-dot");

const tempIcon = document.createElement("i");

const weatherIcon = document.createElement("i");

const tempSelector = document.createElement("button");
tempSelector.classList.add("tempSelectorButton");


const displayWeather = async () => {
    try{
        const config = {params: {q:input.value, appid: '450c822bc77c325d20d898180b7948ed', units: 'metric'}};
        const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', config);

        locationName.textContent = `${response.data.name}, ${response.data.sys.country}`;
        locationName.insertAdjacentElement("afterbegin", locationIcon);
        locationName.style.animation = "fadeIn 1s ease-in forwards";

        temp.textContent = `${Math.round(response.data.main.temp) + ' °C'}`;
        tempCheck(response.data.main.temp);
        temp.insertAdjacentElement("afterbegin", tempIcon);
        temp.style.animation = "fadeIn 0.8s ease-in forwards";

        selector(response.data.main.temp);
        temp.insertAdjacentElement("beforeend", tempSelector);
        
        weather.textContent = response.data.weather[0].main;
        weatherCheck(response.data.weather[0].id);
        weather.insertAdjacentElement("afterbegin", weatherIcon);
        weather.style.animation = "fadeIn 0.8s ease-in forwards";

        errorResponse.textContent = "";

        setTimeout(() => {
            locationName.style.animation = "";
            temp.style.animation = "";
            weather.style.animation = "";
        }, 1000);

    }catch(e){
        console.error(e);
        errorResponse.textContent = e.response.statusText;
        temp.textContent = "";
        weather.textContent = "";
        locationName.textContent = "";
    }
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


button.addEventListener("click", displayWeather);


window.addEventListener("keypress", (event) => {
    (event.code === "Enter") ? displayWeather() : null;
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