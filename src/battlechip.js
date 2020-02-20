import React from 'react';
import { MDBTable, MDBTableBody, MDBTableHead, MDBContainer, MDBRow, MDBCol, MDBTooltip } from 'mdbreact';
import PropTypes from 'prop-types';
import { ElementImage } from "./ElementImage";
import { getChip } from "./ChipLibrary";
import "./Battlechip.css"



export class Packchip extends React.Component {


    render() {
        if (!this.props.chipName) {
            throw new Error("chipName not set");
        }

        let chip = getChip(this.props.chipName.toLocaleLowerCase());
        let type = "";
        switch (chip.Type) {
            case "Giga":
                type = "#f8c8d8";
                break;
            case "Mega":
                type = "#90f8f8";;
                break;
            case "Standard":
            default:
                type = "white";
                break;
        }
        return (
            <MDBTooltip domElement>
                <div style={{ color: type }}>
                    <MDBRow center>
                        <MDBCol size="2">
                            {chip.Name}
                        </MDBCol>
                        <MDBCol size="2">
                            {chip.Skill}
                        </MDBCol>
                        
                        <MDBCol size="1">
                            {chip.Damage}
                        </MDBCol>
                        <MDBCol size="2">
                            {chip.Range}
                        </MDBCol>
                        <MDBCol size="2">
                            {chip.Hits}
                        </MDBCol>
                        <MDBCol size="1">
                            <ElementImage element={chip.Element} />
                        </MDBCol>
                        <MDBCol size="1">
                            {this.props.chipCount}
                        </MDBCol>
                    </MDBRow>
                </div>
                <span>{chip.Description}</span>
            </MDBTooltip>
        );
    }
}



export class LibraryChip extends React.Component {


    render() {
        if (!this.props.chipName || !this.props.addToPackCallback) {
            throw new Error("missing prop");
        }

        let chip = getChip(this.props.chipName.toLocaleLowerCase());
        let type = "";
        switch (chip.Type) {
            case "Giga":
                type = "Giga";
                break;
            case "Mega":
                type = "Mega";
                break;
            case "Standard":
            default:
                type = "Chip";
                break;
        }
        return (
            <MDBTooltip domElement>
                <div onDoubleClick={() => { this.props.addToPackCallback(chip.Name) }} className={type}>
                    <MDBRow center>
                        <MDBCol size="2" className="debug">
                            <span style={{ whiteSpace: "nowrap" }}>{chip.Name}</span>
                        </MDBCol>
                        <MDBCol size="2" className="debug">
                            {chip.Skill}
                        </MDBCol>

                        <MDBCol size="2" className="debug">
                            {chip.Damage}
                        </MDBCol>
                        <MDBCol size="1" className="debug">
                            {chip.Range}
                        </MDBCol>
                        <MDBCol size="1" className="debug">
                            {chip.Hits}
                        </MDBCol>
                        <MDBCol size="1" className="debug">
                            <ElementImage element={chip.Element} />
                        </MDBCol>
                    </MDBRow>
                </div>
                <span>{chip.Description}</span>
            </MDBTooltip>
        );
    }
}


/*
Battlechip.PropTypes = {
    chipName: PropTypes.string,
}
*/


//style={{backgroundColor: "#00637b", textAlign: "Left", paddingLeft: "0px", paddingRight: "1px", fontFamily: "Lucida Console", fontWeight:"bold", fontSize: "16px", color: "white", marginBottom: "0px", textShadow:"1px 1px grey"}}