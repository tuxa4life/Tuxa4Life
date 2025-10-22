import { skills, icons } from '../constants/data'
import SkillItem from './misc/SkillItem'

const Skills = () => {
    const renderedSkills = Object.keys(skills).map((term, i) => {
        return (
            <li key={`skill-${i}`}>
                <h3>
                    {term
                        .split('_')
                        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(' ')}:
                </h3>
                <div>
                    {skills[term].map((e, j) => {
                        return <SkillItem key={`skill-${i}-${j}`} svg={icons[e.svg]} label={e.label} />
                    })}
                </div>
            </li>
        )
    })

    return (
        <section className="skills" id='skill'>
            <div className="skills-container container">
                <h2>Skills</h2>
                <ul>{renderedSkills}</ul>
            </div>
        </section>
    )
}

export default Skills
