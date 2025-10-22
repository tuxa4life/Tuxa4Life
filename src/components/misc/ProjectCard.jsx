import { icons, images } from '../../constants/data'
import '../../styles/project.css'

const ProjectCard = ({ image, title, description, tools, sourceUrl, demoUrl }) => {
    return (
        <div className="project-card" onClick={() => window.open(sourceUrl, '_blank')}>
            <div className="project-image-container">
                <img src={images[image]} alt={title} className="project-image" />
                <div className="project-overlay"></div>
            </div>

            <div className="project-content">
                <h3 className="project-title">{title}</h3>

                <div className="project-section">
                    <p className="project-description">{description}</p>
                </div>

                <div className="project-section">
                    <h4 className="section-label">Technologies Used</h4>
                    <div className="project-tools">
                        {tools.map((tool, index) => (
                            <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}} key={index} className="tool-tag">
                                <img style={{height: '15px', width: '15px', objectFit: 'cover', marginRight: '7px'}} src={icons[tool.icon]} alt="" />
                                {tool.label}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="project-buttons">
                    <button className="btn-basic" onClick={() => window.open(sourceUrl, '_blank')}>
                        View Source
                    </button>
                    <button className="btn-primary" onClick={() => window.open(demoUrl, '_blank')}>
                        Live Demo
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProjectCard