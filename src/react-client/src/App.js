import { Route, Routes } from "react-router-dom";

import styled from 'styled-components'
import ChatPage from "./copmonents/ChatPage";
import StartPage from './copmonents/StartPage';

const App = () => {
  return (
    <Body>
      <Routes>
        <Route path="/" element={<StartPage />}/>
        <Route path="/chat" element={<ChatPage />}/>
        </Routes>
    </Body>
  );
}

export default App;

const Body = styled.div`
  display: flex
`;