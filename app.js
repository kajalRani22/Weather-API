const key = "06837e2c8b3ba1207c2bdd4fe02a2b44";
let weatherEndPoint =
  "https://api.openweathermap.org/data/2.5/weather?&appid=" +
  key +
  "&units=metric";
let forecastEndpoint =
  "https://api.openweathermap.org/data/2.5/forecast?&appid=" +
  key +
  "&units=metric";
// for get weather api respond
let getWeatherDetails = async (cityName, Country) => {
  let weatherMainPoint = weatherEndPoint + "&q=" + cityName + "," + Country;
  console.log(weatherMainPoint);
  let response = await fetch(weatherMainPoint);
  let mainResponse;
  try {
    if (response.status === 200) {
      mainResponse = await response.json();
    } else {
      throw new Error("Bad request");
    }
  } catch (error) {
    console.log(error); //if request not fire
    Swal.fire({
      icon: "error",
      title: "weather Api not response or may be input wrong",
    });
  }
  decorateWeatherDetails(mainResponse);
  console.log(mainResponse);
  forecastWeather(mainResponse.id);
  changeBackground(mainResponse.timezone);
  console.log("chla");
};
//for get each next 3 hour or 5 next days forecast
let dayForecast = [];
//insert next 5 days forecast
let decorateDaysForecast = () => {
  let mainDiv = document.querySelector(".hourForecast");
  let days = mainDiv.querySelectorAll("strong");
  let image = mainDiv.querySelectorAll("img");
  let mintemp = mainDiv.querySelectorAll(".minTemp");
  let maxtemp = mainDiv.querySelectorAll(".maxTemp");
  const options = {
    weekday: "short",
  };
 // console.log(days);
  for (let key in dayForecast) {
    let day = new Date(dayForecast[key].dt_txt).toLocaleDateString(
      "en-US",
      options
    );
    days[key].innerHTML = day;
    image[
      key
    ].src = `http://openweathermap.org/img/wn/${dayForecast[key].weather[0].icon}@2x.png`;
    mintemp[key].innerText = dayForecast[key].main.temp_min.toFixed(1) + "℃";
    maxtemp[key].innerText = dayForecast[key].main.temp_max.toFixed(1) + "℃";
  }
 // console.log(dayForecast);
};
let forecastWeather = async (cityId) => {
  let forecastMainEndpoint = forecastEndpoint + "&id=" + cityId;
  let response = await fetch(forecastMainEndpoint);

  let mainResponse;
  try {
    if (response.status === 200) {
      mainResponse = await response.json();
    } else {
      throw new Error("Bad request");
    }
  } catch (error) {
    console.log(error); //if request not fire
    Swal.fire({
      icon: "error",
      title: "  weather Api not response or may be input wrong",
    });
  }
  // create 5 days forecast
  dayForecast = []; //why resize every time this array increased by 5 ned to resize it
  for (let index = 0; index < mainResponse.list.length; index += 8) {
    dayForecast.push(mainResponse.list[index]);
  }
  decorateDaysForecast();
};
//decorate dom after response api
let paraRef = document.querySelector(".child2").querySelector("p");

let decorateWeatherDetails = (response) => {
  let strongRef = document.querySelector("ul").querySelectorAll("strong");
  strongRef[0].innerText = (response.wind.speed * 3.6).toFixed(2); //add wind speed
  strongRef[1].innerText = response.main.pressure; //add pressure
  strongRef[2].innerText = response.main.humidity; //add humidity

  let fTempRef = document.querySelector("#farenhite");
  let cTempRef = document.querySelector("#celcius");
  let heading = document.querySelector("h1");
  heading.innerText = response.main.temp;
  fTempRef.addEventListener("mouseover", (obj) => {
    heading.innerText = (response.main.temp * 1.8 + 32).toFixed(2);
    fTempRef.style.fontWeight = 800;
    cTempRef.style.fontWeight = 100;
  });
  cTempRef.addEventListener("mouseover", (obj) => {
    heading.innerText = response.main.temp;
    cTempRef.style.fontWeight = 800;
    fTempRef.style.fontWeight = 100;
  });
  let icons = response.weather[0].icon;
  document.querySelector(
    "img"
  ).src = `http://openweathermap.org/img/wn/${icons}@2x.png`;
  console.log(paraRef.nextElementSibling);
  paraRef.nextElementSibling.innerHTML = response.weather[0].main;
  // console.log(new Date(response.dt));
};
//call Enter after click on show button
document.querySelector(".btn").addEventListener("click", () => {
  let cityName = document.querySelector("#location").value;
  let country = document.querySelector("#country").value;
  document.querySelector("h2").innerText = cityName + ", " + country;
  getWeatherDetails(cityName, country);
});

let changeBackground = async(timezone)=> {
 /* const key1 = "5258b2833bfa4b06b67f2ccd5dded3d6";
  let path = "https://api.ipgeolocation.io/timezone?apiKey="; //call for time api
  let endPoint = path + key1 + "&lat=" + latitude + "&long=" + longitude;
  let responseTime = await fetch(endPoint);
  let ResponseTime;
  try {
    if (responseTime.status === 200) {
      ResponseTime = await responseTime.json();
    } else {
      throw new Error("something went wrong");
    }
  } catch (error) {
    console.log(error);
    Swal.fire({
      icon: "error",
      title: "  weather Api not response or may be input wrong",
    });
  }*/
  const timezoneMinutes = timezone / 60;
  const currtime = moment().utcOffset(timezoneMinutes).format("llll");
  console.log(currtime);

 
  paraRef.innerHTML = currtime;
   /* date.substring(0, date.indexOf(" "))  + " " + ResponseTime.time_12;*/
 // let time = ResponseTime.time_24;
  // console.log(typeof time);
  let hour = new Date(currtime).getHours();
  console.log(hour);

  let bodyRef = document.body;
  
  if (hour >= 5 && hour <12) {
    bodyRef.style.backgroundImage = "url(`morning (1).jpg')";
    colorChangeOfCard("#FFA500");
  } else if (hour >= 12 && hour < 17) {
   // bodyRef.setAttribute("style","color:black");
    bodyRef.style.backgroundImage = "url('afternoonimages.jpg')";
    colorChangeOfCard("#0000FF");
  } else if (hour >= 17 && hour < 21) {
    bodyRef.style.backgroundImage = "url('evening.jpg')";
    colorChangeOfCard("#FF8C00");
  } else {
    bodyRef.style.backgroundImage = "url('night1.jpg')";
    colorChangeOfCard("#696969");
  }
};

let colorChangeOfCard = (color)=>{
    
    let cardColor = document.querySelectorAll(".cards");
    console.log(cardColor);
    for (let itr of cardColor) {
      itr.style.backgroundColor = color; 
      
    }
   // cardColor = [];
};
