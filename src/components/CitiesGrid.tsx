import { Link } from 'react-router-dom'

type Coords = {
  lat: number;
  lng: number;
}

type City = {
  active: boolean;
  continent: string;
  country: string;
  description: string;
  image: string;
  name: string;
  coords: Coords;
}

interface CityBox {
  city: City
}

export const CityBox = ({city}: CityBox) => {
  return(
    <div key={city.name} className="city-box">
      <h2 className="z-10 relative text-white text-2xl">{city.name}</h2>
      <h3 className="z-10 relative text-white text-xl">{city.country}</h3>
      <p className="text-xs relative text-white z-10 mt-2 h-20 overflow-hidden">{city.description}</p>
      <div className="city-gradient-bg z-1" />
      <img src={city.image} alt="" className="city-thumb" />
    </div>
  )
}

interface CitiesGrid {
  cities: City[]
}

export const CitiesGrid = ({cities}: CitiesGrid) => {
  return(
    <section className="cities-grid flex flex-wrap justify-start justify-items-start content-start shrink-0 grow-0">
      { cities
          .filter(city => city.active)
          .map(city => <Link to={`/cities/${city.name.toLowerCase()}`} ><CityBox key={`${city.country}-${city.name}`} city={city} /></Link>)}
    </section>
  ) 
}
