import React from 'react'
import { connect } from 'react-redux'
import DisplayTable from './DisplayTable'
import { Sidebar, CreateLoad, TableData } from './index';
/**
 * COMPONENT
 */
export const SchemaPage = (props) => {
    const { isLoggedIn } = props
    return (
        <div className='schema'>
            <div className='schild1'>
                <Sidebar />
            </div>
            <div className='schild2'>
                {
                    isLoggedIn
                        ? <CreateLoad />
                        : <div />
                }
                <DisplayTable />
                <TableData />
            </div>
        </div>
    )
}

/**
 * CONTAINER
 */
const mapState = (state) => {
    return {
        isLoggedIn: !!state.user.id,
        metatable: state.metatable,
        temp: state.temp
    }
}

export default connect(mapState)(SchemaPage)
