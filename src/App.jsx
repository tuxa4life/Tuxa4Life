import AboutMe from './components/AboutMe'
import Experience from './components/Experience'
import Footer from './components/Footer'
import Profile from './components/Profile'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Socials from './components/Socials'
import './styles/app.css'

const App = () => {
    return (
        <div className="app">
            <Profile />
            <div style={{ marginTop: '10vh' }}></div>
            <AboutMe />
            <Experience />
            <Skills />
            <Projects />
            <div className="contour"></div>
            <div className="contour2"></div>
            <Socials />
            <div className="email-bar">
                <div className="line"></div>
                <a href="mailto:nikoloztuxa@gmail.com">nikoloztuxa@gmail.com</a>
            </div>

            <Footer />
        </div>
    )
}

export default App
