Single Page Application - June 2017

Made a database backed website that featured AJAX interaction using NodeJS. The website featured a form that submitted information as an AJAX GET request to insert into a MySQL database. Using Express on the server side for the route handlers, a JSON object containing the information from the database was sent back as the response. The JSON object response was used to update a table on the webpage using Javascript, HTML, and dynamic update of DOM elements. The table also had update and delete buttons on each row. These buttons had event handlers to send AJAX requests to update information in that row or delete the whole row. The server side had route handlers with GET methods to insert, update, delete, reset table, and show the table. 

Directory structure:  
├── workout.js
└── views
    ├── home.handlebars
    ├── 404.handlebars
    ├── 500.handlebars
    └── layouts
        └── main.handlebars
└── public
    ├── ajax.js
