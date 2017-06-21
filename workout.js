var express = require('express');
var mysql = require('./dbcon.js');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 53517);
app.use(express.static('public'));
 
 //returns a blob of JSON back to client side
app.get('/',function(req,res,next){
  var context = {};
  mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }

    context.results = rows;
    res.render('home', context);

  });
});

app.get('/show-table',function(req,res,next){
  var context = {};
  mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }

    context.results = rows;

    res.send(rows);
  });
});

app.get('/get-row',function(req,res,next){
  var context = {};
  mysql.pool.query('SELECT * FROM workouts WHERE id=?', [req.query.id], function(err, rows, fields){
    if(err){
      next(err);
      return;
    }

    context.results = rows;

    res.send(rows);
  });
});

app.get('/insert',function(req,res,next){

  mysql.pool.query("INSERT INTO workouts (`name`, `reps`, `weight`, `date`, `unit`) VALUES (?, ?, ?, ?, ?)", ([req.query.name,req.query.reps,req.query.weight,req.query.date,req.query.unit]), function(err, result){
    if(err){
      next(err);
      return;
    }
	  
    res.send(result);
  });
});


app.get('/delete',function(req,res,next){
  mysql.pool.query("DELETE FROM workouts WHERE id=?", [req.query.id], function(err, result){
    if(err){
      next(err);
      return;
    }
    res.send(result);
  });
});

///safe-update?id=1&name=The+Task&done=false
app.get('/update',function(req,res,next){
  mysql.pool.query("SELECT * FROM workouts WHERE id=?", [req.query.id], function(err, result){
    if(err){
      next(err);
      return;
    }
    if(result.length == 1){
      var curVals = result[0];
      mysql.pool.query("UPDATE workouts SET name=?, reps=?, weight=?, date=?, unit=? WHERE id=? ",
        [req.query.name || curVals.name, req.query.reps || curVals.reps, req.query.weight || curVals.weight, req.query.date || curVals.date, req.query.unit || curVals.unit, req.query.id],
        function(err, result){
        if(err){
          next(err);
          return;
        }
        res.send(result);
      });
    }
  });
});


app.get('/reset-table',function(req,res,next){
  var context = {};
  mysql.pool.query("DROP TABLE IF EXISTS workouts", function(err, rows, field){
    var createString = "CREATE TABLE workouts(" +
    "id INT PRIMARY KEY AUTO_INCREMENT," +
    "name VARCHAR(255) NOT NULL," +
    "reps INT," +
    "weight INT," +
	"date DATE," +
	"unit BOOLEAN)";
    mysql.pool.query(createString, function(err){
      context.results = "Table reset";
      // res.render('home',context);
      res.send(rows);
    })
  });
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
