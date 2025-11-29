import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePageComp from "./HomePageComp.tsx";

function App() {
  return (
      <Router>
          <div className="App">
              <Routes>
                  <Route path="/" element={<HomePageComp/>}/>
                  <Route path="/projects/:id" element={<HomePageComp/>}/>
              </Routes>
          </div>
      </Router>
  )
}

export default App;