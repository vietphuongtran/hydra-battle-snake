const bodyParser = require('body-parser')
const express = require('express')
const logger = require('morgan')
const app = express()
const {
  fallbackHandler,
  notFoundHandler,
  genericErrorHandler,
  poweredByHandler
} = require('./handlers.js')

// For deployment to Heroku, the port needs to be set using ENV, so
// we check for the port number in process.env
app.set('port', (process.env.PORT || 9001))

app.enable('verbose errors')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(poweredByHandler)

// --- SNAKE LOGIC GOES BELOW THIS LINE ---

//  This function is called everytime your snake is entered into a game.
//  cherrypy.request.json contains information about the game that's about to be played.
// TODO: Use this function to decide how your snake is going to look on the board.
app.post('/start', (request, response) => {
  console.log("START");

  // Response data
  const data = {
    color: '#6EAE00',
    headType: "beluga",
    tailType: "small-rattle"
  }

  return response.json(data)
})

// This function is called on every turn of a game. It's how your snake decides where to move.
// Valid moves are "up", "down", "left", or "right".
// TODO: Use the information in cherrypy.request.json to decide your next move.
app.post('/move', (request, response) => {
    var data = request.body;

//Spin in circle
    const { turn } = data;
    const spinInCircles = () => {
        const possibleMoves = ["up", "right", "down", "left"];
        return possibleMoves[turn % 4 ]; //go up then turn right, then go down turn left
    };
    
    const snakeMove = spinInCircles();
//Dodge out of bound
//    const { turn } = data;
//    const dodgeBound = () => {
//        if (y == 0) {
//            const posibleMoves = ["right"];
//            return possibleMoves[turn % 1 ];
//        }
//        else if (x == 0 || y == 11) {
//            const posibleMoves = ["left"];
//            return possibleMoves[turn % 1 ];
//        }
//        else {
//            const possibleMoves = ["up", "right", "down", "left"];
//            return possibleMoves[turn % 4 ];
//        }
//        
//    };
//    const snakeMove = dodgeBound();
//Zig Zag mover
//    const { turn } = data;
//    const zigZagMove = () => {
//        const possibleMoves = ["up", "right", "right", "down", "down", "left", "down", "right", "right", "up", "up"];
//        return possibleMoves[turn % 10 ]; //go up then turn right, then go down turn left
//    };
//    
//    const snakeMove = zigZagMove();

//Choose a random direction to move in
//  possible_moves = ["up", "down", "left", "right"]
//  var choice = Math.floor(Math.random() * possible_moves.length);
//  var snake_move = possible_moves[choice];
//
    //const snakeMove = 'right';
    console.log("MOVE: " + snakeMove);
   
  return response.json({ move: snakeMove })
})

// This function is called when a game your snake was in ends.
// It's purely for informational purposes, you don't have to make any decisions here.
app.post('/end', (request, response) => {
  console.log("END");
  return response.json({ message: "ok" });
})

// The Battlesnake engine calls this function to make sure your snake is working.
app.post('/ping', (request, response) => {
  return response.json({ message: "pong" });
})

// --- SNAKE LOGIC GOES ABOVE THIS LINE ---

app.use('*', fallbackHandler)
app.use(notFoundHandler)
app.use(genericErrorHandler)

app.listen(app.get('port'), () => {
  console.log('Server listening on port %s', app.get('port'))
})
