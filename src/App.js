import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { MDBTable, MDBTableBody, MDBTableHead, MDBContainer, MDBRow, MDBCol, MDBTooltip, MDBNav, MDBNavItem, MDBNavLink, MDBTabContent, MDBTabPane } from 'mdbreact';
import './App.css';
import {Packchip} from './battlechip';
import {Library} from './Library';
import {loadChips} from './ChipLibrary';

/*
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}
*/

class App extends React.Component {
  state = {
    chipsLoaded: false,
    activeTab: "0",
  }

  componentDidMount() {
    loadChips().then(() => {
      this.setState({
        chipsLoaded: true, 
      })
    });
  }

  toggle = tab => e => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  render() {
    /*
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
    */
    //const { chipLibrary } = this.state;
    //let firstList = chipLibrary.filter(chip => chip.Range === "Far").map(chip => {return {Name: chip.Name}});
    //let secondList = chipLibrary.map(chip => {return {Name: chip.Name}});
    if (!this.state.chipsLoaded) {
      return null;
    }
    return (
      <div style={{ backgroundColor: "#00637b", padding: "5px", maxWidth: "75%" }}>
        <div style={{ backgroundColor: "#ffbd18", fontFamily: "Lucida Console", margin: "5px", color: "#FFFFFF", fontWeight: "bold" }}>
          FOLDER EDIT
    </div>
    <Router>
        <MDBContainer>
        <div style={{ backgroundColor: "#4abdb5", textAlign: "right", padding: "10px" }}>
          <MDBNav tabs>
            <MDBNavItem>
              <MDBNavLink to="#" active={this.state.activeTab === "0"} onClick={this.toggle("0")} role="tab">
                Hand
            </MDBNavLink>
            </MDBNavItem>
            <MDBNavItem>
              <MDBNavLink to="#" active={this.state.activeTab === "1"} onClick={this.toggle("1")} role="tab">
                Folder
            </MDBNavLink>
            </MDBNavItem>
            <MDBNavItem>
              <MDBNavLink to="#" active={this.state.activeTab === "2"} onClick={this.toggle("2")} role="tab">
                Pack
            </MDBNavLink>
            </MDBNavItem>
            <MDBNavItem>
              <MDBNavLink to="#" active={this.state.activeTab === "3"} onClick={this.toggle("3")} role="tab">
                Library
            </MDBNavLink>
            </MDBNavItem>
          </MDBNav>
          <MDBTabContent activeItem={this.state.activeTab}>
            <MDBTabPane tabId="0" role="tabpanel">
            <MDBContainer>
            <div style={{
              borderRadius: "8px", backgroundColor: "#00637b", textAlign: "left", paddingLeft: "3px", paddingRight: "1px", minWidth: "320px", overflowX: "scroll",
              fontFamily: "Lucida Console", fontWeight: "bold", fontSize: "16px", color: "white", overflowY: "scroll", maxHeight: "500px", minHeight: "200px"
            }}>
              <Packchip chipName="FireSword" />
              <Packchip chipName="TreeBomb"/>
              </div>
            </MDBContainer>
            </MDBTabPane>
            <MDBTabPane tabId="1" role="tabpanel">
            <MDBContainer>
            <div style={{
              borderRadius: "8px", backgroundColor: "#00637b", textAlign: "left", paddingLeft: "3px", paddingRight: "1px", minWidth: "320px", overflowX: "scroll",
              fontFamily: "Lucida Console", fontWeight: "bold", fontSize: "16px", color: "white", overflowY: "scroll", maxHeight: "500px", minHeight: "200px"
            }}>
              <Packchip chipName="AquaSword" />
              </div>
            </MDBContainer>
            </MDBTabPane>
            <MDBTabPane tabId="2" role="tabpanel">
            <MDBContainer>
            <div style={{
              borderRadius: "8px", backgroundColor: "#00637b", textAlign: "left", paddingLeft: "3px", paddingRight: "1px", minWidth: "320px", overflowX: "scroll",
              fontFamily: "Lucida Console", fontWeight: "bold", fontSize: "16px", color: "white", overflowY: "scroll", maxHeight: "500px", minHeight: "200px"
            }}>
              <Packchip chipName="ElecSword" />
              </div>
            </MDBContainer>
            </MDBTabPane>
            <MDBTabPane tabId="3" role="tabpanel">
            <MDBContainer>
            <div style={{
              borderRadius: "8px", backgroundColor: "#00637b", textAlign: "center", paddingLeft: "3px", paddingRight: "1px", minWidth: "320px", overflowX: "scroll",
              fontFamily: "Lucida Console", fontWeight: "bold", fontSize: "16px", color: "white", overflowY: "scroll", maxHeight: "500px", minHeight: "200px"
            }}>
              <Library />
              </div>
            </MDBContainer>
            </MDBTabPane>
          </MDBTabContent>
          </div>
        </MDBContainer>
        </Router>
      </div>
    );
  }
}

/*
 
 <div style={{ backgroundColor: "#4abdb5", textAlign: "right", padding: "10px" }}>
            Pack
        <div style={{
              borderRadius: "8px", backgroundColor: "#00637b", textAlign: "left", paddingLeft: "3px", paddingRight: "1px",
              fontFamily: "Lucida Console", fontWeight: "bold", fontSize: "16px", color: "white", overflowY: "scroll", maxHeight: "500px", minHeight: "200px"
            }}>


              <Battlechip chipName="FireSword" />
            </div>
          </div>

 */
export default App;
