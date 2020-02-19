import React from 'react';
import { MDBTable, MDBTableBody, MDBTableHead, MDBContainer, MDBRow, MDBCol, MDBTooltip } from 'mdbreact';
import {libraryAsArray} from './ChipLibrary';
import {Battlechip, LibraryChip} from './battlechip';




export class Library extends React.Component {
    render() {
        let chips = libraryAsArray();
        chips = chips.sort((a, b) => a.Name.localeCompare(b.Name));
        let toRender = chips.map((chip) => {
            return (
                <LibraryChip chipName={chip.Name}/>
            )
        });
        return (
            <>
            {toRender}
            </>
        );
    }
}