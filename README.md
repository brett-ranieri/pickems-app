# Pickem's App

Web app built with React on Next.js with a SQL database and hosted on Vercel

## Project Description

Using the Next.js framework, I built a React site that my friends and I could use to pick the winners of upcoming NFL games. I used PostgreSQL and ElephantSQL to host a small database that saves all user picks as well as data recevied from a free ESPN API about all the upcoming games.

## How to get the project running

Development:

- Navigate to root folder in terminal
- Run the following: `npm run dev`
- In browser, navigate to http://localhost:3000/

Production:

- Navigate to following URL in any browser:
  https://pickems-app.vercel.app/

## Development Dependencies

- "autoprefixer": "^10.4.16"
- "postcss": "^8.4.31"
- "tailwindcss": "^3.3.5"

## Project Dependencies

- "@opentelemetry/api": "^1.7.0",
- "next": "latest",
- "pg": "^8.11.3",
- "react": "18.2.0",
- "react-dom": "18.2.0"

## Tools and Features to Highlight

**Data retrieved from ESPN API**

- All data pertinent to NFL teams/scheduled is fetched from a free ESPN API
- Currently, I need to manually hit endpoints in order to populate data (including loading scheduled games and determining winners). 

**User can submit/updated picks**

- Users have the ability to submit picks for each game.
- Users can re-submit picks, which are then checked, if pick was submitted before it is deleted from database and resubmitted. 

**Scores are automatically calculated**

- Scores are calculated and displayed in comparison to all other users on the Scores tab
- More featues to be added here...stay tuned!

