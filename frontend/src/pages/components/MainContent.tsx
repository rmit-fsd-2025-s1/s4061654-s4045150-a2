import '../../styles/maincontent.css'

export default function MainContent(){

    return(
        <div className="aim-testimonials">
            <img src="/images/light-bulb.png" alt="Idea Icon" className="bulb-icon" />
            <h2>Our Aim</h2>
            <p>
                TeachTeam was created to connect aspiring tutors with lecturers who need tutoring and teaching
                support. Our mission is to provide a platform where educators can gain real-world teaching experience,
                improve their skills, and shape the future of education.
            </p>

            <hr className="section-divider" />
            
            <img src="/images/participation.png" alt="Participation Icon" className="participation-icon" />
            <h2>Our Values</h2>
            <ul>
                <li>Empowerment: Helping educators grow and improve.</li>
                <li>Collaboration: Building a bridge between tutors and lecturers.</li>
                <li>Innovation: Always striving to create better solutions for education.</li>
            </ul>
        
            <hr className="section-divider" />

            <img src="/images/book.png" alt="Book Icon" className="book-icon" />
            <h2>How It Works</h2>
            <p>Getting started with TeachTeam is easy! Just signup as a tutor and browse through
                 the available courses to see what interests you! Choose your own availability! 
                 You can also decorate your application with your qualifications and past 
                 experience to give it a little flavor!</p>

            <hr className="section-divider" />

            <img src="/images/feedback.png" alt="Feedback Icon" className="feedback-icon" />
            <h2>What Our Users Are Saying</h2>
            <div className="testimonial">
                <p>"TeachTeam helped me connect with Lecturers and grow as an educator!" - Jane Doe</p>
                <p>"The platform helped me chase my dreams and guide the next generation!" - John Smith</p>
            </div>
        </div>
    );
}