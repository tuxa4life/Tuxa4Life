import ProjectCard from './misc/ProjectCard'
import { projects } from '../constants/data'

const Projects = () => {
    const renderedProjects = projects.map((e, i) => {
        return <ProjectCard key={`proj-${i}`} image={e.image} title={e.title} description={e.description} tools={e.tools} sourceUrl={e.sourceUrl} demoUrl={e.demoUrl} />
    })

    return (
        <section className="projects" id='projects'>
            <div className="projects-container container">
                <h2>Featured Projects</h2>
                <div className="projects-wrapper">
                    {renderedProjects}
                    <div className="project-card">
                        <div className="project-content">
                            <h2 style={{ textAlign: 'center' }}>Want to see more projects?</h2>
                            <p style={{ textAlign: 'center', marginTop: '15px' }}>Check out my GitHub profile for additional projects, code samples, and open-source contributions.</p>
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                <button className="btn-primary" onClick={() => window.open('https://github.com/tuxa4life', '_blank')}>
                                    Visit my Github
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Projects
