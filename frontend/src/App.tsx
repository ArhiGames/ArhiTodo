import BoardHeader from "./BoardHeader.tsx";
import BoardComp from "./BoardComp.tsx";

function App() {
  return (
    <div className="App">
        <BoardHeader/>
        <BoardComp boardId={1}></BoardComp>
    </div>
  )
}

export default App