import react from "react";

const Footer = (props) => {

    return (
        <footer className="Footer fixed-bottom bg-dark">
            <div className="my-2 container text-left d-flex justify-content-between">
                <p className="text-primary my-0">Project Management App V 0.0.1</p>
                <a href="mailto:nicolasbertho1996@gmail.com">Report a bug here</a>
            </div>
        </footer>
    );

}

export default Footer;