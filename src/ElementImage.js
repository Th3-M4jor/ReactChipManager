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
        });
        return (
            <span style={{ whiteSpace: "nowrap", display: "inline-block" }}>
                {images}
            </span>
        )
    }
}