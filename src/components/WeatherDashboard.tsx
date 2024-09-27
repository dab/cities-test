
import { useState, useEffect } from 'react'
import { CitiesGrid, City, City as CityType } from './CitiesGrid'
import citiesData from '../assets/data.json'
import { fetchContinents, getCitiesByDistance, getCitiesByName } from '../utils'
import { useParams } from 'react-router-dom'
import styles from './WeatherDashboard.module.scss'

const SORTING = {
  NAME: 'NAME',
  DISTANCE: 'DISTANCE',
}

export const TEMP_UNIT = {
  C: '℃',
  F: '℉'
}

export function WeatherDashboard() {
  const [cities, setCities] = useState<CityType[]>(citiesData)
  const [nameFilter, setNameFilter] = useState('')
  const [continentsFilter, setContinentsFilter] = useState<string>('ALL')
  const [continents] = useState<string[]>(fetchContinents(citiesData))
  const [sorting, setSorting] = useState<string>()
  const [tempUnit, setTempUnit] = useState(TEMP_UNIT.C)
  const {cityName} = useParams()
  const [isSorted, setIsSorted] = useState(false)

  useEffect(() => {
    setSortByName()
  }, [])

  // sorting
  useEffect(() => {
    if (cities.length) {
    if (sorting === SORTING.NAME) {
      const sortedCities = [...cities].sort(getCitiesByName)
      setCities(sortedCities)
    }

    if (sorting === SORTING.DISTANCE) {
      // sort by distance to Barcelona
      const referenceCity = citiesData.find(city => city.name === "Barcelona")
      const UNIT = 'K' //km
      if (referenceCity) {
        const sortedCities = getCitiesByDistance([...cities], referenceCity, UNIT)
        setCities(sortedCities)
      }
    }
    }
    setIsSorted(true)
  }, [isSorted, sorting])

  // country, name and continent filter
  useEffect(() => {
    if (nameFilter.length === 0 && continentsFilter === 'ALL') {
      setCities([...citiesData])
    }
    if (continentsFilter !== 'ALL' && nameFilter.length === 0) {
      setCities(citiesData.filter(city => city.continent === continentsFilter))
    }
    if (nameFilter.length > 0 && continentsFilter !== 'ALL') {
      const filteredCities = [...citiesData].filter(city => city.continent === continentsFilter).filter(city => city.name.toLowerCase().includes(nameFilter.toLowerCase()) || city.country.toLocaleLowerCase().includes(nameFilter.toLowerCase()))
      setCities(filteredCities)
    }
    if (nameFilter.length > 0 && continentsFilter === 'ALL') {
      const filteredCities = [...citiesData].filter(city => city.name.toLowerCase().includes(nameFilter.toLowerCase()) || city.country.toLocaleLowerCase().includes(nameFilter.toLowerCase()))
      setCities(filteredCities)
    }
    setIsSorted(false)

  }, [nameFilter, continentsFilter])

  useEffect(() => {
    if (cityName) {
      const citiesClone: City[] = [...cities].map(city => {
        if (city.name.toLowerCase() === cityName.toLowerCase()) {
          city.selected = true
        } else {
          city.selected = undefined
        }
        return city
        
      })
      setCities(citiesClone)
    } else {
      const citiesClone: City[] = [...cities].map(city => {
        city.selected = undefined
        return city
      })
      setCities(citiesClone)
    }
  }, [cityName])

  const resetFilters = () => {
    setCities(citiesData)
    setSorting(SORTING.NAME)
    setNameFilter('')
    setContinentsFilter('ALL')
    setTempUnit(TEMP_UNIT.C)
  }

  const filterContinent = (e: React.FormEvent<HTMLSelectElement>) => setContinentsFilter(e.currentTarget.value)

  const onNameFilterChange = (e: React.FormEvent<HTMLInputElement>) => setNameFilter(e.currentTarget.value)

  const setSortByName = () => setSorting(SORTING.NAME)
  const setSortByDistance = () => setSorting(SORTING.DISTANCE)

  const setMetricUnits = () => setTempUnit(TEMP_UNIT.C)
  const setImperialUnits = () => setTempUnit(TEMP_UNIT.F)

  return (
    <>
      <header className={styles.filters}>
        <div className={styles.textFilter}>
          <label className={styles.textFilter__label} htmlFor='text-filter'>Search</label>
          <input className={styles.textFilter__input} id="text-filter" placeholder='Type to search' type='text' onChange={onNameFilterChange} value={nameFilter} />
          <a className={styles.filtersReset} onClick={resetFilters}>Clear filter</a> 
        </div>
        { continents?.length && <div className={styles.textFilter}>
          <label  className={styles.textFilter__label}>Continent</label>
          <select className={styles.filters__select} value={continentsFilter} onChange={filterContinent}>
            { continents.map(continent => <option value={continent} key={continent}>{continent}</option> )}
          </select>
        </div>}
        <div className={styles.sortingFilter}>
          <label className={styles.textFilter__label}>Sort by</label>
          <a className={sorting === SORTING.NAME ? styles.sortingFilter__link_active : undefined} onClick={setSortByName} title="Sort by name">Name</a>
          <span className={styles.separator}>|</span>
          <a className={sorting === SORTING.DISTANCE ? styles.sortingFilter__link_active : undefined} onClick={setSortByDistance} title="Sorty by distance to Barcelona">Distance</a>
        </div>
        <div className="unitsSelector">
          <label className={styles.textFilter__label} >Units</label>
          <a onClick={setMetricUnits} className={tempUnit === TEMP_UNIT.C ? styles.unitsSelector__link_active : undefined}>{TEMP_UNIT.C}</a>
          <span className='separator'>|</span>
          <a onClick={setImperialUnits} className={tempUnit === TEMP_UNIT.F ? styles.unitsSelector__link_active : undefined}>{TEMP_UNIT.F}</a>
        </div>
      </header>

      <section className="content">
        <CitiesGrid cities={cities} units={tempUnit} />
      </section>
    </>
  )
}
