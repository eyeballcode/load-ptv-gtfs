import { expect } from 'chai'
import GTFSCalendarReader from '../lib/gtfs-parser/readers/GTFSCalendarReader.mjs'
import GTFSCalendar from '../lib/gtfs-parser/GTFSCalendar.mjs'
import GTFSCalendarDate from '../lib/gtfs-parser/GTFSCalendarDate.mjs'
import path from 'path'
import url from 'url'
import { CALENDAR_DATES } from '../lib/constants.mjs'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const calendarFile = path.join(__dirname, 'sample-data', 'calendar', 'calendar.txt')

describe('The GTFSCalendar class', () => {
  it('Should process the calendar data to a list of operation days', () => {
    expect(new GTFSCalendar({
      id: 'T1',
      startDay: '20241122',
      endDay: '20241129',
      daysOfWeek: ["0","0","0","0","1","1","0"]
    }).getOperationDays()).to.have.members([
      "20241122", "20241123", "20241129"
    ])

    expect(new GTFSCalendar({
      id: 'T2',
      startDay: '20241123',
      endDay: '20241130',
      daysOfWeek: ["1","1","1","1","1","0","0"]
    }).getOperationDays()).to.have.members([
      "20241125", "20241126", "20241127", "20241128", "20241129"
    ])
  })

  it('Be inclusive of the end date', () => {
    expect(new GTFSCalendar({
      id: 'T1',
      startDay: '20241122',
      endDay: '20241122',
      daysOfWeek: ["1","1","1","1","1","1","1"]
    }).getOperationDays()).to.have.members([
      "20241122"
    ])
  })

  it('Should allow adding of an extra date into the calendar', () => {
    let cal = new GTFSCalendar({
      id: 'T1',
      startDay: '20241122',
      endDay: '20241122',
      daysOfWeek: ["1","1","1","1","1","1","1"]
    })
    
    cal.processCalendarDate(new GTFSCalendarDate({
      id: 'T1',
      date: '20241125',
      type: CALENDAR_DATES.ADDED
    }))

    expect(cal.getOperationDays()).to.have.members([
      "20241122", "20241125"
    ])
  })

  it('Should allow removing of a specific date into the calendar', () => {
    let cal = new GTFSCalendar({
      id: 'T1',
      startDay: '20241224',
      endDay: '20241226',
      daysOfWeek: ["1","1","1","1","1","1","1"]
    })
    
    cal.processCalendarDate(new GTFSCalendarDate({
      id: 'T1',
      date: '20241225',
      type: CALENDAR_DATES.REMOVED
    }))

    expect(cal.getOperationDays()).to.deep.equal([
      "20241224", "20241226"
    ])
  })
})

describe('The GTFSCalendarDate class', () => {
  it('Should convert the CSV data into a proper date object', () => {
    expect(new GTFSCalendarDate({
      id: 'T6',
      date: '20241125',
      type: CALENDAR_DATES.ADDED
    }).date.toUTC().toISO()).to.equal('2024-11-24T13:00:00.000Z')
  })
})