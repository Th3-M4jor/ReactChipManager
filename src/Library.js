import React from 'react';
import { MDBTable, MDBTableBody, MDBTableHead, MDBContainer, MDBRow, MDBCol, MDBTooltip } from 'mdbreact';
import {libraryAsArray} from './ChipLibrary';
import {Battlechip, LibraryChip, Packchip} from './battlechip';




export class Library extends React.Component {
    render() {
        if(!this.props.addToPackCallback) {
            throw new Error("missing add to pack callback");
        }
        let chips = libraryAsArray();
        chips = chips.sort((a, b) => a.Name.localeCompare(b.Name));
        let toRender = chips.map((chip) => {
            return (
                <LibraryChip chipName={chip.Name} addToPackCallback={this.props.addToPackCallback}/>
            )
        });
        return (
            <div style={{
                borderRadius: "8px", backgroundColor: "#00637b", textAlign: "center", paddingLeft: "3px", paddingRight: "1px", minWidth: "400px", overflowX: "scroll",
                fontFamily: "Lucida Console", fontWeight: "bold", fontSize: "16px", color: "white", overflowY: "scroll", maxHeight: "500px", minHeight: "200px"
              }} id="fullLibrary">
            {toRender}
            </div>
        );
    }
}


export class Pack extends React.Component {
    render() {
        if(typeof this.props.contents != 'object') {
            throw new Error("No pack set");
        }
        let chips = [];
        for(const property in this.props.contents) {
            chips.push(
              <Packchip chipName={property} chipCount={this.props.contents[property]}/>  
            );
        }
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
                fontFamily: "Lucida Console", fontWeight: "bold", fontSize: "16px", color: "white", overflowY: "scroll", maxHeight: "500px", minHeight: "200px"
              }} id="fullPack">
            {chips}
            </div>
        );
    }
}