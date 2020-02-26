import React from 'react';
import Fire from './img/fire.png';
import Aqua from './img/aqua.png';
import Elec from './img/elec.png';
import Wood from './img/wood.png';
import Wind from './img/wind.png';
import Sword from './img/sword.png';
import Break from './img/break.png';
import Cursor from './img/cursor.png';
import Recov from './img/recov.png';
import Invis from './img/invis.png';
import TypeObject from './img/object.png';
import TypeNull from './img/null.png';


/*
const aquaURL = "https://vignette.wikia.nocookie.net/megaman/images/f/fe/BC_Element_Aqua.png";

const breakURL = "https://vignette.wikia.nocookie.net/megaman/images/0/0e/BC_Attribute_Break.png";

const cursorURL = "https://vignette.wikia.nocookie.net/megaman/images/2/2b/TypeCursor.png";

const elecURL = "https://vignette.wikia.nocookie.net/megaman/images/f/f6/BC_Element_Elec.png";

const fireURL = "https://vignette.wikia.nocookie.net/megaman/images/3/38/BC_Element_Heat.png";

const invisURL = "https://vignette.wikia.nocookie.net/megaman/images/e/e0/TypeInvis.png";

const nullURL = "https://vignette.wikia.nocookie.net/megaman/images/4/47/BC_Element_Null.png";

const objectURL = "https://vignette.wikia.nocookie.net/megaman/images/4/4c/TypeObstacle.png";

const recoveryURL = "https://vignette.wikia.nocookie.net/megaman/images/8/81/TypeRecover.png";

const swordURL = "https://vignette.wikia.nocookie.net/megaman/images/d/d5/BC_Attribute_Sword.png";

const windURL = "https://vignette.wikia.nocookie.net/megaman/images/b/b1/BC_Attribute_Wind.png";

const woodURL = "https://vignette.wikia.nocookie.net/megaman/images/8/83/BC_Element_Wood.png";
*/

/*
const URLList = [
    "https://vignette.wikia.nocookie.net/megaman/images/3/38/BC_Element_Heat.png",
    "https://vignette.wikia.nocookie.net/megaman/images/f/fe/BC_Element_Aqua.png",
    "https://vignette.wikia.nocookie.net/megaman/images/f/f6/BC_Element_Elec.png",
    "https://vignette.wikia.nocookie.net/megaman/images/8/83/BC_Element_Wood.png",
    "https://vignette.wikia.nocookie.net/megaman/images/b/b1/BC_Attribute_Wind.png",
    "https://vignette.wikia.nocookie.net/megaman/images/d/d5/BC_Attribute_Sword.png",
    "https://vignette.wikia.nocookie.net/megaman/images/0/0e/BC_Attribute_Break.png",
    "https://vignette.wikia.nocookie.net/megaman/images/2/2b/TypeCursor.png",
    "https://vignette.wikia.nocookie.net/megaman/images/8/81/TypeRecover.png",
    "https://vignette.wikia.nocookie.net/megaman/images/e/e0/TypeInvis.png",
    "https://vignette.wikia.nocookie.net/megaman/images/4/4c/TypeObstacle.png",
    "https://vignette.wikia.nocookie.net/megaman/images/4/47/BC_Element_Null.png",
]
*/
const URLList = [
    Fire, Aqua, Elec, Wood, Wind, Sword, Break,
    Cursor, Recov, Invis, TypeObject, TypeNull,
];


export class ElementImage extends React.Component {
    render() {
        if (!this.props.element) {
            throw new Error("element not set");
        }
        let images = this.props.element.map(element => {
            if (!URLList[element]) {
                throw new Error("bad element name");
            }
            return (
                <img src={URLList[element]} alt="" key={element.toString()} />
            );
            /*
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
            */
        });
        return (
            <span style={{ whiteSpace: "nowrap", display: "inline-block" }}>
                {images}
            </span>
        )
    }
}