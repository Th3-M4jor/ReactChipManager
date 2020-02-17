import React from 'react';
import { MDBTable, MDBTableBody, MDBTableHead, MDBContainer, MDBRow, MDBCol, MDBTooltip } from 'mdbreact';
import {ElementImage} from "./ElementImage";
import "./Battlechip.css"

var library = new Map();
const URL = "http://spartan364.hopto.org/chips.json";

export async function loadChips() {
    library.clear();
    let body = await fetch(URL);
    let result = await body.json();
    result.forEach(chip => {
        library.set(chip.Name.toLocaleLowerCase(), chip);
    });
    return true;
}

export class Battlechip extends React.Component {


    render() {
        if (!this.props.chipName) {
            throw new Error("chipName not set");
        }
        if (!library.has(this.props.chipName?.toLocaleLowerCase())) {
            throw new Error("Bad chip name");
        }
        let chip = library.get(this.props.chipName.toLocaleLowerCase());
        let skill;
        if(chip.Skills.length > 1) {
            skill = "Varies";
        } else {
            skill = chip.Skills[0];
        }
        return (
            <MDBTooltip domElement>
            <div>
            <MDBRow>
            <MDBCol>
                <div className="Chip">
                    {chip.Name}
                </div>
            </MDBCol>
            <MDBCol>
                <div className="Chip">
                {skill}
                </div>
            </MDBCol>
            <MDBCol>
                <ElementImage element={chip.Element}/>
            </MDBCol>
            <MDBCol>
                <div className="Chip">
                    {chip.Damage}
                </div>
            </MDBCol>
            <MDBCol>
                <div className="Chip">
                    {chip.Range}
                </div>
            </MDBCol>
            <MDBCol>
                <div className="Chip">
                    {chip.Hits}
                </div>
            </MDBCol>
            </MDBRow>
            </div>
            <span>{chip.Description}</span>
            </MDBTooltip>
        );
    }
}



//style={{backgroundColor: "#00637b", textAlign: "Left", paddingLeft: "0px", paddingRight: "1px", fontFamily: "Lucida Console", fontWeight:"bold", fontSize: "16px", color: "white", marginBottom: "0px", textShadow:"1px 1px grey"}}


export function getChipDescription(chipName) {
        if(!chipName) {
            throw new Error("chipName not set");
        }
        if (!library.has(chipName.toLocaleLowerCase())) {
            throw new Error("Bad chip name");
        }
        let chip = library.get(chipName.toLocaleLowerCase());
        return chip.Description;
}