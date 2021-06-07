const appId = '26df59715799458d7536afd82b112330'
const weatherApi = `https://api.openweathermap.org/data/2.5/weather?units=imperial&appid=${appId}&q=`
const onecallApi = `https://api.openweathermap.org/data/2.5/onecall?units=imperial&appid=${appId}`

Vue.component('weather', {
  data: function() {
    return {
      city: '',
      locationHistory: [],
      todayWeather: {
        humidity: 0,
        temp: 0,
        uvi: 0,
        wind_speed: 0,
        temp: 0
      },
      fiveDayForecast: []
    }
  },
  template: `
  <div>
    <input type="text" v-model="city" placeholder="Orlando">
    <button v-on:click="getLatLon">Search</button>
    <div v-if="todayWeather.temp != 0">
      <div class="list-group-item">UV: {{ todayWeather.uvi }}</div>
      <div class="list-group-item">Wind Speed: {{ todayWeather.wind_speed }}</div>
      <div class="list-group-item">Humidity: {{ todayWeather.humidity }} %</div>
      <div class="list-group-item">Temp: {{ todayWeather.temp }}&deg;</div>
      <div class="list-group-item">{{ todayWeather.city }} {{ todayWeather.date }}</div>
    </div>
    <div v-for="(day, index) in fiveDayForecast">
      <div class="list-group-item">{{ day.date }}</div>
      <img class="list-group-item" :src="day.iconUrl" />
      <div class="list-group-item">Temp: {{ day.temp }}&deg;</div>
      <div class="list-group-item">Humidity: {{ day.humidity }} %</div>
      <div class="list-group-item">Wind Speed: {{ day.wind_speed }} MPH</div>
    </div>
  </div>
  `,
  methods: {
    async getLatLon() {
      const location = await fetch(weatherApi + this.city)
        .then(data => data.json())
        .then(location => ({
          city: location.name,
          lat: location.coord.lat,
          lon: location.coord.lon,
          timestamp: Math.round(Date.now() / 1000)
        }))
      this.locationHistory.push(location)
      this.oneCallApi(location.lat, location.lon);
    },
    async oneCallApi(lat, lon) {
      const weather = await fetch(`${onecallApi}&lat=${lat}&lon=${lon}`)
        .then(weather => weather.json())
        .then(weather => ({
          todayWeather: {
            humidity: weather.current.humidity,
            temp: weather.current.temp,
            uvi: weather.current.uvi,
            wind_speed: weather.current.wind_speed,
            temp: Math.floor(weather.current.temp),
          },
          fiveDayForecast: weather.daily.map(day => ({
            date: new Date(day.dt * 1000).toLocaleDateString('en-US'),
            icon: day.weather[0].icon,
            iconUrl: `http://openweathermap.org/img/wn/${day.weather[0].icon}.png`,
            temp: Math.floor(day.temp.day),
            humidity: day.humidity,
            wind_speed: day.wind_speed
          })).slice(0, 5)
        }))

      this.todayWeather = weather.todayWeather
      this.fiveDayForecast = weather.fiveDayForecast
    }
  }
})
new Vue({ el: '#app' })
