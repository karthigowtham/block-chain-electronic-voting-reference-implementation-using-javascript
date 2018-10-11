import React, { Component } from 'react';
import axios from 'axios';
import Candidates from './Candidate';

const CandidateTag = (props) => {
    return (
        props.candidates.map(cnd => {
            return (<tr>
                <td>
                    <span className="symbol">{cnd.symbol}</span>
                </td>
                <td>{cnd.name}</td>
                <td>{cnd.party}</td>
                <td>{cnd.count}</td>
            </tr>)
        })
    );
}


class Result extends Component {
    state = {
        candidates: Candidates
    }
  componentDidMount() {
        this.votingCount();
    }
    votingCount = () => {
        let self=this
        axios.post('/api/countVote',{candidates:Candidates})
            .then(resp => {
                self.setState({
                    candidates: resp.data.candidates
                });
            })
    }

    render() {
        return (
            <div>
                <br />
                <hr />
                <table className="table">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">Symbol </th>
                            <th scope="col">Candidate</th>
                            <th scope="col">Party</th>
                            <th scope="col">Vote Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        <CandidateTag candidates={this.state.candidates} key={this.state.candidates.id} />
                    </tbody>
                </table>
            </div>
        )
    }
}

export default Result;