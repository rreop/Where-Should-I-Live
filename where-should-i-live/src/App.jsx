
import { useState } from 'react'
import cities from './data/cities.json'
import './App.css'


// Reusable ImportanceButtonList component
function ImportanceButtonList({ options, selected, onSelect }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', marginBottom: '2rem' }}>
      {options.map(option => (
        <button
          key={option.value}
          style={{
            background: selected === option.value ? '#cce5cc' : '',
            marginBottom: '0.5rem',
            width: '200px',
            textAlign: 'center'
          }}
          onClick={() => onSelect(option.value)}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

// Reusable SliderInput component
function SliderInput({ label, min, max, value, onChange, unit }) {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <h2>{label}</h2>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
      />
      <span style={{ marginLeft: '1rem' }}>{value}{unit}</span>
    </div>
  );
}

function App() {
  const [count, setCount] = useState(0)
  const [temperature_slider_value, set_temperature_slider_value] = useState(50) // initial value
  const [political_slider_value, set_political_slider_value] = useState(50) // initial value
  const [temperature_importance, set_temperature_importance] = useState(50) // default to 'Important'
  const [political_importance, set_political_importance] = useState(50) // default to 'Important'

  const importanceOptions = [
    { label: "Least important", value: 25 },
    { label: "Somewhat important", value: 37.5 },
    { label: "Important", value: 50 },
    { label: "Very important", value: 62.5 },
    { label: "Most important", value: 75 }
  ]
  
  // Assign a score to each city based on closeness to user choices
  const scoredCities = cities.map(city => {
    const tempDiff = Math.abs(city.average_temperature - temperature_slider_value);
    const polDiff = Math.abs(city.political_lean - political_slider_value);
    const score = ((tempDiff * temperature_importance) + (polDiff * political_importance)) / 2;
    return { ...city, score };
  });

  // Sort cities by score (lower score = closer match)
  const sortedCities = scoredCities.sort((a, b) => a.score - b.score);

  return (
    <>
      <h1 className="main-header">
        Where should I live?
      </h1>
      
      <SliderInput
        label="Choose your preferred average temperature:"
        min={0}
        max={100}
        value={temperature_slider_value}
        onChange={set_temperature_slider_value}
        unit="°F"
      />

      <p>How important is this to you?</p>
      <ImportanceButtonList
        options={importanceOptions}
        selected={temperature_importance}
        onSelect={set_temperature_importance}
      />

      <SliderInput
        label="Choose your preferred political leaning:"
        min={0}
        max={100}
        value={political_slider_value}
        onChange={set_political_slider_value}
        unit=""
      />

      <p>How important is this to you?</p>
      <ImportanceButtonList
        options={importanceOptions}
        selected={political_importance}
        onSelect={set_political_importance}
      />


      <h2>City List</h2>
      <ol>
        {sortedCities.map(city => (
          <li key={city.name}>
            {city.name} (Avg Temp: {city.average_temperature}°F) 
                        (Political lean: {city.political_lean}) 
          </li>
        ))}
      </ol>
      
    </>
  )
}

export default App
