$(document).ready(function() {
  var lat = "";
  var lon = "";
  var api = "https://fcc-weather-api.glitch.me/api/current?";

  //Get Location coords
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var lat = "lat=" + position.coords.latitude;
        var lon = "lon=" + position.coords.longitude;
        getWeather(lat, lon);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
    //end getLocation Function
  }

  //Request API from location coords
  function getWeather(lat, lon) {
    var newURL = api + lat + "&" + lon;
    $.getJSON(newURL, function(info) {
      console.log(info);

      //Replace Text Data with Info Data
      $("#infoLocation").text(`${info.name}, ${info.sys.country}`);
      $("#infoTemp").text(
        `${Math.floor(info.main.temp + 1) + String.fromCharCode(176) + " C"}`
      );
      IconGen(info.weather[0].main);

      //IconGenerator
      function IconGen(desc) {
  var desc = desc.toLowerCase()
  switch (desc) {
    case 'moderate rain':
      addIcon('rain')
      break;
    case 'clouds':
      addIcon(desc)
      break;
    case 'rain':
      addIcon(desc)
      break;
    case 'snow':
      addIcon(desc)
      break;
    case 'clear':
      addIcon(desc)
      break;
    case 'thunderstorm':
      addIcon(desc)
      break;
    default:
      $('div.clouds').removeClass('hide');
  }
}

function addIcon(desc) {
  $('div.' + desc).removeClass('hide');
}

      //Capitalize First Letter
      function titleCase(data) {
        var array = data.toLowerCase().split(" ");
        var result = array.map(function(val) {
          return val.replace(val.charAt(0), val.charAt(0).toUpperCase());
        });
        console.log(result.join(""));
        return result.join(" ");
      }

      //Replace Text Data with Info Data Cont
      $("#infoDescription").text(
        `${titleCase(info.weather[0].description)} / ${info.weather[0].main}`
      );
      $("#infoIcon").html(
        `<img src="${
          info.weather[0].icon
        }" height="200" width="200" alt='ICON HERE'>`
      );

      //Convert Unix To Time
      function timeConverter(UNIX_timestamp) {
        var a = new Date(info.dt * 1000);
        var hour = a.getHours();
        var min = a.getMinutes();
        var sec = a.getSeconds();
        var time = hour + ":" + min;
        if (min < 10) {
          min = "0" + min;
        }

        if (hour > 12) {
          hour = hour - 12;
          return hour + ":" + min + " PM";
        } else if (hour % 12 == 1) {
          hour = 12;
          return "12" + ":" + min + " PM";
        } else if (hour === 0) {
          hour = 12;
          return "12" + ":" + min + " AM";
        } else if ( hour > 12) {
          return hour + ":" +  min + " PM";
        } else if ( hour < 12) {
          return hour + ":" + min + " AM";
        } else {
          return time + " AM";
        }
      }

      // Convert UNIX to Date
      function dateConverter(UNIX_timestamp) {
        var a = new Date(info.dt * 1000);
        var months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec"
        ];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var fullDate = month + " " + date + ", " + year;
        return fullDate;
      }

      // Convert To Fahrenheit
      function convertToF(celsius) {
        var fahrenheit = celsius * (9 / 5) + 32;
        return Math.floor(fahrenheit);
      }

      $("#infoDate").text(dateConverter);
      $("#infoTime").text(timeConverter);

      // Toggle Temp Conversion on click
      var infoFar = convertToF(`${Math.floor(info.main.temp) + 1}`);
      var infoHL =
        "High " +
        convertToF(`${Math.floor(info.main.temp_max) + 1}`) +
        String.fromCharCode(176) +
        " / " +
        "Low " +
        convertToF(`${Math.floor(info.main.temp_min) + 1}`) +
        String.fromCharCode(176);
      var infoLow = convertToF(`${Math.floor(info.main.temp_min) + 1}`);
      var infoCel = `${Math.floor(info.main.temp) + 1}`;

      toggleFar();

      function toggleFar() {
        $(".btn").on("click", function() {
          $("#infoTemp").text(infoFar + String.fromCharCode(176) + " F");
          $("#infoHL").text(infoHL);

          return toggleCel();
        });
      }
      function toggleCel() {
        $(".btn").on("click", function() {
          $("#infoTemp").text(infoCel + String.fromCharCode(176) + " C");
          $("#infoHL").text(
            `High ${info.main.temp_max + String.fromCharCode(176)} / Low ${info
              .main.temp_min + String.fromCharCode(176)}`
          );

          return toggleFar();
        });
      }

      $("#infoHL").text(
        `High ${info.main.temp_max + String.fromCharCode(176)} / Low ${info.main
          .temp_min + String.fromCharCode(176)}`
      );
      $("#infoHum").text(`Humidity: ${info.main.humidity}%`);
    });
  }

  getLocation();
});
