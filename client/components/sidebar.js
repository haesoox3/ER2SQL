import React, { Component } from 'react';
import {connect} from 'react-redux';
import {getUserDatabases} from '../store'
import { Link } from 'react-router-dom';
import axios from 'axios';
import {CreateTable, Field, CreateDB, RemoveTable, LoadDB, AddAssociation} from './index';

class Sidebar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showCreateTable: false,
            showRemoveTable: false
        }
        // this.showBothForm = this.showBothForm.bind(this)
        this.showCreateTableForm = this.showCreateTableForm.bind(this);
        this.showRemoveTableForm = this.showRemoveTableForm.bind(this);
    }
    showCreateForm(evt) {
        evt.preventDefault()
        this.setState({
            showCreateTable: false,
            showRemoveTable: false
        })
    }

    showLoadForm(evt) {
        evt.preventDefault()
        this.setState({
            showCreateTable: false,
            showRemoveTable: false
        })
    }

    showCreateTableForm(e) {
        e.preventDefault();
        this.setState({
            showCreateTable: true,
            showRemoveTable: false
        })
    }

    showRemoveTableForm(e) {
        e.preventDefault();
        this.setState({
            showCreateTable: false,
            showRemoveTable: true
        })
        //Remove this check once we have our home page not showing
        // createdb/ loaddb options before logging in
        if (this.props.user.id){
            this.props.getUserDatabases(this.props.user.id);
        }
    }
    // showBothForm(evt){
    //     evt.preventDefault()
    //     if(this.state.showLoad){
    //         this.state
    //     }
    //     this.setState({
    //         showLoad: !this.state.showLoad,
    //         showCreate: !this.state.showCreate
    //     })
    // }
    render() {
        return (
            <div>
                <h1>Options</h1>
                <button onClick={this.showRemoveTableForm}>RemoveTable</button>
                <button onClick={this.showCreateTableForm}>Create Table</button>
                {this.state.showCreateTable ? <CreateTable /> : null}
                {this.state.showRemoveTable ? <RemoveTable /> : null}
                <AddAssociation/>
            </div>
        )
    }
}

const mapStateToProps = ({user, userdbs}) => ({user, userdbs});

const mapDisptachProps = (dispatch) => {
  return {
    getUserDatabases(userId){
      console.log('userId: ', userId);
      dispatch(getUserDatabases(userId))
    }
  }
}

export default connect(mapStateToProps, mapDisptachProps)(Sidebar);
