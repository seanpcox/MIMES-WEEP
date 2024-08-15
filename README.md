# M I M E S W E E P
## Instructions
  * Reveal all squares that do not hide a mime. 
  * Adapted for mobile, tablet, and desktop. 
  * Try on Easy, Medium, Hard, or make your own level.
  * Play Now for Free: [mimesweep.com](https://www.mimesweep.com/)

## Controls
  * Left Click or Tap: Reveal a square
  * Right Click or Long Press: Place or remove a flag
  * Flag Toggle Button: Place or remove a flag with left click

## Tips
  * A number on a revealed square indicates how many neighboring squares have hidden mimes.
  * The initial count on the flag toggle button shows the number of mimes hidden on the board.
  * Place flags on squares you suspect of hiding a mime to avoid revealing them by mistake.
  * On mobile or tablet, use the edge of your screen when scrolling to avoid accidentally revealing a square.

## Screenshots

#### Mobile
<img width="500" alt="Screenshot 2024-08-13 at 12 12 31 AM" src="https://github.com/user-attachments/assets/393bddaa-1b53-4b2b-8936-a7ef71001743">

#### Desktop
<img width="1103" alt="Screenshot 2024-08-12 at 9 54 31 PM" src="https://github.com/user-attachments/assets/8135e507-77f6-4d91-9db4-4d7929dce2c1">

## Build, Install, & Launch Commands

Build: `npm run build`

Install: `npm install`

Launch: `npm start`

Notes: 
  * Requires node package manager, npm, to be installed locally, see Notes section below for more details.
  * Append `--legacy-peer-deps` to the commands if a failure occurs due to old dependencies.

## Notes
* Developed on a 2021 Macbook Pro with an Apple M1 Max chip running Mac OS 14.4.1
* Tested on Mac & Windows Desktop, iPad, iPhone, and Android Phone
* Code was developed in Visual Studio Code version 1.92.0
* NPM version 10.8.2 was used to create React project and download requirements, such as Material UI, ESLint, and Amplify
* React version 11.13.0 was used with Material UI version 5.16.6
* Code was lint checked using ESLint version 9.7.0
* Device detection provided by react-device-detect version 2.0.0
* App is hosted on AWS Amplify and constains local libraries, Amplify version 6.4.3, to enable this intergration
* See package.json in root folder for more package information
* A goal was to see if all state could be contained in-place in a 2D array, otherwise an object would have been used
* IOS devices do not support onContextMenu triggers (long-press on Android) so custom implemention was required
