import { useParams } from "react-router-dom"
import { CityBox } from "./CitiesGrid"
import cities from '../assets/data.json'
import { useEffect, useState } from "react"

const WEATHER_URL =  (lon: number, lat: number) => `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=24786c38b3d79b06355c93983fb04128`
  // useEffect(() => {
  //   const cityWeather = fetch(WEATHER_URL(city.coords.lng, city.coords.lat), {method: 'GET'}).then(data => console.log(data))
  // }, [])


export const City = ({city}: CityBox) => {
  return(
    <div key={city.name} className="city-box relative">
      <h2 className="z-10 relative text-white text-2xl">{city.name}</h2>
      <h3 className="z-10 relative text-white text-xl">{city.country}</h3>
      <p className="text-xs relative text-white z-10 mt-2 h-20 overflow-hidden">{city.description}</p>
      <div className="city-gradient-bg z-1" />
      <img src={city.image} alt="" className="city-thumb" />
    </div>
  )
}

export const CityDetails = () => {
  const params = useParams()
  const [currentWeatherData, setCurrentWeatherData] = useState<any>()
  const currentCity = cities.find(city => city.name.toLowerCase() === params.cityName?.toLowerCase())

  useEffect(() => {
    // if (currentCity) {
    //   fetch(WEATHER_URL(currentCity.coords.lng, currentCity.coords.lat), { method: 'GET', mode: 'no-cors' })
    //     .then(response => response)
    //     .then(result => setCurrentWeatherData(result))
    //     .catch(e => console.error(e))
    // }
  }, [])

  useEffect(() => {
    console.log(currentWeatherData)
  }, [currentWeatherData])

  return (
    <>
      { currentCity && <div className="flex relative">
          <div key={currentCity.name} className="city-thumb block">
            <h2 className="z-10 text-white text-2xl">{currentCity.name}</h2>
            <h3 className="z-10 text-white text-xl">{currentCity.country}</h3>
            <div className="city-gradient-bg z-1" />
            <img src={currentCity.image} alt="" className="city-thumb" />
          </div>
          <p className="text-xs z-10 mt-2 ">{currentCity.description}</p>
        </div>
      }

      {/* {currentWeatherData && <pre>{currentWeatherData}</pre>} */}
    </>
  )

}