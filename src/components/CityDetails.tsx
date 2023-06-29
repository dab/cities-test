import { useLocation, useParams, useSearchParams } from "react-router-dom"
import { CityBox } from "./CitiesGrid"
import { CitiesGridInterface, CityBoxInterface } from "./CitiesGrid.types"

const WEATHER_URL =  (lon: string, lat: string) => `https://api.openweathermap.org/data/2.5/onecall?lon=${lon}&${lat}=[lat]&units=metric&appid=a095394c178a40eb6cce7b3db2c61b9f`
  // useEffect(() => {
  //   const cityWeather = fetch(WEATHER_URL(city.coords.lng, city.coords.lat), {method: 'GET'}).then(data => console.log(data))
  // }, [])


export const CityDetails = ({cities}: CitiesGridInterface) => {
    const params = useParams()
    const currentCity = cities.find(city => city.name.toLowerCase() === params.city?.toLowerCase())
    return(
        currentCity && <CityBox city={currentCity}/>
    )

}