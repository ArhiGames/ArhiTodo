import BoardHeader from "./BoardHeader.tsx";
import BoardComp from "./BoardComp.tsx";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
      <Router>
          <div className="App">
              <Routes>
                  <Route path="/" element={<BoardComp boardId={3}/>}/>
              </Routes>
              <BoardHeader/>
              <BoardComp boardId={3}></BoardComp>
          </div>
      </Router>
  )
}

export default App;