import { useState, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'

import { CitiesGrid } from './components/CitiesGrid'
import citiesData from './assets/data.json'
import { CityDetails } from './components/CityDetails'
import { distance } from './utils'

const SORTING = {
  NAME: 'NAME',
  DISTANCE: 'DISTANCE',
}

export default function App() {

  const [cities, setCities] = useState(citiesData)
  const [nameFilter, setNameFilter] = useState('')
  const [continentsFilter, setContinentsFilter] = useState<string>()
  const [continents, setContinents] = useState<string[]>()
  const [sorting, setSorting] = useState('NAME')

  // create continents list from data.json items
  useEffect(() => {
    const availableContinents: string[] = ['ALL']
    citiesData.forEach(city => {
      if (!availableContinents.includes(city.continent)) {
        availableContinents.push(city.continent)
      }
    }) 
    setContinents(availableContinents)
  }, [])

  useEffect(() => {
    if (nameFilter.length === 0 && continentsFilter === 'ALL') {
      setCities(citiesData)
    }
    if (continentsFilter !== 'ALL' && nameFilter.length === 0) setCities(citiesData.filter(city => continentsFilter === 'ALL' || city.continent === continentsFilter))
    if (nameFilter.length > 0 && continentsFilter !== 'ALL') {
      const filteredCities = citiesData.filter(city => continentsFilter === 'ALL' || city.continent === continentsFilter).filter(city => city.name.toLowerCase().includes(nameFilter.toLowerCase()) || city.country.toLocaleLowerCase().includes(nameFilter.toLowerCase()))
      setCities(filteredCities)
    }
    if (nameFilter.length > 0 && continentsFilter === 'ALL') {
      const filteredCities = citiesData.filter(city => city.name.toLowerCase().includes(nameFilter.toLowerCase()) || city.country.toLocaleLowerCase().includes(nameFilter.toLowerCase()))
      setCities(filteredCities)
    }
  }, [nameFilter, continentsFilter])

  useEffect(() => {
    if (sorting === SORTING.NAME) {
      cities.sort((a: any, b: any) => {
        const nameA = a.name.toUpperCase()
        const nameB = b.name.toUpperCase()
        if (nameA < nameB) {
          return -1
        }
        if (nameA > nameB) {
          return 1
        }
        return 0
      })
    } else if (sorting === SORTING.DISTANCE) {
      // sort by distance to Barcelona
      cities.sort((a: any, b: any) => {
        // const firstPoint = a.coords
        // const secondPoint = citiesData.find(city => city.name === "Barcelona")?.coords
        // if secondPoint && ((distance(firstPoint) < distance(secondPoint))) {
        //   return -1;
        // }
        // if (distance(firstPoint) > distance(secondPoint)) {
        //   return 1;
        // }
        return 0;
      })
    }
  }, [sorting])

  const resetFilters = () => {
    setCities(citiesData)
    setNameFilter('')
    setContinentsFilter('ALL')
    setSorting(SORTING.NAME)
  }

  const filterContinent = (e: React.FormEvent<HTMLSelectElement>) => {
    setContinentsFilter(e.currentTarget.value)
  }

  const onNameFilterChange = (e: React.FormEvent<HTMLInputElement>) => setNameFilter(e.currentTarget.value)
  
  return (
      <>
        <header className='flex filters'>
          <div className='text-filter'>
            <label htmlFor='text-filter'>Search</label>
            <input id="text-filter" placeholder='Type to search' type='text' onChange={onNameFilterChange} value={nameFilter} />
            <a className='filters-reset' onClick={resetFilters}>Clear filter</a> 
          </div>
          <div className='text-filter'>
            <label>Continent</label>
            { continents?.length && <select value={continentsFilter} onChange={filterContinent}>
              { continents.map(continent => <option value={continent} key={continent}>{continent}</option> )}
            </select>}
          </div>
          <div className="sorting-filter">
            <label>Sort by</label>
            <a className={sorting === SORTING.NAME ? 'active' : ''} onClick={() => setSorting(SORTING.NAME)}>Name</a> 
            | <a className={sorting === SORTING.DISTANCE ? 'active' : ''} onClick={() => setSorting(SORTING.DISTANCE)}>Distance</a>
          </div>
          <div className="units-selector">
            <label>Units</label>
            <a>C</a> | <a>F</a>
          </div>
        </header>

        <section className="content">
          <Routes>
            <Route path="/" element={<CitiesGrid cities={cities} />}></Route>
            <Route path="/cities/:city" element={<CityDetails cities={citiesData} />}></Route>
          </Routes>
        </section>
      </>
  )
}
