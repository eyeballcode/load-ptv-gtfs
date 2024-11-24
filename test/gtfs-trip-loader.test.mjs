import { expect } from 'chai'
import path from 'path'
import url from 'url'
import { TRANSIT_MODES } from '../lib/constants.mjs'
import { LokiDatabaseConnection } from '@sbs9642p/database'
import StopsLoader from '../lib/loader/StopsLoader.mjs'
import RouteLoader from '../lib/loader/RouteLoader.mjs'
import TripLoader from '../lib/loader/TripLoader.mjs'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const routesFile = path.join(__dirname, 'sample-data', 'routes', 'metro_lines.txt')
const agencyFile = path.join(__dirname, 'sample-data', 'routes', 'agency.txt')

const calendarFile = path.join(__dirname, 'sample-data', 'calendar', 'calendar.txt')
const calendarDatesFile = path.join(__dirname, 'sample-data', 'calendar', 'calendar_dates.txt')

const stopsFile = path.join(__dirname, 'sample-data', 'trips', 'stops.txt')
const stopTimesFile = path.join(__dirname, 'sample-data', 'trips', 'stop_times.txt')
const tripsFile = path.join(__dirname, 'sample-data', 'trips', 'trips.txt')

describe('The TripLoader class', () => {
  it('Should process the trip and add it to the database', async () => {
    let database = new LokiDatabaseConnection('test-db')
    let stops = await database.createCollection('stops')
    let routes = await database.createCollection('routes')
    let trips = await database.createCollection('gtfs timetables')

    let stopLoader = new StopsLoader(stopsFile, TRANSIT_MODES.metroTrain, database)
    await stopLoader.loadStops()

    let routeLoader = new RouteLoader(routesFile, agencyFile, TRANSIT_MODES.metroTrain, database)
    await routeLoader.loadRoutes()

    let routeIDMap = routeLoader.getRouteIDMap()

    let tripLoader = new TripLoader({
      tripsFile, stopTimesFile,
      calendarFile, calendarDatesFile
    }, TRANSIT_MODES.metroTrain, database)
    await tripLoader.loadTrips({
      routeIDMap
    })

    let trip = await trips.findDocument({ tripID: '1.T2.2-ALM-vpt-1.1.R' })
    expect(trip).to.not.be.null
  })
})