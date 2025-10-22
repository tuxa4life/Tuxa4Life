import '../styles/footer.css'
import github from '../svgs/github.svg'
import instagram from '../svgs/instagram.svg'

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-bottom"></div>

                <div className="footer-main">
                    <div className="footer-section">
                        <h3>Get In Touch</h3>
                        <p>I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.</p>
                        <a href="mailto:nikoloztuxa@gmail.com" className="footer-email">
                            nikoloztuxa@gmail.com
                        </a>
                    </div>

                    <div className="footer-section">
                        <h3>Quick Links</h3>
                        <ul className="footer-links">
                            <li>
                                <a href="#about">About</a>
                            </li>
                            <li>
                                <a href="#experience">Experience</a>
                            </li>
                            <li>
                                <a href="#skills">Skills</a>
                            </li>
                            <li>
                                <a href="#projects">Projects</a>
                            </li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h3>Connect</h3>
                        <div className="footer-socials">
                            <a href="https://github.com/tuxa4life" target="_blank" rel="noopener noreferrer">
                                <img src={github} alt="GitHub" />
                            </a>
                            <a href="https://instagram.com/n.tukh_" target="_blank" rel="noopener noreferrer">
                                <img src={instagram} alt="LinkedIn" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© 2025 Nikoloz Tukhashvili. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer