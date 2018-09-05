import React, { Component } from 'react'

class Members extends Component {

    render() {
        const styles = {
            container: {
                margin: 10
            },
            ul: {
                listStyle: 'none',
            },
            li: {
                marginTop: 13,
                marginBottom: 13,
                color: 'burlywood',
            }
        }
        return (
            <div style={styles.container}>
                <ul style={styles.ul}>
                    {this.props.members.map((user, index) => (
                        <li key={index} value={user} style={styles.li}>
                            {user}
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
}

export default Members