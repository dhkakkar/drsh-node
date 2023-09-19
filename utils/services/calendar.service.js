const { google } = require('googleapis');
const env = require('../../config/env')
const { v4: uuidv4 } = require('uuid')

const credentials = JSON.parse(env.GOOGLE.CALENDAR.CRED)
const GOOGLE_CALENDAR_ID = env.GOOGLE.CALENDAR.ID
const SCOPES =  [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.events",
]
const GOOGLE_PRIVATE_KEY = credentials.private_key
const GOOGLE_CLIENT_EMAIL = credentials.client_email
const GOOGLE_PROJECT_NUMBER = credentials.project_no


const jwtClient = new google.auth.JWT(
  GOOGLE_CLIENT_EMAIL,
  null,
  GOOGLE_PRIVATE_KEY,
  SCOPES,
  "admin@cluenut.com"
);


const calendar = google.calendar({
  version: 'v3',
  auth: jwtClient
});

const getEventList = () => {
  return new Promise((resolve, reject) => {
    calendar.events.list({
      calendarId: GOOGLE_CALENDAR_ID,
      timeMin: (new Date()).toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    }, (error, result) => {
      if (error) {
        // res.send(JSON.stringify({ error: error }));
        reject(error)
      } else {
        if (result.data.items.length) {
          console.log(result.data.items)
          resolve(result.data.items)
          // res.send(JSON.stringify({ events: result.data.items }));
        } else {
          resolve([])
        }
      }
    });
  })

}

const addEvent = (data) => {
  return new Promise((resolve, reject)=>{
    calendar.events.insert({
      calendarId: GOOGLE_CALENDAR_ID,
      conferenceDataVersion: 1,
      // maxAttendees: 2,
      sendNotifications: true,
      sendUpdates: "all",
      requestBody: data,

  }, function (err, evnt) {
      if (err) {
          console.log(err)
          reject(err)
      }else{
          resolve(evnt.data)
      }
      
  })
  
  })

}

const deleteEvent = (data)=>{
  return new Promise((resolve, reject)=>{
    calendar.events.delete({
      
    })
  })
}

module.exports = {
  getEventList,
  addEvent
}