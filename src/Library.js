import React from 'react';
import { MDBTable, MDBTableBody, MDBTableHead, MDBContainer, MDBRow, MDBCol, MDBTooltip } from 'mdbreact';
import { libraryAsArray, getChip, BattleChip } from './ChipLibrary';
import {LibraryChip, Packchip } from './battlechip';




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
            <div style={{
                borderRadius: "8px", backgroundColor: "#00637b", textAlign: "center", paddingLeft: "3px", paddingRight: "1px", minWidth: "400px", overflowX: "scroll",
                fontFamily: "Lucida Console", fontWeight: "bold", fontSize: "16px", color: "white", overflowY: "scroll", minHeight: "200px", maxHeight: "80vh"
            }} id="fullLibrary">
                <MDBRow center className="sticky-top" style={{ backgroundColor: "gray" }}>
                    <MDBCol size="2">
                        <span style={{ whiteSpace: "nowrap" }}>NAME</span>
                    </MDBCol>
                    <MDBCol size="2">
                        SKILL
                        </MDBCol>
                    <MDBCol size="2">
                        DAMAGE
                        </MDBCol>
                    <MDBCol size="1">
                        RANGE
                        </MDBCol>
                    <MDBCol size="1">
                        HITS
                        </MDBCol>
                    <MDBCol size="1">

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
            <div style={{
                borderRadius: "8px", backgroundColor: "#00637b", textAlign: "center", paddingLeft: "3px", paddingRight: "1px", minWidth: "320px", overflowX: "scroll",
                fontFamily: "Lucida Console", fontWeight: "bold", fontSize: "16px", color: "white", overflowY: "scroll", height: "80vh", minHeight:"200px", width:"99%"
            }} id="fullPack">
                <MDBRow center className="sticky-top" style={{ backgroundColor: "gray" }}>
                    <MDBCol size="2">
                        NAME
                    </MDBCol>
                    <MDBCol size="2">
                        SKILL
                    </MDBCol>

                    <MDBCol size="1">
                        DAMAGE
                    </MDBCol>
                    <MDBCol size="2">
                        RANGE
                    </MDBCol>
                    <MDBCol size="2">
                        HITS
                    </MDBCol>
                    <MDBCol size="1">

                    </MDBCol>
                    <MDBCol size="1">

                    </MDBCol>
                </MDBRow>
                {chips}
            </div>
        );
    }
}