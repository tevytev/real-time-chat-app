import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import io from 'socket.io-client';

const socket = io('http://localhost:3000/', { transports : ['websocket'] });

function test() {
  let count = 1;
  const interval = setInterval(() => {
      console.log(count++);
      if (count == 10) clearInterval(interval);
  }, 11000);
  setTimeout(() => {
      socket.emit("joinRoom", "67675390bb53a376a773d025");
      socket.emit(
        "message",
        "67675390bb53a376a773d025",
        "Hey this is a message that I sent to the room!"
      );
    }, 10000);
}

// test();

function App() {
  const [count, setCount] = useState(0);

  const socket = io('http://localhost:3000/', { transports : ['websocket'] });
  socket.emit("joinRoom", "67675390bb53a376a773d025");

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
        <input id='message' type="text" />
        <input onClick={() => {
          const message = document.getElementById("message").value;
          console.log(message);
          socket.emit(
            "message",
            "67675390bb53a376a773d025",
            message
          );
          
        }} type="submit" />
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
