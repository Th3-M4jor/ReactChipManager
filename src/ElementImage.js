import React from 'react';

const aquaURL = "http://vignette.wikia.nocookie.net/megaman/images/f/fe/BC_Element_Aqua.png";

const breakURL = "http://vignette.wikia.nocookie.net/megaman/images/0/0e/BC_Attribute_Break.png";

const cursorURL = "http://vignette.wikia.nocookie.net/megaman/images/2/2b/TypeCursor.png";

const elecURL = "http://vignette.wikia.nocookie.net/megaman/images/f/f6/BC_Element_Elec.png";

const fireURL = "http://vignette.wikia.nocookie.net/megaman/images/3/38/BC_Element_Heat.png";

const invisURL = "http://vignette.wikia.nocookie.net/megaman/images/e/e0/TypeInvis.png";

const nullURL = "http://vignette.wikia.nocookie.net/megaman/images/4/47/BC_Element_Null.png";

const objectURL = "http://vignette.wikia.nocookie.net/megaman/images/4/4c/TypeObstacle.png";

const recoveryURL = "http://vignette.wikia.nocookie.net/megaman/images/8/81/TypeRecover.png";

const swordURL = "http://vignette.wikia.nocookie.net/megaman/images/d/d5/BC_Attribute_Sword.png";

const windURL = "http://vignette.wikia.nocookie.net/megaman/images/b/b1/BC_Attribute_Wind.png";

const woodURL = "http://vignette.wikia.nocookie.net/megaman/images/8/83/BC_Element_Wood.png";


export class ElementImage extends React.Component {
    render() {
        if (!this.props.element) {
            throw new Error("element not set");
        }
        let images = this.props.element.map(element => {
            switch(element) {
                case "Fire":
                    return (<img src={fireURL} alt=""/>);
                case "Aqua":
                    return (<img src={aquaURL} alt=""/>);
                case "Elec":
                    return (<img src={elecURL} alt=""/>);
                case "Wood":
                    return (<img src={woodURL} alt=""/>);
                case "Wind":
                    return (<img src={windURL} alt=""/>);
                case "Sword":
                    return (<img src={swordURL} alt=""/>);
                case "Break":
                    return (<img src={breakURL} alt=""/>);
                case "Cursor":
                    return (<img src={cursorURL} alt=""/>);
                case "Recovery":
                    return (<img src={recoveryURL} alt=""/>);
                case "Invis":
                    return (<img src={invisURL} alt=""/>);
                case "Object":
                    return (<img src={objectURL} alt=""/>);
                case "Null":
                    return (<img src={nullURL} alt=""/>);
                default:
                    throw new Error("bad element name");
            }
        });
        return (
        <div align="center">
        {images}
        </div>
        )
    }
}