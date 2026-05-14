import { Routes, Route, useNavigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';

const GameRoute = ({ component: GameComponent }) => {
  const navigate = useNavigate();
  return <GameComponent onQuit={() => navigate('/games')} />;
};

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Education from './pages/Education';
import Certificates from './pages/education/Certificates';
import Internships from './pages/education/Internships';
import Blogs from './pages/education/Blogs';
import Quiz from './pages/education/Quiz';
import Resources from './pages/education/Resources';
import Contact from './pages/Contact';
import Games from './pages/Games';
import UserNotFound from './pages/UserNotFound';
// import TechTour from './pages/TechTour';
import TechTourDetail from './pages/TechTourDetail';
import WordSearchGame from './components/games/WordSearchGame';
import MatchingGame from './components/games/MatchingGame';
import JigsawGame from './components/games/JigsawGame';
import CrosswordGame from './components/games/CrosswordGame';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="services" element={<Services />} />
        <Route path="services/:id" element={<ServiceDetail />} />
        <Route path="education" element={<Education />} />
        <Route path="education/certificates" element={<Certificates />} />
        <Route path="education/internships" element={<Internships />} />
        <Route path="education/blogs" element={<Blogs />} />
        <Route path="education/quiz" element={<Quiz />} />
        <Route path="education/resources" element={<Resources />} />
        <Route path="tech-tour/:slug" element={<TechTourDetail />} />
        <Route path="games" element={<Games />} />
        <Route path="games/word-search" element={<GameRoute component={WordSearchGame} />} />
        <Route path="games/matching" element={<GameRoute component={MatchingGame} />} />
        <Route path="games/jigsaw" element={<GameRoute component={JigsawGame} />} />
        <Route path="games/crossword" element={<GameRoute component={CrosswordGame} />} />

        <Route path="contact" element={<Contact />} />
      </Route>
      <Route path="*" element={<UserNotFound />} />
    </Routes>
  );
}

export default App;
