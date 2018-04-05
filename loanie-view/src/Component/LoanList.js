import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
// import { connect } from 'react-redux';
import Navbar from './Navbar';
import SidebarNav from './SideBarNav';
import '../CSS/LoanList.css';

class LoanList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tokenId: sessionStorage.getItem('tokenId'),
    };
  }

  componentWillMount() {
    // if (this.props.tokenId === '') window.location = '/login_user';
  }

  selectLoan = () => {
    console.log(this.state.username);
  };
  render() {
    // getter
    const token = this.state.tokenId;
    console.log(sessionStorage.getItem('tokenId'));
    console.log('state tokenId:', token);
    if (token === null || token === undefined || token === '') {
      window.location = '/login_user';
      return (
        <div>
          <h1> Please Login</h1>
        </div>
      );
    }
    return (
      <div className="Loanlist">
        <SidebarNav />
        <Navbar />
        <div className="BreadCrumb">
          <Breadcrumb>
            <BreadcrumbItem tag="a" href="/">
              Home
            </BreadcrumbItem>
            {' > '}
            <BreadcrumbItem active>Loans</BreadcrumbItem>
          </Breadcrumb>
        </div>
        <div className="Loanlist-title-containter">
          <h1> Add a new Loan</h1>
        </div>
        <div className="Loanlist-image-container">
          <Link to="/create_loan">
            <img
              className="Loanlist-image-item"
              src="https://cdn.pixabay.com/photo/2012/04/02/15/48/sign-24805_960_720.png"
              alt="plus_sign"
            />
          </Link>
        </div>
      </div>
    );
  }
}

export default LoanList;
