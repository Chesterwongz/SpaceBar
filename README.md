# Orbital Apollo II Project Management Website

![banner](spacebar/public/logo.png)

[![standard-readme compliant](https://img.shields.io/badge/standard--readme-OK-green.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

Due to the COVID-19, workers who never thought of working from home have now found themselves in the new reality of remote work. This paradigm shift can be especially jarring for teams accustomed to the traditional methods of project management. The looming question on the minds of project managers as they navigate this new normal has become, “How can I still meet project goals with my team now working remotely?” Although working as a team remotely can be challenging, it certainly is not impossible. Furthermore, managing a team online need not be difficult at all as most (if not all) project management tasks can be done in the comfort of one’s home!

To facilitate remote teamwork by developing an online visual collaboration tool that enables users to organize projects in an easy, flexible, and efficient manner. Furthermore, we hope to foster a workplace culture online which encourages creativity and promotes productivity through innovative features, informative analytics, and a fun and inclusive UX/UI. This is our own take on a project management application, inspired by the success of applications like Jira, Trello and ZenHub. No more excuses for overlooking deadlines and issues!

- [Website Link](http://spacebar-1a6ff.web.app)

## Table of Contents

- [Technologies](#technologies)
- [Setup](#setup)
- [Deployment](#deployment)
- [Contributors](#contributors)

## Technologies

This project is created with:

- ReactJS
- Material UI
- Firebase (deployment)

## Setup

To run this repository, git clone it to your local environment.

1. cd into spacebar, and key in "yarn install" to install all dependencies for the project.
2. Type 'yarn start' in the terminal to run the website.

## Deployment

1. Download the Firebase CLI by keying in: 
  yarn global add firebase-tools 
  export PATH="$(yarn global bin):$PATH" 
2. Log into Firebase account by keying in:  
  firebase login 
3. Initialise settings by keying in:
  firebase init hosting 
  - Select Firebase project to connect to 
  - Specify public root directory as "build" instead of public 
  - When prompted whether to overwrite index.html file, type "N"
  - When prompted whether to make a Single-page app, type "Y" 
 4. Build optimized React app by keying in: 
  yarn run build 
 5. Deploy app by keying in: 
  firebase deploy 

## Contributors

- [@Chesterwongz](https://github.com/Chesterwongz)
- [@ryantanjh](https://github.com/ryantanjh)
