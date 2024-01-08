import { RecoilEnv, RecoilRoot } from 'recoil';
import './App.css';
import { Board } from './Board';
import { HelpModalButton } from './HelpModal';
import { Sidebar } from './Sidebar';
import { KeyboardListener } from './state';

if (process.env.NODE_ENV === 'development') {
  // disables spammy duplicate atom key checking warnings triggered by hot reload
  RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false;
}

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
