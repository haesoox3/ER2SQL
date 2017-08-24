import React, { Component } from 'react';
import { connect } from 'react-redux';
import { sendMail, getUserDatabases } from '../store'
import { Link } from 'react-router-dom';
import axios from 'axios';
import {EndpointsInfo, Field, CreateDB, RemoveTable, LoadDB, Modal, ShowAssociationForm, ShowCreateForm, ShowLoadForm, ShowLoadDataForm, LoadData, ShowModal, UpdateTableName, ShowSQL, ShowTableForm, ShowRemoveTable } from './index';

class Sidebar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showUpdateTable: false,
            showEndpoints: false
        }
        this.showUpdateTableName = this.showUpdateTableName.bind(this);
        this.showEndpointInfo = this.showEndpointInfo.bind(this);
    }

    showUpdateTableName(e) {
        e.preventDefault();
        this.setState({
            showCreateTable: false,
            showRemoveTable: false,
            showUpdateTable: true
        })
    }
    showEndpointInfo(e){
        e.preventDefault();
        this.setState({
            showUpdateTable: false,
            showEndpoints: true
        })
        this.props.sendEmail();
    }
    // showEndpointInfo(e){
    //     e.preventDefault();
    //     var transporter = nodemailer.createTransport({
    //         service: 'gmail',
    //         auth: {
    //           user: 'simpleql17@gmail.com',
    //           pass: 'flower1234'
    //         }
    //       });
          
    //       var mailOptions = {
    //         from: 'simpleql17@gmail.com',
    //         to: 'monica.choe94@gmail.com',
    //         subject: 'Sending Email using Node.js',
    //         text: 'That was easy!'
    //       };
          
    //       transporter.sendMail(mailOptions, function(error, info){
    //         if (error) {
    //           console.log(error);
    //         } else {
    //           console.log('Email sent: ' + info.response);
    //         }
    //       });
    // }

    render() {
        return (
            <div className='sidebar'>
                <div className='buttons'>
                    <h1>Database: {this.props.database.name}</h1>
                    <ShowCreateForm/>
                    <ShowLoadForm/>
                    <ShowTableForm/>
                    <button onClick={this.showUpdateTableName}>Update Table Name</button>
                    <ShowSQL/>
                    <ShowRemoveTable/>
                    <ShowAssociationForm/>
                    <ShowLoadDataForm/>
                    <button onClick={this.showEndpointInfo}>DevId and API Key</button>
                    {this.state.showUpdateTable ? <UpdateTableName /> : null}
                    {this.state.showEndpoints ? <EndpointsInfo /> : null}
                    
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({ user, userdbs, database }) => ({ user, userdbs, database });

const mapDispatchProps = (dispatch) => {
    return {
        getUserDatabases(userId) {
            dispatch(getUserDatabases())
        },
        sendEmail(){
            dispatch(sendMail());
        }
    }
}

export default connect(mapStateToProps, mapDispatchProps)(Sidebar);
