const fs = require('fs');
const path = './src/components/games/CrosswordGame.jsx';
let content = fs.readFileSync(path, 'utf8');

// Find the start and end of the block to replace
const importLib = "import crosswordLib from 'crossword-layout-generator';";
const exportDefault = "export default function CrosswordGame({ onQuit }) {";

const startIndex = content.indexOf(importLib);
const endIndex = content.indexOf(exportDefault);

if (startIndex === -1 || endIndex === -1) {
  console.error("Could not find importLib or exportDefault");
  process.exit(1);
}

const newHelpers = `import CrosswordWorker from './crosswordWorker?worker';

const fetchWordSet = async () => {
  try {
    const storedPlayedIds = JSON.parse(localStorage.getItem('playedCrosswordIds') || '[]');
    const res = await api.get(\`/game/crossword?playedIds=\${storedPlayedIds.join(',')}\`);

    if (res.data && res.data.words && res.data.words.length > 0) {
      if (res.data.resetOccurred) {
        localStorage.setItem('playedCrosswordIds', JSON.stringify([res.data._id]));
      } else {
        localStorage.setItem('playedCrosswordIds', JSON.stringify([...storedPlayedIds, res.data._id]));
      }
      return res.data.words;
    }
  } catch (err) {}
  
  return [
    { word: 'FORENSIC', clue: 'Scientific analysis for crime' },
    { word: 'CRIME', clue: 'Unlawful act' },
    { word: 'SCENE', clue: 'Location of the crime' },
    { word: 'EVIDENCE', clue: 'Material proof' },
    { word: 'CLUE', clue: 'Lead for investigation' },
  ];
};

const generatePuzzleWithWorker = (worker, words) => {
  return new Promise((resolve, reject) => {
    if (!worker) return reject(new Error("Worker not initialized"));
    
    const handleMessage = (e) => {
      worker.removeEventListener('message', handleMessage);
      if (e.data.success) resolve({ puzzleData: e.data.puzzleData, gridData: e.data.gridData });
      else reject(new Error(e.data.error));
    };
    
    worker.addEventListener('message', handleMessage);
    worker.postMessage({ type: 'GENERATE', words });
  });
};

const generateWithTimeout = (worker, words, ms = 10000) => {
  return Promise.race([
    generatePuzzleWithWorker(worker, words),
    new Promise((_, reject) => setTimeout(() => reject(new Error("Generation timeout")), ms))
  ]);
};

`;

content = content.substring(0, startIndex) + newHelpers + content.substring(endIndex);

// Now replace the inside of the component
const componentStartStr = `export default function CrosswordGame({ onQuit }) {
  const [puzzleData, setPuzzleData] = useState(null);`;

const handleStartEndStr = `    setGameState('playing');
  };

  const initGame = () => {
    handleStartGameClick();
  };`;

const stateIndex = content.indexOf(componentStartStr);
const handleIndex = content.indexOf(handleStartEndStr) + handleStartEndStr.length;

if (stateIndex === -1 || handleIndex < handleStartEndStr.length) {
  console.error("Could not find componentStartStr or handleStartEndStr");
  process.exit(1);
}

const newComponentLogic = `export default function CrosswordGame({ onQuit }) {
  const [puzzleData, setPuzzleData] = useState(null);
  const [gridData, setGridData] = useState([]);
  const [userInputs, setUserInputs] = useState({});
  const [activeWordId, setActiveWordId] = useState(null);
  const [activeCell, setActiveCell] = useState(null);
  const [gameState, setGameState] = useState('idle'); // idle, loading, playing, completed, error
  const [timeElapsed, setTimeElapsed] = useState(0);

  const [puzzleQueue, setPuzzleQueue] = useState([]);
  const isGeneratingRef = useRef(false);
  const workerRef = useRef(null);

  const gameSectionRef = useRef(null);
  const inputRefs = useRef({});

  useEffect(() => {
    workerRef.current = new CrosswordWorker();
    
    const cached = localStorage.getItem('crosswordPuzzleCache');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPuzzleQueue(parsed);
        }
      } catch (e) {}
    }
    
    return () => {
      if (workerRef.current) workerRef.current.terminate();
    };
  }, []);

  const generateInBackground = () => {
    if (!workerRef.current || isGeneratingRef.current) return;
    
    setPuzzleQueue(prev => {
      if (prev.length >= 2) return prev;
      
      isGeneratingRef.current = true;
      (async () => {
        try {
          const words = await fetchWordSet();
          const result = await generateWithTimeout(workerRef.current, words, 10000);
          
          setPuzzleQueue(q => {
            const newQ = [...q, result];
            if (newQ.length > 3) newQ.shift();
            localStorage.setItem('crosswordPuzzleCache', JSON.stringify(newQ));
            return newQ;
          });
        } catch (err) {
          console.error("Background generation failed:", err);
        } finally {
          isGeneratingRef.current = false;
        }
      })();
      
      return prev;
    });
  };

  useEffect(() => {
    generateInBackground();
  }, [puzzleQueue]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let interval;
    if (gameState === 'playing') {
      interval = setInterval(() => setTimeElapsed(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'completed') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [gameState]);

  const applyPuzzle = (puzzle) => {
    setPuzzleData(puzzle.puzzleData);
    setGridData(puzzle.gridData);
    setUserInputs({});
    if (puzzle.puzzleData.words.length > 0) {
      setActiveWordId(puzzle.puzzleData.words[0].id);
      setActiveCell({ r: puzzle.puzzleData.words[0].r, c: puzzle.puzzleData.words[0].c });
    }
    setTimeElapsed(0);
    setGameState('playing');
  };

  const handleStartGameClick = async () => {
    setGameState('loading');
    setTimeout(() => {
      gameSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    if (puzzleQueue.length > 0) {
      const nextPuzzle = puzzleQueue[0];
      const remaining = puzzleQueue.slice(1);
      setPuzzleQueue(remaining);
      localStorage.setItem('crosswordPuzzleCache', JSON.stringify(remaining));
      
      setTimeout(() => applyPuzzle(nextPuzzle), 50);
    } else {
      try {
        const words = await fetchWordSet();
        const result = await generateWithTimeout(workerRef.current, words, 10000);
        applyPuzzle(result);
      } catch (err) {
        console.error("Sync generation failed", err);
        setGameState('error');
      }
    }
  };

  const initGame = () => {
    handleStartGameClick();
  };`;

content = content.substring(0, stateIndex) + newComponentLogic + content.substring(handleIndex);

fs.writeFileSync(path, content, 'utf8');
