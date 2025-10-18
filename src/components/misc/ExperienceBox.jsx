const ExperienceBox = ({label, since}) => {
    return <div className="exp-box">
        <p>{label}</p>
        <p>{ new Date().getFullYear() - since }</p>
        <span>Years</span>
    </div>
}

export default ExperienceBox