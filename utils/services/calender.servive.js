const { google } = require('googleapis');
const env = require('../../config/env')
const { v4: uuidv4 } = require('uuid')

const credentials = JSON.parse(env.GOOGLE.CALENDAR.CRED)
const GOOGLE_CALENDAR_ID = env.GOOGLE.CALENDAR.ID
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const GOOGLE_PRIVATE_KEY = credentials.private_key
const GOOGLE_CLIENT_EMAIL =   credentials.client_email
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

const addEvent = (event) => {

    event = {
        "summary": new Date().toTimeString(),
        "location": "Bhubaneswar, Odisha",
        "description": "This is a dummy description for the event.",
        "start": {
            "dateTime": "2023-09-21T09:00:00-07:00",
            "timeZone": "Asia/Kolkata",
        },
        "end": {
            "dateTime": "2023-09-22T17:00:00-07:30",
            "timeZone": "Asia/Kolkata",
        },
        // "attendees": ["beheramuktiprasad@gmail.com", "muktiprasad.dev@gmail.com"],
        // "conferenceProperties": {
        //     "allowedConferenceSolutionTypes": [
        //      "hangoutsMeet"
        //     ],
        // },
        "reminders": {
            "useDefault": false,
            "overrides": [
                { "method": "email", "minutes": 24 * 60 },
                { "method": "popup", "minutes": 10 },
            ],
        },

        // "summary": "Google calendar API test",
        // "end": {
        //     "dateTime": "2023-08-24T09:00:00-09:00"
        // },
        // "start": {
        //     "dateTime": "2023-08-24T09:00:00-08:00"
        // },
        "conferenceData": {
            "createRequest": {
                "requestId": uuidv4(),
                "conferenceSolutionKey": {
                    "type": "hangoutsMeet"
                }
            }
        },



    };


const data = {
    summary: "My first event summary",
    description: "My first event description",
    start: {
        dateTime: "2023-09-21T09:00:00-07:00",
        timeZone: "Asia/Kolkata",
    },
    end: {
        dateTime: "2023-09-21T10:00:00-07:00",
        timeZone: "Asia/Kolkata",
    },
    reminders: {
        useDefault: true,
        // overrides: [{ method: "popup" }],
    },
    attendees: [{email:"beheramuktiprasad@gmail.com"}, {email:"muktiprasad.dev@gmail.com"}],
    // sendUpdates: "none",
    conferenceData: {
        createRequest: {
            conferenceSolutionKey: {
                // "eventHangout" ,"eventNamedHangout","hangoutsMeet"  //This defines you want to make call through which service like eventHangOut or hanggoutsMeet[Google Meet]
                type: "hangoutsMeet",
            },
            requestId: uuidv4(), // A unique ID for the Meet link creation
        },
    },
};
    return new Promise((resolve, reject) => {

        calendar.events.insert({
            calendarId: GOOGLE_CALENDAR_ID,
            conferenceDataVersion: 1,
            // maxAttendees: 2,
            sendNotifications: true,
            sendUpdates: "all",
            requestBody: data,
            // resource: event,

        }, function (err, evnt) {
            if (err) {
                console.log(err)
                reject(err)
            }else{
                console.log(event)
                resolve(evnt.data)
            }
            
        })
    })




    // var event = {
    //     'summary': 'My first event!',
    //     'location': 'Hyderabad,India',
    //     'description': 'First event with nodeJS!',
    //     'start': {
    //         'dateTime': '2023-08-18T09:00:00-07:00',
    //         'timeZone': 'Asia/Dhaka',
    //     },
    //     'end': {
    //         'dateTime': '2023-08-18T17:00:00-07:00',
    //         'timeZone': 'Asia/Dhaka',
    //     },
    //     'attendees': [{"email":"muktiprasad.dev@gmail.com"}],
    //     'reminders': {
    //         'useDefault': false,
    //         'overrides': [
    //             { 'method': 'email', 'minutes': 24 * 60 },
    //             { 'method': 'popup', 'minutes': 10 },
    //         ],
    //     },
    // };
    // // const jsonkeypath=path.join(__dirname,'../../drsafehands2-327b2ac48238.json')
    // // const jsonkeypath=path.join(__dirname,'../../drsh-igg-428d3ca4bc97.json')
    // const jsonkeypath=path.join(__dirname,'../../dr-safe-hand-d437ed9acff3.json')
    // console.log(jsonkeypath)
    // const auth = new google.auth.GoogleAuth({
    //     keyFile: jsonkeypath,
    //     scopes: 'https://www.googleapis.com/auth/calendar',
    // });
    // auth.getClient().then(a => {
    //     calendar.events.insert({
    //         auth: a,
    //         calendarId: GOOGLE_CALENDAR_ID,
    //         resource: event,
    //     }, function (err, event) {
    //         if (err) {
    //             console.log('There was an error contacting the Calendar service: ' + err);
    //             return;
    //         }
    //         console.log('Event created: %s', event.data);
    //         res.jsonp("Event successfully created!");
    //     });
    // })




}


module.exports = {
    getEventList,
    addEvent
}