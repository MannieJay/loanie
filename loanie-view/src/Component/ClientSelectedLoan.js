import React, { Component } from 'react';
import axios from 'axios';
import { Breadcrumb, BreadcrumbItem, Card, CardHeader, CardBody } from 'reactstrap';
import Navbar from './Navbar';
import ClientSideNav from './ClientSideNav';
import ProgressBar from './ProgressBar';
import PhaseContent from './PhaseContent';
import '../CSS/ClientSelectedLoan.css';

export default class ClientSelectedLoan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      assignments: [],
      borrower: '',
      coBorrower: 'Bob',
      type: '',
      amount: '',
      userType: sessionStorage.getItem('userType'),
      phaseContent: '',
      phaseNumber: null,
      currentStatus: null,
      phaseTitle: '',
      currentLoanId: '',
      tokenId: sessionStorage.getItem('tokenId'),
      totalPhases: [],
      allAssignments: [],
      phaseTitleNumber: '',
      clientEmail: '',
    };
  }

  componentDidMount() {
    this.getLoanData();
  }

  getLoanData = () => {
    // grabs the current url
    let getLoanId = window.location.href;
    // grabs username inside current url
    getLoanId = getLoanId.split('/').pop();
    axios
      .get(`http://localhost:3030/loan/${getLoanId}`)
      .then((loandata) => {
        // console.log(loandata.data);
        const assignArr = loandata.data.assignments;
        const filteredLoans = PhaseContent.filter(post =>
          post.loanType.includes(loandata.data.loanType));
        const totalPhaseNo = filteredLoans;
        console.log('totalPhase', totalPhaseNo);
        this.setState({
          amount: loandata.data.amount,
          type: loandata.data.loanType,
          phaseNumber: loandata.data.currentStatus,
          currentStatus: loandata.data.currentStatus,
          currentLoanId: getLoanId,
          totalPhases: totalPhaseNo,
          allAssignments: assignArr,
          phaseTitleNumber: loandata.data.currentStatus,
          clientEmail: loandata.data.clientEmail,
        });

        for (let i = 0; i < PhaseContent.length; i += 1) {
          if (
            PhaseContent[i].loanType === this.state.type &&
            PhaseContent[i].phase === this.state.phaseNumber
          ) {
            this.setState({
              phaseContent: PhaseContent[i].description,
              phaseTitle: PhaseContent[i].phaseTitle,
            });
          }
        }
        if (this.state.type === 'new') {
          this.setState({ type: 'new purchase' });
        }
        for (let j = 0; j < assignArr.length; j += 1) {
          if (this.state.phaseNumber === assignArr[j].phase) {
            this.state.assignments.push(assignArr[j]);
          }
        }
        // axios request to get a user by email.
        const request = { email: loandata.data.clientEmail };
        // console.log('request: ', request);
        axios
          .post('http://localhost:3030/userbyemail', request)
          .then((res) => {
           //  console.log(res.data.name);
            const userName = res.data.name;
            this.setState({ borrower: userName });
            console.log(this.state.totalPhases.length);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  completedAssignment = (assignmentId, assignmentIndex) => {
    const tempAssignmets = this.state.assignments;
    tempAssignmets[assignmentIndex].complete = !tempAssignmets[assignmentIndex].complete;
    this.setState({ assignments: tempAssignmets });
    const body = {
      loanId: this.state.currentLoanId,
      assignmentId,
      complete: tempAssignmets[assignmentIndex].complete,
    };

    axios
      .post('http://localhost:3030/assignmentcomplete', body)
      .then(console.log('loan marked complete'))
      .catch((err) => {
        console.log(err);
      });

    // check if all assignments are checked with the current phase.
    // If yes, increment the phase
    let isPhaseComplete = true;
    for (let i = 0; i < this.state.assignments.length; i += 1) {
      if (!this.state.assignments[i].complete) {
        isPhaseComplete = false;
        break;
      }
    }

    if (isPhaseComplete) {
      let phaseIncrement = parseInt(this.state.phaseNumber, 10);
      phaseIncrement += 1;
      phaseIncrement += '';
      console.log('phaseIncrement: ', phaseIncrement);

      // let server know phase completed
      // TODO: Also send openLoan to the axios request to update if the loan is open o closed!
      const request = { currentStatus: phaseIncrement };
      axios
        .post(`http://localhost:3030/loan/${this.state.currentLoanId}`, request)
        .then((res) => {
          console.log('res.data.name: ', res.data.name);
          const userName = res.data.name;
          this.setState({ borrower: userName, assignments: [] });
          // refreh all data in this component
          this.getLoanData();
          this.sendNewLoanNotification();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  handlePhaseChange = (event) => {
    // console.log(event.target.value);
    // console.log(this.state.allAssignments);
    const filteredAssign = [];
    const updatePhase = event.target.value;
    // grabs the current url
    let getLoanId = window.location.href;
    // grabs username inside current url
    getLoanId = getLoanId.split('/').pop();
    axios
      .get(`http://localhost:3030/loan/${getLoanId}`)
      .then((loandata) => {
        const assignArr = loandata.data.assignments;
        console.log('all assigns', assignArr);
        for (let j = 0; j < assignArr.length; j += 1) {
          if (updatePhase === assignArr[j].phase) {
            filteredAssign.push(assignArr[j]);
          }
        }
        console.log('filtered assign', filteredAssign);
        this.setState({
          phaseTitle: PhaseContent[updatePhase].phaseTitle,
          phaseContent: PhaseContent[updatePhase].description,
          assignments: filteredAssign,
          phaseTitleNumber: updatePhase,
        });
        console.log(this.state.assignments);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  sendNewLoanNotification = () => {
    // axios request to get client name
    const request = { email: this.state.clientEmail };
    console.log('request from loan create: ', request);
    axios
      .post('http://localhost:3030/userbyemail', request)
      .then((res) => {
        console.log('res.data.name: ', res.data.name);
        const clientName = res.data.name;

        // const link = "https://loanie.herokuapp.com/";
        const message = `Hi ${clientName}! Congratulations! Your loan process has now moved to the next phase! If you have any trouble or questions you can contact by phone at 1-800-000-0000 or by email at loaniecs4@gmail.com .`;

        // axios request to send text notification.
        const textRequest = {
          phoneNumber: res.data.phoneNumber,
          text: message,
        };
        axios
          .post('http://localhost:3030/sendsms', textRequest)
          .then((resp) => {
            console.log('Success! Response from server: ', resp);
          })
          .catch((err) => {
            console.log('Loan creation failed.', err);
          });

        // axios request to send email notification.
        const emailRequest = {
          email: this.state.clientEmail,
          text: message,
        };
        axios
          .post('http://localhost:3030/sendemail', emailRequest)
          .then((response) => {
            console.log('Success! Response from server: ', response);
          })
          .catch((err) => {
            console.log('Loan creation failed.', err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
    
  }

  render() {
    // getter
    const token = this.state.tokenId;
    const user = this.state.userType;
    let loanRoute = '';
    let progressBarStyle = {};
    if (this.state.totalPhases.length === 5) {
      progressBarStyle = { marginLeft: '8.5em' };
    } else if (this.state.totalPhases.length === 6) {
      progressBarStyle = { marginLeft: '6.8em' };
    } else if (this.state.totalPhases.length === 8) {
      progressBarStyle = { marginLeft: '4.6em' };
    } else {
      progressBarStyle = { marginLeft: '6em' };
    }
    if (user === 'managerUser') loanRoute = '/open_loans';
    else loanRoute = '/my_loans';
    if (token === null || token === undefined || token === '') {
      window.location = '/login_user';
      return (
        <div>
          <h1> Please Login</h1>
        </div>
      );
    }
    return (
      <div>
        <Navbar />
        <div className="BreadCrumb">
          <Breadcrumb>
            <BreadcrumbItem tag="a" href="/">
              Home
            </BreadcrumbItem>
            <BreadcrumbItem tag="a" href={loanRoute}>
              Loans
            </BreadcrumbItem>
            <BreadcrumbItem active>Loan Details</BreadcrumbItem>
          </Breadcrumb>
        </div>
        <div className="ClientLoan-title-container">
          <h1>
            <b>{this.state.phaseTitle}</b>
          </h1>
        </div>
        <div className="ClientLoan-container">
          <div className="ClientLoan-borrower-container">
            <p>
              <b>Borrower: </b>
              {this.state.borrower}
            </p>
            <p>
              <b>Co-Borrower: </b>
              {this.state.coBorrower}
            </p>
            <p>
              <b>Type: </b>
              {this.state.type}
            </p>
            <p>
              <b>Amount:</b> ${this.state.amount}
            </p>
          </div>
          <div className="ClientLoan-progress-container">
            <div className="ClientLoan-phasetitle">
              <h5><b> Click on a number to see its phase </b></h5>
            </div>
            <div className="ClientLoan-phasebutton-container">
              {this.state.totalPhases.map((val, index) =>
                (
                  <div style={progressBarStyle} key={val.phase}>
                    <button key={val.phase} value={val.phase} onClick={this.handlePhaseChange}>{index + 1}</button>
                  </div>
                ))
              }
            </div>
            <br />
            <ProgressBar key={this.state.phaseNumber}/>
          </div>
        </div>
        <div className="ClientLoan-phase-container">
          <Card>
            <CardHeader> <h5><b>Phase {this.state.phaseTitleNumber}</b></h5></CardHeader>
            <CardBody>
              <p className="ClientLoan-phase-item">
                {' '}
                <b>{this.state.phaseContent}</b>
              </p>
            </CardBody>
          </Card>
        </div>
        <div className="ClientLoan-input-container">
          <Card>
            <CardHeader>
              <h5>
                <b>Complete these assignments to move to next phase</b>
              </h5>
            </CardHeader>
            <div className="ClientLoan-assignment-container">
              <p>
                <b>
                  Your loan officer will update these boxes as they recieve your documents. If you
                  have any questions call Bob Officer: 1-800-000-000.
                </b>
              </p>
            </div>
            <div className="ClientLoan-list-container" key={this.state.phaseTitleNumber}>
              {this.state.userType === 'managerUser' ? (
                  this.state.assignments.map((val, index) => {
                    const assignmentId = val._id;
                    console.log('val: ', val);
                    return (
                      <p>
                        <input
                          type="checkbox"
                          defaultChecked={val.complete}
                          onChange={() => { this.completedAssignment(assignmentId, index); }}
                        /> {val.text}
                      </p>
                    );
                  })
                 ) : (this.state.assignments.map((val) => {
                   console.log(val);
                    return (
                      <p>
                        <input
                          type="checkbox"
                          defaultChecked={val.complete}
                          disabled="disabled"
                        /> {val.text}
                      </p>
                    );
                  })
                )}
            </div>
          </Card>
        </div>
        <br />
        <p />
        <ClientSideNav />
      </div>
    );
  }
}
