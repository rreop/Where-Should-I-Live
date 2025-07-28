import { useState } from 'react'
import cities from './data/cities.json'
import './App.css'

// QuizQuestion function to encapsulate slider and importance state

function QuizQuestion({
  label,
  min,
  max,
  initialValue,
  unit,
  importanceOptions,
  initialImportance,
  steps,
  stepLabels
}) {
  const [value, setValue] = useState(initialValue);
  const [importance, setImportance] = useState(initialImportance);

  // Snap to nearest step if steps provided
  const handleSliderChange = val => {
    let newValue = val;
    if (steps) {
      newValue = steps.reduce((prev, curr) => Math.abs(curr - val) < Math.abs(prev - val) ? curr : prev);
    }
    setValue(newValue);
  };

  return {
    value,
    importance,
    setValue: handleSliderChange,
    setImportance,
    label,
    min,
    max,
    unit,
    importanceOptions,
    steps,
    stepLabels
  };
}

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
            width: '150px',
            height: '62px',
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
        style={{ width: '400px' }}
      />
      <span style={{ marginLeft: '1rem' }}>{value}{unit}</span>
    </div>
  );
}

function App() {
  const importanceOptions = [
    { label: "Least Important", value: 25 },
    { label: "Somewhat Important", value: 37.5 },
    { label: "Important", value: 50 },
    { label: "Very Important", value: 62.5 },
    { label: "Most Important", value: 75 }
  ];

  // Create quiz questions using the QuizQuestion function
  const temperatureQuestion = QuizQuestion({
    label: "Choose your preferred average temperature:",
    min: 20,
    max: 100,
    initialValue: 60,
    unit: "°F",
    importanceOptions,
    initialImportance: 50,
    steps: [20, 40, 60, 80, 100],
    stepLabels: ["Cold", "Cool", "Temperate", "Warm", "Hot"]
  });

  const politicalQuestion = QuizQuestion({
    label: "Choose your preferred political leaning:",
    min: 0,
    max: 100,
    initialValue: 50,
    unit: "",
    importanceOptions,
    initialImportance: 50,
    steps: null,
    stepLabels: null
  });

  // Assign a score to each city based on closeness to user choices
  const scoredCities = cities.map(city => {
    const tempDiff = Math.abs(city.average_temperature - temperatureQuestion.value);
    const polDiff = Math.abs(city.political_lean - politicalQuestion.value);
    const score = ((tempDiff * temperatureQuestion.importance) + (polDiff * politicalQuestion.importance)) / 2;
    return { ...city, score };
  });

  // Sort cities by score (lower score = closer match)
  const sortedCities = scoredCities.sort((a, b) => a.score - b.score);

  return (
    <>
      <h1 className="main-header">
        Where should I live?
      </h1>

      {/* Temperature Question */}
      <SliderInput
        label={temperatureQuestion.label}
        min={temperatureQuestion.min}
        max={temperatureQuestion.max}
        value={temperatureQuestion.value}
        onChange={temperatureQuestion.setValue}
        unit={temperatureQuestion.unit}
      />
      {/* Temperature labels under the slider */}
      <div style={{ width: '400px', display: 'flex', justifyContent: 'space-between', margin: '-1.75rem 0 1.5rem 155px' }}>
        {temperatureQuestion.stepLabels.map(label => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <p>How important is this to you?</p>
      <ImportanceButtonList
        options={temperatureQuestion.importanceOptions}
        selected={temperatureQuestion.importance}
        onSelect={temperatureQuestion.setImportance}
      />

      {/* Political Question */}
      <SliderInput
        label={politicalQuestion.label}
        min={politicalQuestion.min}
        max={politicalQuestion.max}
        value={politicalQuestion.value}
        onChange={politicalQuestion.setValue}
        unit={politicalQuestion.unit}
      />
      <p>How important is this to you?</p>
      <ImportanceButtonList
        options={politicalQuestion.importanceOptions}
        selected={politicalQuestion.importance}
        onSelect={politicalQuestion.setImportance}
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
  );
}

export default App
