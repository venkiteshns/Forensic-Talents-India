import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';

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
        <Route path="games" element={<Games />} />

        <Route path="contact" element={<Contact />} />
      </Route>
    </Routes>
  );
}

export default App;
