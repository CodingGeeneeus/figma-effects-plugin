import '../App.css'

export const Select = ({ effectRef }: any) => {
  console.log(effectRef)
  return (
    <label> 
      Choose An Effect:
      <select value={effectRef} onChange={effectRef}>
        <option value="gaussian-blur">Gaussian Blur</option>
        <option value="grain">Grainify</option>
        <option value="dull">Dull</option>
      </select>
    </label>
)
}
