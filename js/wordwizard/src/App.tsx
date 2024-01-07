import { RecoilRoot } from 'recoil';
import './App.css';
import { Board } from './Board';
import { HelpModalButton } from './HelpModal';
import { Sidebar } from './sidebar';
import { KeyboardListener } from './state';

function App() {
  return (
    <RecoilRoot>
      <KeyboardListener />
      <div className="flex w-screen h-screen bg-black overflow-hidden">
        <Sidebar />
        <Board />
        <HelpModalButton />
      </div>
    </RecoilRoot>
  );
}

export default App;
