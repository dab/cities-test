import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import { TEMP_UNIT } from '../App';

type Coords = {
  lat: number;
  lng: number;
}

export type City = {
  active: boolean;
  continent: string;
  country: string;
  description: string;
  image: string;
  name: string;
  coords: Coords;
  selected?: boolean;
}

interface CityBox {
  city: City,
  units?: string
}

const WIND_UNITS = {
  'imperial': 'm/hr',
  'metric': 'm/s'
}

const WEATHER_URL =  (lon: number, lat: number, units: string) => `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=24786c38b3d79b06355c93983fb04128&units=${units}`

export const CityBox = ({city, units}: CityBox) => {

  const [weatherData, setWeatherData] = useState<any>()
  const [isSelected, setIsSelected] = useState(false)
  const [metrics, setMetrics] = useState('metric')

  useEffect(() => {
  }, [])

  useEffect(() => {
    setIsSelected(city.selected || false)
    const mmetrics = units === TEMP_UNIT.C ? 'metric' : 'imperial'
    setMetrics(mmetrics)
  })

  useEffect(() => {
    if (isSelected) {
      const fetchWeatherData = async () => {
        const result = await axios(WEATHER_URL(city.coords.lng, city.coords.lat, metrics))
        setWeatherData(result.data.current)
      }

      fetchWeatherData()
    }
  }, [isSelected, metrics])

  return(
    <div key={city.name} className={`city-box ${city.selected ? 'selected' : ''}`}>
      <h2 className="z-10 relative text-white text-2xl">{city.name}</h2>
      <h3 className="z-10 relative text-white text-xl">{city.country}</h3>
      {
        city.selected && weatherData
          ? <div className='text-xs relative text-white z-10 mt-2 overflow-hidden'>
              <h2 className="text-white text-xl">{weatherData.temp} {units}</h2>
              <p className='text-xs text-white z-10 mt-2 '>{weatherData.wind_speed} {metrics === 'imperial' ? 'm/hr' : 'm/s'}</p>
            </div>
          : <>
              <p className="text-xs relative text-white z-10 mt-2 h-20 overflow-hidden">
                {city.description}
              </p>
            </>
      }
      <div className="city-gradient-bg z-1" />
      <img src={city.image} alt="" className="city-thumb" />
    </div>
  )
}

interface CitiesGrid {
  cities: City[],
  units: string
}

export const CitiesGrid = ({cities, units}: CitiesGrid) => {
  return(
    <section className="cities-grid flex flex-wrap justify-start justify-items-start content-start shrink-0 grow-0">
      { cities.length 
        ? cities.filter(city => city.active)
          .map(city => <Link key={`${city.country}-${city.name}`} to={`/cities/${city.name.toLowerCase()}`} ><CityBox city={city} units={units} /></Link>)
        : "No results found"
      }
    </section>
  ) 
}
