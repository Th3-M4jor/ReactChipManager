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
        return (
            <MDBTooltip domElement>
                <div className="Chip">
                    <MDBRow center>
                        <MDBCol size="2">
                            {chip.Name}
                        </MDBCol>
                        <MDBCol size="2">
                            {chip.Skill}
                        </MDBCol>
                        <MDBCol size="1">
                            <ElementImage element={chip.Element} />
                        </MDBCol>
                        <MDBCol size="1">
                            {chip.Damage}
                        </MDBCol>
                        <MDBCol size="1">
                            {chip.Range}
                        </MDBCol>
                        <MDBCol size="1">
                            {chip.Hits}
                        </MDBCol>
                        <MDBCol size="1">
                            {chip.Owned}
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
        if (!this.props.chipName) {
            throw new Error("chipName not set");
        }

        let chip = getChip(this.props.chipName.toLocaleLowerCase());
        return (
            <MDBTooltip domElement>
                <div className="Chip">
                    <MDBRow center>
                        <MDBCol size="2">
                            {chip.Name}
                        </MDBCol>
                        <MDBCol size="2">
                            {chip.Skill}
                        </MDBCol>
                        <MDBCol size="1">
                            <ElementImage element={chip.Element} />
                        </MDBCol>
                        <MDBCol size="1">
                            {chip.Damage}
                        </MDBCol>
                        <MDBCol size="1">
                            {chip.Range}
                        </MDBCol>
                        <MDBCol size="1">
                                {chip.Hits}
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