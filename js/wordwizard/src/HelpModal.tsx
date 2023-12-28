// ########################
// ##### HELP MODAL
// ########################

import { useRecoilState, useRecoilValue } from 'recoil';
import { helpModalOpenState, keyboardLayoutState, keymapState } from './state';

export function HelpModalButton() {
  const [helpModalOpen, setHelpModalOpen] = useRecoilState(helpModalOpenState);
  return (
    <div className="fixed bottom-0 right-0 p-3 flex flex-col items-end">
      <button
        className="rounded-full cursor-pointer bg-gray-400 border-black border-2 w-8 h-8 font-bold"
        onClick={() => setHelpModalOpen(!helpModalOpen)}
      >
        ?
      </button>
    </div>
  );
}

export function HelpModal() {
  return (
    <div className="bg-gray-400 p-3 rounded-lg border-2 border-black overflow-x-auto w-full">
      <Keyboard />
    </div>
  );
}

export function Keyboard() {
  const keyboardLayout = useRecoilValue(keyboardLayoutState);
  const keymap = useRecoilValue(keymapState);
  return (
    <div className="flex flex-col items-center space-y-2 > *">
      {keyboardLayout.map((row) => (
        <div className="flex space-x-2 > *">
          {row.map((key) => (
            <div className="w-24 h-24 bg-gray-200 text-lg border border-black rounded-md flex flex-col items-center p-2">
              {key.character}
              <div className="flex-grow" />
              {keymap.has(key.character.toLowerCase()) ? (
                <div className="text-xs text-center leading-tight">
                  {keymap.get(key.character.toLowerCase())?.replaceAll('-', ' ')}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
