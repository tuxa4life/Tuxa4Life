const AboutMe = () => {
    const getAge = (birthDate) => {
        const today = new Date()
        const birth = new Date(birthDate)
        let age = today.getFullYear() - birth.getFullYear()
        const m = today.getMonth() - birth.getMonth()
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--
        }
        return age
    }

    return (
        <section className="aboutme" id="about">
            <div className="about-me-container container">
                <h2>About Me</h2>
                <p>
                    I'm Nick - developer, {getAge('2005-03-14')} years old. <br /> Since I was a kid, I've been curious about how everything related to computers works. That curiosity led me to start learning programming. I know just knowing languages isn't enough to fully understand technology. So, I'm committed to keep learning and pushing myself. Technology shapes the future, and those who master it will shape what's ahead.
                </p>
            </div>

            <div className="button-container">
                <button className="primary" onClick={() => window.open('https://drive.google.com/file/d/16xbWuhNFlLCdCsyroVD4aNIRBG8iGhQA/view', '_blank')}>Open CV</button>
                <button className="basic" onClick={() => window.open('https://drive.usercontent.google.com/u/0/uc?id=16xbWuhNFlLCdCsyroVD4aNIRBG8iGhQA&export=download')}>Download CV</button>
            </div>
        </section>
    )
}

export default AboutMe
