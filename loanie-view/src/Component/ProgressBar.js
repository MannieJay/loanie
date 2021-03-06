import React, { Component } from 'react';
import axios from 'axios';
import PhaseContent from './PhaseContent';
import '../CSS/ProgressBar.css';

export default class ProgressBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progressValue: 0,
      currentPhase: '',
      totalPhases: 0,
    };
  }
  componentDidMount() {
    // grabs the current url
    let getLoanId = window.location.href;
    // grabs username inside current url
    getLoanId = getLoanId.split('/').pop();
    axios
      .get(`http://localhost:3030/loan/${getLoanId}`)
      .then((loandata) => {
        // filter loan phases based on the loantype
        const filteredLoans = PhaseContent.filter(post =>
          post.loanType.includes(loandata.data.loanType));
        // records the length of filtered loans to indicate total number of phases
        const totalPhaseNo = filteredLoans.length;
        this.setState({
          currentPhase: loandata.data.currentStatus,
          progressValue: Number(loandata.data.currentStatus) * (100 / totalPhaseNo),
          totalPhases: totalPhaseNo,
        });
      })
      .catch((err) => {
        throw err;
      });
  }
  render() {
    return (
      <div className="ProgressBar">
        <div className="progress ProgressBar-container">
          <div
            className="progress-bar ProgressBar-style progress-bar-success"
            role="progressbar"
            aria-valuenow={this.state.progressValue}
            style={{ width: `${((this.state.progressValue / (100 / this.state.totalPhases)) * (68.5 / this.state.totalPhases))}em` }}
          >
            Current Phase: {this.state.currentPhase}
          </div>
        </div>
      </div>
    );
  }
}
