import GTFSStop from './GTFSStop.mjs'
import CSVLineReader from './line-reader.mjs'

export default class GTFSStopsReader {
 
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
   * Checks if there are more stops available for reading
   * 
   * @returns {boolean} Returns true if there are more stops available
   */
  available() {
    return this.#reader.available()
  }

  /**
   * Gets the data of the next stop in the file.
   * 
   * @returns {Promise<GTFSStop>} The stop data of the next stop
   */
  async getNextStop() {
    return GTFSStopsReader.getStop(await this.#reader.nextLine())
  }

  static getStop(data) {
    return new GTFSStop(
      data.stop_id,
      data.stop_name,
      data.stop_lat,
      data.stop_lon
    )
  }
}