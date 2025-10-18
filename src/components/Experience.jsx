import { experience } from '../constants/data'
import ExperienceBox from './misc/ExperienceBox'

const Experience = () => {
    const renderedExp = experience.map((e, i) => {
        return <ExperienceBox key={`exp-${i}`} label={e.label} since={e.since} />
    })

    return (
        <section className="experience">
            <div className="experience-container container">
                <h2>Experience</h2>
                <div className="exp-wrapper">{renderedExp}</div>
            </div>
        </section>
    )
}

export default Experience
