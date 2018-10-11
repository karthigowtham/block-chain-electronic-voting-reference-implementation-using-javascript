import React, { Component } from 'react';
import axios from 'axios';
import Candidates from './Candidate';

const CandidateTag = (props) => {
    return (
        props.candidates.map(cnd => {
            return (<tr>
                <td>
                    <span className='radio'>
                        <input name='candidate' type="radio" value={cnd.id} id={cnd.id} onChange={props.handleChange} />
                    </span>
                </td>
                <td>
                    <span className="symbol">{cnd.symbol}</span>
                </td>
                <td>{cnd.name}</td>
                <td>{cnd.party}</td>
            </tr>)
        })
    );
}


class Vote extends Component {

    state = {
        candidates: Candidates,
        selectedId: 0,
        alreadyVoted: false,
        voteStatus: 'Please Vote'
    }

    componentDidMount() {
        this.checkMyVote();
        this.myTransactionStatus();
    }

    myTransactionStatus = () => {
        let self = this;
        axios.get('/api/myTransactionStatus?user=' + window.user).then(
            resp => {
                self.setState({
                    voteStatus: resp.data
                });
            },
            err => {
                console.log(err);
            }
        )
    }

    checkMyVote = () => {
        let self = this;
        axios.get('/api/checkMyVote?user=' + window.user).then(
            resp => {
                self.setState({
                    alreadyVoted: resp.data
                }
                );
            },
            err => {
                console.log(err);
            }
        )
    }
    handleChange = (event) => {
        this.setState({
            selectedId: event.target.value
        });
    }
    handleSubmit = (event) => {
            event.preventDefault();
        if(this.state.selectedId==0){
            alert("Please select a candidate");
            return ;
        }
        let self = this;
    
        let seleCand = Candidates.find((cnd) => {
            return cnd.id == this.state.selectedId
        });
        let candidateName = seleCand.name;
        axios.post('/api/transaction', {
            voter: window.user,
            candidate: candidateName
        }).then(function (response) {
            console.log(response);
            self.setState({
                alreadyVoted: true
            });
        }).catch(function (error) {
            console.log(error);
        });
    }
    render() {
        return (
            <div>
                <br />
                <div className="alert alert-success" role="alert">
                    <button className='btn btn-sm btn-success' onClick={this.myTransactionStatus}>Check Status</button>
                    <br />
                    Status of your vote is : {this.state.voteStatus}
                </div>
                <form onSubmit={this.handleSubmit}>
                    <button className='btn btn-sm btn-light' type='submit' disabled={this.state.alreadyVoted}>Cast Vote</button>&nbsp;
                <hr />
                    <table className="table">
                        <thead className="thead-dark">
                            <tr>
                                <th scope="col">Select</th>
                                <th scope="col">Symbol </th>
                                <th scope="col">Candidate</th>
                                <th scope="col">Party</th>
                            </tr>
                        </thead>
                        <tbody>
                            <CandidateTag candidates={this.state.candidates} key={this.state.candidates.id} handleChange={this.handleChange} />
                        </tbody>
                    </table>
                </form>
            </div>
        )
    }
}

export default Vote;