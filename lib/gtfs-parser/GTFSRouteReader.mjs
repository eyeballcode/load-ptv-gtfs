import GTFSRoute from './GTFSRoute.mjs'
import CSVLineReader from './line-reader.mjs'

export default class GTFSRouteReader {
 
  /** @type {string} */
  #file
  #reader

  constructor(file) {
    this.#file = file
    this.#reader = new CSVLineReader(file)
  }

  /**
   * Opens the underlying `CSVLineReader`
   */
  async open() {
    await this.#reader.open()
  }

  /**
   * Checks if there are more routes available for reading
   * 
   * @returns {boolean} Returns true if there are more routes available
   */
  available() {
    return this.#reader.available()
  }

  /**
   * Gets the data of the next route in the file.
   * 
   * @returns {Promise<GTFSRoute>} The data of the next route
   */
  async getNextRoute() {
    return GTFSRouteReader.processRoute(await this.#reader.nextLine())
  }

  /**
   * Converts a CSV row into a route object
   * 
   * @param {object} data A JSON object containing the following fields:
   * - routeGTFSID: The route ID
   * - agencyID: The route agency ID
   * - routeNumber: The route number, or empty if it does not exist
   * - routeName: The route name
   * 
   * @returns {GTFSRoute} An object representing the route data
   */
  static processRoute(data) {
    let routeData = {
      routeGTFSID: data.route_id,
      agencyID: data.agency_id,
      routeNumber: data.route_short_name,
      routeName: data.route_long_name
    }

    return GTFSRoute.create(routeData)
  } 
}