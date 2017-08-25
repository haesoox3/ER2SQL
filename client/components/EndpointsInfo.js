import React, {Component} from 'react';
import {connect} from 'react-redux';
import {sendMail} from '../store';
import Modal from './Modal';

class EndpointsInfo extends Component {
    constructor(props){
        super(props);
        this.state = {
            showEndpoints : false,
        }
        this.showInfo = this.showInfo.bind(this);
    }
    showInfo(e){
        e.preventDefault();
        this.setState({
            showEndpoints : !this.state.showEndpoints
        });
        if (this.state.showEndpoints){
            this.props.sendEmail();
        }
    }
    render(){
        return (
            <div className = 'ShowModal'>
            <button onClick={this.showInfo}>REQUEST ENDPOINT</button>
            <Modal className = 'modal' show={this.state.showEndpoints}
                onClose={this.showInfo}>
                <p>DevId : {this.props.user.devId}</p>
                <p>Instructions: md5 hash devId + apiKey + UTC time</p>
                <button className = 'tablebutton' onClick ={this.showInfo}>✕</button>
            </Modal>
        </div>
        )
    }
}

const mapState = (state) => {
    return {
        user : state.user
    }
}

const mapDispatch = dispatch => {
    return {
        sendEmail(){
            dispatch(sendMail());
        }
    }
}

export default connect(mapState, mapDispatch)(EndpointsInfo);