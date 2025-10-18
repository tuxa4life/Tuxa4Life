const SkillItem = ({svg, label}) => {
    return <div className="skill-item">
        <img src={svg} alt="skill-svg" />
        <p>{label}</p>
    </div>
}

export default SkillItem