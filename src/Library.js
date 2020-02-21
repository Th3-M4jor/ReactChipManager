import React from 'react';
import { MDBTable, MDBTableBody, MDBTableHead, MDBContainer, MDBRow, MDBCol, MDBTooltip } from 'mdbreact';
import { libraryAsArray, getChip, BattleChip } from './ChipLibrary';
import {LibraryChip, Packchip } from './battlechip';
import './App.css';
import './Battlechip.css';




export class Library extends React.Component {
    render() {
        if (!this.props.addToPackCallback) {
            throw new Error("missing add to pack callback");
        }
        let chips = libraryAsArray();
        chips = chips.sort((a, b) => a.Name.localeCompare(b.Name));
        let toRender = chips.map((chip) => {
            return (
                <LibraryChip chipName={chip.Name} addToPackCallback={this.props.addToPackCallback} />
            )
        });
        return (
            <div className="Folder" id="fullLibrary">
                <MDBRow center className="sticky-top" style={{ backgroundColor: "gray" }}>
                    <MDBCol size="2" className="debug Chip">
                        <span style={{ whiteSpace: "nowrap" }}>NAME</span>
                    </MDBCol>
                    <MDBCol size="2" className="debug Chip">
                        SKILL
                        </MDBCol>
                    <MDBCol size="2" className="debug Chip">
                        DAMAGE
                        </MDBCol>
                    <MDBCol size="2" className="debug Chip">
                        RANGE
                        </MDBCol>
                    <MDBCol size="1" className="debug Chip">
                        HITS
                        </MDBCol>
                    <MDBCol size="1" className="debug Chip">

                    </MDBCol>
                </MDBRow>
                {toRender}
            </div>
        );
    }
}


export class Pack extends React.Component {
    render() {
        if (typeof this.props.contents != 'object') {
            throw new Error("No pack set");
        }
        
        /**@type {BattleChip[]} */
        let chipList = [];

        for (const property in this.props.contents) {
            chipList.push(getChip(property));
        }
        chipList.sort((a, b) => a.Name.localeCompare(b.Name));

        let chips = chipList.map((chip) => {
            return (
                <Packchip chipName={chip.Name} chipCount={this.props.contents[chip.Name]} />
            );
        });
        /*
        let chips = libraryAsArray().filter((chip) => chip.Owned > 0);
        chips = chips.sort((a, b) => a.Name.localeCompare(b.Name));
        let toRender = chips.map((chip) => {
            return (
                <PackChip chipName={chip.Name}/>
            )
        });
        */
        return (
            <div id="fullPack" className="Folder">
                <MDBRow center className="sticky-top" style={{ backgroundColor: "gray" }}>
                    <MDBCol size="2" className="debug Chip">
                        NAME
                    </MDBCol>
                    <MDBCol size="2" className="debug Chip">
                        SKILL
                    </MDBCol>

                    <MDBCol size="2" className="debug Chip">
                        DAMAGE
                    </MDBCol>
                    <MDBCol size="2" className="debug Chip">
                        RANGE
                    </MDBCol>
                    <MDBCol size="1" className="debug Chip">
                        HITS
                    </MDBCol>
                    <MDBCol size="1" className="debug Chip">

                    </MDBCol>
                    <MDBCol size="1" className="debug Chip">

                    </MDBCol>
                </MDBRow>
                {chips}
            </div>
        );
    }
}