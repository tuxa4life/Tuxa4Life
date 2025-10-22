import { ReactComponent as Location } from '../svgs/location.svg'
import { ReactComponent as Github } from '../svgs/github.svg'
import { ReactComponent as Instagram } from '../svgs/instagram.svg'
import { ReactComponent as Email } from '../svgs/email.svg'

const Profile = () => {
    return (
        <section className="profile">
            <div className="profile-info">
                <div className="pfp-container">
                    <img src="./media/profile.jpg" alt="" />
                </div>
                <div className="meta">
                    <div>
                        <Location className='location icon' />
                        <span> Rustavi, Georgia</span>
                    </div>
                    <h1>Nikoloz Tukhashvili</h1>
                    <p>Full-stack develper & Software Engineer</p>
                </div>
                <div className='opt-links' style={{margin: '20px 0 0 0', display: 'none', alignItems: 'center'}}>
                    <Email width={32} height={32} style={{margin: '0 10px'}}/>
                    <Github width={23} height={23} style={{margin: '0 10px'}}/>
                    <Instagram width={25} height={25} style={{margin: '0 10px'}}/>
                </div>
            </div>
            <div className="gradient"></div>
            <div className="hider"></div>
        </section>
    )
}

export default Profile
