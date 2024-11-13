import { LokiDatabaseConnection } from '@sbs9642p/database'
import RouteLoader from '../lib/loader/RouteLoader.mjs'
import GTFSAgencyReader from '../lib/gtfs-parser/GTFSAgencyReader.mjs'

import path from 'path'
import url from 'url'
import { expect } from 'chai'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const routesFile = path.join(__dirname, 'sample-data', 'routes', 'regional_bus_routes.txt')
const agencyFile = path.join(__dirname, 'sample-data', 'routes', 'agency.txt')

describe('The GTFS Agency Reader', () => {
  it('Should read the agencies one line at a time', async () => {
    let reader = new GTFSAgencyReader(agencyFile)
    await reader.open()
    let operator = await reader.getNextAgency()

    expect(operator.id).to.equal('43')
    expect(operator.name).to.equal('CDC Ballarat')
    expect(operator.website).to.equal('https://www.ptv.vic.gov.au/footer/customer-service/operator-contact-details/?utm_source=open_data_click_agency&utm_medium=open_data_agency_click&utm_campaign=open_data_click')
    expect(operator.phone).to.equal('1800 800 007')
  })
})

describe('The GTFS Routes Loader', () => {
  it('Should process the routes and add them to the database', async () => {
    let database = new LokiDatabaseConnection('test-db')
    let routes = await database.createCollection('routes')

    let loader = new RouteLoader(routesFile, agencyFile, 'bus', database)
    await loader.loadRoutes()

    let bal10 = await routes.findDocument({
      routeGTFSID: '6-10x'
    })

    expect(bal10).to.not.be.null
    expect(bal10.routeNumber).to.equal('10')
    expect(bal10.operators).to.equal(['Christians Bus Company (Bendigo)'])
  })
})