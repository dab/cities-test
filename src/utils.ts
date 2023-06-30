//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//:::                                                                         :::
//:::  This routine calculates the distance between two points (given the     :::
//:::  latitude/longitude of those points). It is being used to calculate     :::
//:::  the distance between two locations using GeoDataSource (TM) prodducts  :::
//:::                                                                         :::
//:::  Definitions:                                                           :::
//:::    South latitudes are negative, east longitudes are positive           :::
//:::                                                                         :::
//:::  Passed to function:                                                    :::
//:::    lat1, lon1 = Latitude and Longitude of point 1 (in decimal degrees)  :::
//:::    lat2, lon2 = Latitude and Longitude of point 2 (in decimal degrees)  :::
//:::    unit = the unit you desire for results                               :::
//:::           where: 'M' is statute miles (default)                         :::
//:::                  'K' is kilometers                                      :::
//:::                  'N' is nautical miles                                  :::
//:::                                                                         :::
//:::  Worldwide cities and other features databases with latitude longitude  :::
//:::  are available at https://www.geodatasource.com                         :::
//:::                                                                         :::
//:::  For enquiries, please contact sales@geodatasource.com                  :::
//:::                                                                         :::
//:::  Official Web site: https://www.geodatasource.com                       :::
//:::                                                                         :::
//:::               GeoDataSource.com (C) All Rights Reserved 2018            :::
//:::                                                                         :::
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

import { City } from "./components/CitiesGrid";

type DistancesArgs = {
    lat1: number;
    lon1: number;
    lat2: number;
    lon2: number;
    unit: string;
}

export function distance(args: DistancesArgs) {
    const {lat1, lon1, lat2, lon2, unit} = args
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    }
    else {
        var radlat1 = Math.PI * lat1/180;
        var radlat2 = Math.PI * lat2/180;
        var theta = lon1-lon2;
        var radtheta = Math.PI * theta/180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180/Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit=="K") { dist = dist * 1.609344 }
        if (unit=="N") { dist = dist * 0.8684 }
        return dist;
    }
}


// Sorting helper function
export function getCitiesByDistance(sortedCities: City[], referenceCity: City, UNIT: string) {
  return sortedCities.sort((a: City, b: City) => {
    if (referenceCity) {
      const city1 = {
        lat1: a.coords.lat,
        lon1: a.coords.lng,
        lat2: referenceCity.coords.lat,
        lon2: referenceCity.coords.lng,
        unit: UNIT
      }
      const city2 = {
        lat1: b.coords.lat,
        lon1: b.coords.lng,
        lat2: referenceCity.coords.lat,
        lon2: referenceCity.coords.lng,
        unit: UNIT
      }
      const dist1 = distance(city1)
      const dist2 = distance(city2)
      if (dist1 < dist2) {
        return -1;
      }
      if (dist1 > dist2) {
        return 1;
      }
    }
    return 0;
  })
}

export function getCitiesByName(a: City, b: City) {
  const nameA = a.name.toUpperCase()
  const nameB = b.name.toUpperCase()
  if (nameA < nameB) {
    return -1
  }
  if (nameA > nameB) {
    return 1
  }
  return 0
}

// fetch continents from cities list
export const fetchContinents = (cities: City[]): string[] => {
  const availableContinents: string[] = ['ALL']
  cities.forEach(city => {
    if (!availableContinents.includes(city.continent)) {
      availableContinents.push(city.continent)
    }
  })
  return availableContinents
}
