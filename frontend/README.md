# catbnb
[Project here](https://airbnb-project-iiu1.onrender.com/)

## About the project
This is a clone of the popular online marketplace that connects people renting out a property with those who want to rent it, Airbnb. Catbnb was created using React, Redux, Bcrypt, Csurf, Express.js, Helmet, and Sequelize. Catbnb will allow users to view spots that are listed for rental and to view the reviews for the spots available to rent. If a user is logged in they also have the ability to create a spot or to post a review of a spot. Users are able to edit the spots they've created or to delete the spots. Users are also able to delete reviews they've written on spots.

## Setup
1. Download the project from github
2. Change directory to the folder you saved it to in the previous step
3. Type 'npm install' and press enter
4. Once the previous step is complete, type 'npm start'
5. Open a new terminal and change directory to the folder you downloaded the project to
6. Once in the project directory, change directory to the folder labeled 'frontend'
7. Type 'npm start' and enjoy! 

## Screenshots

### Landing Page
![Landing Page](https://github.com/eanorman/AirBnBProject/blob/main/frontend/public/catbnb/landing-page.png?raw=true)

### Login/Sign Up Menu
![Login Signup Modal](https://github.com/eanorman/AirBnBProject/blob/main/frontend/public/catbnb/login-signup-modal.png?raw=true)

### Login Modal
![Login Modal](https://github.com/eanorman/AirBnBProject/blob/main/frontend/public/catbnb/login-modal.png?raw=true)

### Sign Up Modal
![Sign Up Modal](https://github.com/eanorman/AirBnBProject/blob/main/frontend/public/catbnb/signupmodal.png?raw=true)

### Spot Detail Page
![Spot Detail Page](https://github.com/eanorman/AirBnBProject/blob/main/frontend/public/catbnb/spot-page.png?raw=true)

### Create Spot Page
![Create Spot Page](https://github.com/eanorman/AirBnBProject/blob/main/frontend/public/catbnb/create-spot.png?raw=true)

### Create Review Modal
![Create Review Modal](https://github.com/eanorman/AirBnBProject/blob/main/frontend/public/catbnb/review-modal.png?raw=true)

## Technical implementation details
I really had to think about how to implement the edit a spot function. The edit a spot page autofills all of the current spot information, so I needed to pull the current spot information from the backend API. I also needed to be able to update the spot pictures when editing the spot. The application will automatically delete all previously posted pictures and save the current pictures that the user has entered.


## To do
  Add AWS for images  
  Add Google Maps API  
