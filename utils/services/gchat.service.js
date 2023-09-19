const { google } = require('googleapis');
const chat = google.chat('v1');
const env = require('../../config/env')
const { v4: uuidv4 } = require('uuid')

const credentials = JSON.parse(env.GOOGLE.CALENDAR.CRED)
const GOOGLE_CALENDAR_ID = env.GOOGLE.CALENDAR.ID
const SCOPES = ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/calendar.events'];
const GOOGLE_PRIVATE_KEY = credentials.private_key
const GOOGLE_CLIENT_EMAIL = credentials.client_email
const GOOGLE_PROJECT_NUMBER = credentials.project_no


const jwtClient = new google.auth.GoogleAuth({
  scopes:SCOPES,
  credentials:credentials
});
