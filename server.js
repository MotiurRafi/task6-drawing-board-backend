const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors'); 
const boardRoutes = require('./routes/boardRoutes')

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'https://drawing-board-virid.vercel.app', 
    methods: ['GET', 'POST']
  }
});

app.use(cors({
  origin: 'https://drawing-board-virid.vercel.app',
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/api/boards', boardRoutes)


io.on('connection', (socket) => {
  console.log("User Connected")
  socket.on('join-room', (boardId) => {
    socket.join(boardId);
    console.log("joined Room", boardId)
  });

  socket.on('drawing', ({ boardId, canvasData }) => {
    console.log("broadcasting data from back", canvasData)
    socket.to(boardId).emit('drawing', { boardId, canvasData });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 5000
server.listen(PORT, ()=>{ 
    console.log(`Example app listening to port ${PORT}`)
})
