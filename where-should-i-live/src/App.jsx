import { useState } from 'react'
import cities from './data/cities.json'
import './App.css'

// Slider component for each question
function Slider({ 
  sliderMinimum = 0, 
  sliderMaximum = 100,
  value,
  setValue
}) {
  return (
    <div>
      <input
        type="range"
        min={sliderMinimum}
        max={sliderMaximum}
        value={value}
        onChange={e => setValue(Number(e.target.value))}
        style={{ width: '400px' }}
      />
      <span style={{ marginLeft: '1rem', fontWeight: 'bold', color: '#14532d' }}>{value}</span>
    </div>
  );
}

// Importance selector for each question
function ImportanceList({ selected, setSelected }) {
  const options = [
    "Least Important",
    "Somewhat Important",
    "Important",
    "Very Important",
    "Most Important"
  ];

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h2 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}> How important is this to you? </h2>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
        {options.map(label => (
          <button
            key={label}
            onClick={() => setSelected(label)}
            style={{
              width: '150px',
              height: '62px',
              textAlign: 'center',
              marginRight: '0.5rem',
              background: selected === label ? '#cce5cc' : ''
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

// QuizQuestion as a function that returns an object with state and render method
function createQuizQuestion(label, question_minimum, question_maximum) {
  const useQuizQuestion = () => {
    const [sliderValue, setSliderValue] = useState((question_minimum + question_maximum) / 2);
    const [importance, setImportance] = useState("Important");
    // TODO: fix this...
    var importanceValue = 1;
    if (importance === "Least Important") importanceValue = 0.2;
    else if (importance === "Somewhat Important") importanceValue = 0.4;
    else if (importance === "Important") importanceValue = 0.6;
    else if (importance === "Very Important") importanceValue = 0.8;
    else if (importance === "Most Important") importanceValue = 1;    

    const render = () => (
      <>
        <h2 style={{ fontSize: '2rem', color: '#14532d', fontWeight: 'bold', marginBottom: '1rem', marginTop: '4rem' }}>{label}</h2>
        <Slider
          sliderMinimum={question_minimum}
          sliderMaximum={question_maximum}
          value={sliderValue}
          setValue={setSliderValue}
        />
        <ImportanceList 
          selected={importance} 
          setSelected={setImportance}           
        />
      </>
    );
    return { sliderValue, importanceValue, importance, render };
  };
  return useQuizQuestion;
}

// Create questions as instances of QuizQuestion
const questionHooks = [
  createQuizQuestion("What is your ideal temperature?", 0, 100),
  createQuizQuestion("What is your preferred political lean?", 0, 100)
];

function App() {
  // Call each question hook to get state and render function
  const questionStates = questionHooks.map(hook => hook());

  // Score cities based on user preferences
  const scoredCities = cities.map(city => {
    const tempDiff = Math.abs(city.average_temperature - questionStates[0].sliderValue);
    const polDiff = Math.abs(city.political_lean - questionStates[1].sliderValue);
    const score = ((tempDiff * questionStates[0].importanceValue) + (polDiff * questionStates[1].importanceValue)) / 2;
    return { ...city, score };
  });

  // Sort cities by score
  const sortedCities = scoredCities.sort((a, b) => a.score - b.score);


  return (
    <>
      <h1 className="main-header">
        Where should I live?
      </h1>

      {/* Questions */}
      {questionStates.map((question, index) => (
        <div key={index}>{question.render()}</div>
      ))}

      {/* Debugging */}
      <h1 className="main-header" style={{ marginTop: '10rem' }}>
        {questionStates[0].sliderValue}
        {"-"}
        {questionStates[0].importanceValue}
        {"-"}
        {Math.floor(questionStates[0].sliderValue * questionStates[0].importanceValue)}
        {"..........."}
        {questionStates[1].sliderValue}
        {"-"}
        {questionStates[1].importanceValue}
        {"-"}
        {Math.floor(questionStates[1].sliderValue * questionStates[1].importanceValue)}
      </h1>


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

export default App;