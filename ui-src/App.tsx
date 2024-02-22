import { useRef } from "react";
import "./App.css";
import { Select } from "./Components/Select";
import { gauss } from "./Effects/Gaussian";
import * as utils from '../Utils'

function App() {
  const inputRef = useRef<HTMLInputElement>(null);
  const effectRef = useRef("gaussian-blur")

  const onCreate = (e:any) => {
    let chosenEffect = effectRef

    const preview:HTMLCanvasElement = document.querySelector('.preview')!
    gauss(preview, 20)

    parent.postMessage( { pluginMessage: { type: 'close' } } )
  };

  const onChange = (e:any) => {
    effectRef.current = e.target.value
    console.log(effectRef.current)
  }

  const getSelection = () => {
    parent.postMessage(
      { pluginMessage: { type: "get-selection" } },
      '*'
    )
  }

  const onCancel = () => {
    parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
  };

  const renderUint8Image = async (arr:Uint8Array[], width:number, height:number) => {
    const preview:HTMLCanvasElement = document.querySelector('.preview')!;
    const ctx = preview.getContext('2d')

    const blob = new Blob([arr as unknown as BlobPart], {type: "image/png"})
    const image:HTMLImageElement = await utils.blobToPNG(blob);

    console.log(image)

    preview.width = width;
    preview.height = height;
    
    utils.resizeWin(width, height)

    ctx?.drawImage(image, 0, 0)
  }

  window.addEventListener('message', (event) => {

    console.log(event);

    const msg = event.data.pluginMessage;

    if(msg.type === 'current-selection') {

      const preview:HTMLCanvasElement = document.querySelector('.preview')!;
      const ctx = preview.getContext('2d')

      let currentSelection = msg.payload

      renderUint8Image(currentSelection, msg.width, msg.height);
    }
  })


  return (
    <main>
      <canvas className="preview" width="0" height = "0"></canvas>
      <section>
        <button id="get-selection" onClick={getSelection}>Use Current Selection</button>
      </section>

      <section>
        <Select onChange={onChange}></Select>
      </section>
      <footer>
        <button className="brand" onClick={onCreate}>
          Create
        </button>
        <button onClick={onCancel}>Cancel</button>
      </footer>
    </main>
  );
}

export default App;
