# PangTing

Pangting centralizes course information from National Taiwan University and online learning platform Coursera. 

# table of Contents

* [Technologies](#technologies)
* [Structure](#structure)
* [Database design](#database-design)
* [Technique](#special-technique)
* [Test Account](#test-account)

# Technologies

**Design Concept**
* MVC
* RESTful API

**Language**
* SQL
* JavaScript
* C++

**Back-End**
* Node.js
* Express
* Framework

**Front-End**
* HTML
* CSS

**Tool**
* Linux
* Line bot
* Discord bot
* Chrome extension
* Git/GitHub

# Structure
![Structure screenshot](https://user-images.githubusercontent.com/42135910/123694880-77b05d00-d88c-11eb-9591-c47ef0b56d6f.jpeg)


# Database design
* Databases for the present
![MySQL databses](https://user-images.githubusercontent.com/42135910/123694610-1daf9780-d88c-11eb-8a7b-93bb69300908.jpeg)

* Database optimization
![MySQL databses](https://user-images.githubusercontent.com/42135910/123694601-1c7e6a80-d88c-11eb-8d46-81f8d9cf5fec.jpeg)

# Features
![web gif](https://user-images.githubusercontent.com/42135910/123697012-03c38400-d88f-11eb-9b76-ce154259650c.gif)


**Features ready**

* Course info
    * Course detail
        * name
        * department
        * professor
        * content
        * source

    * Course recommend
        * top 10 similar course 
        * translate english to recommend
    * Course mark
    * other user message

* Course interaction
   * Grade the course
   * add collect
   * leave comments and delete it

* admin account
    * control web crawler
    * Management courses
    * Supervise all account
    * Review message

* To-do features
    * Front-end optimization
    * Databases optimization
    * Insert more universities


# Special Technique

* recommend
    * model: TF-IDF
    * date: course content
    * difficult: The class language are different, Before recommend, have to using google-translate api to unified language, that spent lot of time. Recommend courses are spent lot of time too. O(n) + 10*O(n)^2

* web crawler
    * tool: fetch, cheerio
    * method: API, HMTL
    * HMTL description: catch the universities coruses in Taiwan, there has a problem about 'text', becouse big5. When getting the HTML, it will become garbled. I'm use 'JavsScript text doctor' to decoding HMTL.
    * API description: when I catch the coursera HTML, It was very hardful to decode, Totally unable to catch the point about courses data, So I'm using fetch to request courses data.

* auto execution
    * control method: Databases, Express API, Node-corn
    * Use node-corn automatic start function to update courses. From client admin account can use api to control datebases, when function are runing it will keep listen databases status.
![auto_work](https://user-images.githubusercontent.com/42135910/123694588-17b9b680-d88c-11eb-9ba5-c1f0511c1438.jpeg)

# Test Account

* Normal user
    * Account 1
        * emal: user1
        * password: 123456

    * Account 2
        * emal: user2
        * password: 123456
    
    * Account 3
        * emal: user3
        * password: 123456

    * Account 4
        * emal: user4
        * password: 123456

* Admin user
    * Introduction: this account can vary simple to edit courses 、 blockade the account 、 update mark and courses on this website.
    * Admin Account
        * email: admin
        * password: admin
