import { ReactComponent as Location } from '../svgs/location.svg'

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
            </div>
            <div className="gradient"></div>
            <div className="hider"></div>
        </section>
    )
}

export default Profile
