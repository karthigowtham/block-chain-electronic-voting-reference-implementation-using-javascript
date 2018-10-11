import React, { Component } from 'react';
import axios from 'axios';

const Chain = (props) => {
    let time = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(props.ch.timestamp)
    let txn = props.ch.transactions;
    return (
        <tr>
            <td>{props.ch.blockId}</td>
            <td>{time}</td>
            <td><button className='btn btn-sm btn-warning' data-toggle='modal' data-target='#viewTxns' onClick={() => props.viewTxn(txn, 'Selected Transactions')}>View Transaction</button></td>
        </tr>
    );
}

const PrintChainList = (props) => {
    return (
        props.blockChain.map((ch, i) => <Chain ch={ch} key={ch.blockId} index={i} viewTxn={props.viewTxn} />)
    );
}

const Transaction = (props) => {
    return (
        <tr>
            <th>{props.txn.id}</th>
            <th>{props.txn.voter}</th>
            <th>{props.txn.candidate}</th>
            <th>{props.txn.vote}</th>
        </tr>
    );
}
export default class Home extends Component {
    state = {
        blockChain: {
            chain:
            [
                {
                    blockId: "ad28773d-85e7-48d7-8fd3-3ccda2fc96b1",
                    timestamp: 1539157813611,
                    transactions: "Genesys Block",
                    hash: "43b92a4e296e9c38e6e93785ae1ac5cc618adeb5cb3c5695f7917d194b547569",
                    prevHash: "",
                    nonce: 0
                }
            ],
            pendingTransactions: [],
            rejectedTransactions: []
        },
        selectedTxn: [],
        modelTitle: ''
    }
    componentDidMount() {
        this.getBlockList();
    }
    getBlockList = () => {
        let self = this;
        axios.get('/api/blockchain/chain').then(
            resp => {
                self.setState({
                    blockChain: resp.data
                }
                );
            },
            err => {
                console.log(err);
            }
        )
    }

    viewTxn = (txn, title) => {
        this.setState({
            selectedTxn: txn,
            modelTitle: title
        })
    }

    updateMyChain = () => {
        let self = this;
        axios.get('/api/updateMyChain').then(
            resp => {
                axios.get('/api/blockchain/chain').then(
                    resp => {
                        self.setState({
                            blockChain: resp.data
                        });
                    },
                    err => {
                        console.log(err);
                    }
                )
            },
            err => {
                console.log(err);
            }
        )
    }

    render() {
        return (
            <div>
                <br />
                <button className='btn btn-sm btn-light' onClick={this.getBlockList}>Refresh</button>&nbsp;
                <button className='btn btn-sm btn-light' data-toggle='modal' data-target='#viewTxns'
                    onClick={() => this.viewTxn(this.state.blockChain.pendingTransactions, 'Pending Transactions')}>
                    Pending Transactions
                </button>&nbsp;
                <button className='btn btn-sm btn-light' data-toggle='modal' data-target='#viewTxns'
                    onClick={() => this.viewTxn(this.state.blockChain.rejectedTransactions, 'Rejected Transactions')}>
                    Rejected Transactions
                </button> &nbsp;
                <button className='btn btn-sm btn-light' onClick={this.updateMyChain}>
                    Update My Chain
                </button>
                <hr />
                <table className="table">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">BlockId</th>
                            <th scope="col">timestamp</th>
                            <th scope="col">Transactions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <PrintChainList blockChain={this.state.blockChain.chain} viewTxn={this.viewTxn} />
                    </tbody>
                </table>
                <div className="modal" tabIndex="-1" role="dialog" id='viewTxns'>
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content bg-dark">
                            <div className="modal-header">
                                <h5 className="modal-title">{this.state.modelTitle}</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <table className="table">
                                    <thead className="thead-light">
                                        <tr>
                                            <th>Txn Id</th>
                                            <th>Voter</th>
                                            <th>Candidate</th>
                                            <th>Vote</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.selectedTxn.map(txn => <Transaction txn={txn} key={txn.id} />)}
                                    </tbody>
                                </table>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
