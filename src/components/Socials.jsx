import github from '../svgs/github.svg'
import instagram from '../svgs/instagram.svg'

const Socials = () => {
    const open = (url) => {
        const link = document.createElement('a')
        link.href = url
        link.target = '_blank'
        link.click()
    }

    return (
        <div className="socials">
            <div onClick={() => open('https://github.com/tuxa4life')} className="logo-wrapper">
                <img src={github} alt="github" />
                <span>@tuxa4life</span>
            </div>
            <div onClick={() => open('https://instagram.com/n.tukh_')} className="logo-wrapper">
                <img src={instagram} alt="github" />
                <span>@n.tukh_</span>
            </div>
            <div className="line"></div>
        </div>
    )
}

export default Socials
