import React from 'react';
import styled from 'styled-components';
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Button,
  Modal,
  Form,
  ModalHeader,
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import {Link} from 'react-router-dom';
import Logo from '../../images/logo-white.svg';
import UserIcon from '../../images/user.svg';
import { connect } from 'react-redux';
import axiosWithAuth from '../../components/axiosAuth';
import jwt from 'jsonwebtoken';
import { dbUrl } from '../../actions';
import { deposit } from '../../actions';

const NavContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1;
    .talentnavbar {
        width: 100% !important;
        height: 11vh !important;
        background-color: #233842 !important;
        .nav-item .talent-link {
          font-family: 'Nunito Sans', sans-serif !important;
          text-transform: uppercase !important;
          color: rgb(255, 255, 255) !important;
          padding-top: 1em !important;
          margin-right: 3vw !important;
          font-weight: bolder !important;
          cursor: pointer;
        }
        .nav-item .username {
          font-family: 'Nunito Sans', sans-serif !important;
          text-transform: uppercase !important;
          color: rgb(255, 255, 255) !important;
          padding-top: 0.75em !important;
          font-size: 120% !important;
        }
    }
`;

const TertiaryNav = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    height: 9vh;
    background-color: rgb(159,164,195, 0.75);
    position: absolute;
    top: 10.5vh;
    z-index: 4;
    .link-container {
      height: 9vh;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .tert-link {
        font-family: 'Nunito Sans', sans-serif;
        text-transform: uppercase;
        color: rgb(255, 255, 255) !important;
        margin-right: 5vw;
        font-weight: bolder;
        cursor: pointer;
      }
      &:last-child {
        margin-right: 7%;
      }
    }
`;

const AppLogo = styled.img`
    width: 100%;
    height: 8.5vh;
`;

const IconStyle = styled.img`
    width: 100%;
    height: 9vh;
`;

const Divider = styled.div`
    height: 8vh;
    width: 1px;
    margin: 0 5vw;
    display:block; /* for use on default inline elements like span */
    overflow: hidden;
    background-color: #717F86;
`;

const DepositDiv = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    margin: 0 3vw;
`

const AccountBalance = styled.span`
  margin-right: 3vw;
  color: white;
`

const DepositModal = styled(Modal)`
  padding: 25px;
  width: 50%;
`

const StyledModalHeader = styled(ModalHeader)`
    margin: 25px;
`

const StyledForm = styled(Form)`
    margin: 25px;
    display: flex;
    flex-direction: column;
    align-items: center;
`

const StyledButton = styled(Button)`
    width: 50%;
    margin: 0 auto;
`
const StyledFormGroup = styled(FormGroup)`
    width: 100%;
`
const DepositButton = styled(Button)`
  width: 50%;
  margin: 0 auto;
  background-color: #556080;
`

class TalentNavigation extends React.Component {

    constructor(props) {
      super(props)
      this.state = {
        talent: {},
        depositModalIsOpen: false,
        depositAmount: 0
      }
    }

    componentDidMount = async () => {
      let userId = jwt.decode(localStorage.getItem('token')).userId;
      await axiosWithAuth()
        .get(`${dbUrl}/api/talents/profile/${userId}`)
        .then(res => this.setState({talent: res.data[0]}))
      console.log(this.state.talent)
    }

    logout = e => {
      e.preventDefault();
      localStorage.removeItem('token');
      this.props.history.push('/');
    }

    route = (route, e) => {
      e.preventDefault();
      this.props.history.push(`/talent${route}`)
    }

    toggleDepositModal = () => {
      this.setState({depositModalIsOpen: !this.state.depositModalIsOpen})
    }

    changeHandler = event => {
      this.setState({
        [event.target.name]: event.target.value
      })
    }

    clickHandler = () => {
      this.props.deposit(this.state.talent, this.state.depositAmount)
      this.setState({talent: {...this.state.talent, accountBalance: parseFloat(this.state.talent.accountBalance) + parseFloat(this.state.depositAmount)}})
      this.toggleDepositModal()
    }

    render() {
        return (
            <NavContainer>
              <DepositModal
                isOpen={this.state.depositModalIsOpen}
                toggle={this.toggleDepositModal}
                centered={true}
                size="lg"
              >
                <StyledModalHeader>Deposit Funds</StyledModalHeader>
                <StyledForm className="depositModalForm">
                    <StyledFormGroup>
                        <Label>Amount To Deposit:</Label>
                        <Input type="number" onChange={this.changeHandler} name="depositAmount"></Input>
                    </StyledFormGroup>
                    <StyledButton onClick={this.clickHandler}>Deposit</StyledButton>
                </StyledForm>
              </DepositModal>
              <Navbar className="talentnavbar" expand="md">
                <NavbarBrand href="/">
                    <AppLogo src={Logo} />
                </NavbarBrand>
                  <Nav className="ml-auto" navbar>
                    <NavItem>
                      <NavLink className="talent-link" onClick={(e) => this.route('/', e)}>
                            Marketplace
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink className="talent-link" onClick={this.logout}>Logout</NavLink>
                    </NavItem>
                    <NavItem>
                      <Divider />
                    </NavItem>
                    <NavItem>
                      <NavLink className='username'>{this.state.talent.firstName} {this.state.talent.lastName}</NavLink>
                    </NavItem>
                    <NavItem>
                      <IconStyle src={UserIcon} />
                    </NavItem>
                  </Nav>
              </Navbar>
              <TertiaryNav>
                <DepositDiv>
                  <AccountBalance>
                    {`Account Balance: $${this.state.talent.accountBalance}`}
                  </AccountBalance>
                  <DepositButton onClick={this.toggleDepositModal}>
                    Deposit
                  </DepositButton>
                </DepositDiv>
                <div className="link-container">
                  <NavLink onClick={(e) => this.route('/applications', e)} className='tert-link'>
                    Applications
                  </NavLink>
                  <NavLink onClick={(e) => this.route('/profile', e)} className='tert-link'>
                    My Profile
                  </NavLink>
                  <NavLink onClick={(e) => this.route('/reviews', e)} className='tert-link'>
                    Reviews
                  </NavLink>
                </div>
              </TertiaryNav>
            </NavContainer>
        )};
};

const mapStateToProps = (state) => ({
  talent: state.getTalentReducer.talent
})

export default connect(mapStateToProps, {deposit})(TalentNavigation);