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