import { useState } from 'react'
import cities from './data/cities.json'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [temperature_slider_value, set_temperature_slider_value] = useState(50) // initial value
  const [political_slider_value, set_political_slider_value] = useState(50) // initial value
  
const sortedCities = [...cities].sort(
  (a, b) => {
    const aAvg = (
      Math.abs(a.average_temperature - temperature_slider_value) +
      Math.abs(a.political_lean - political_slider_value)
    ) / 2;
    const bAvg = (
      Math.abs(b.average_temperature - temperature_slider_value) +
      Math.abs(b.political_lean - political_slider_value)
    ) / 2;
    return aAvg - bAvg;
  }
);

  return (
    <>
      {/*<div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>*/}
      
      <h1 className="main-header">
        Where should I live?
      </h1>
      
      <h2>Choose your preferred average temperature:</h2>
      <input
        type="range"
        min={0}
        max={100}
        value={temperature_slider_value}
        onChange={e => set_temperature_slider_value(Number(e.target.value))}
      />
      <span style={{ marginLeft: '1rem' }}>{temperature_slider_value}°F</span>


      <h2>Choose your preferred political leaning:</h2>
      <input
        type="range"
        min={0}
        max={100}
        value={political_slider_value}
        onChange={e => set_political_slider_value(Number(e.target.value))}
      />
      <span style={{ marginLeft: '1rem' }}>{political_slider_value}</span>

      <h2>City List</h2>
      <ol>
        {sortedCities.map(city => (
          <li key={city.name}>
            {city.name} (Avg Temp: {city.average_temperature}°F) (Political lean: {city.political_lean}) (Average: ({city.average_temperature} + {city.political_lean} / 2))
          </li>
        ))}
      </ol>
      
    </>
  )
}

export default App
