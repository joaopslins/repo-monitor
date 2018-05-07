import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { RepoAdd, CommitList, Alert, Paginator } from "../../components";

import {
    setAlertAction,
    clearAlertAction,
    repoAddAction,
    fetchCommitsAction,
    setRepoFilterAction,
    clearRepoFilterAction
} from "../../actions/commitActions";

class AppPage extends Component {

    componentDidMount() {
        const { fetchCommits, repoFilter } = this.props;
        fetchCommits(1, repoFilter);
    }

    handleRepoAdd(reponame) {
        const { repoAddStart } = this.props;
        repoAddStart(reponame);
    }

    handleRepoAddError(error) {
        const { setAlertError } = this.props;
        setAlertError(error);
    }

    handleAlertDismiss() {
        const { clearAlert } = this.props;
        clearAlert();
    }

    handleRepoSelect(reponame) {
        const { setRepoFilter, fetchCommits } = this.props;
        setRepoFilter(reponame);
        fetchCommits(1, reponame);
    }

    handleRepoClear() {
        const { clearRepoFilter, fetchCommits } = this.props;
        clearRepoFilter();
        fetchCommits(1);
    }

    handlePaginatorAction(page) {
        const { repoFilter, fetchCommits } = this.props;
        fetchCommits(page, repoFilter);
    }

    render() {
        const {
            isLogged,
            repoAddLoading,
            alertMessage,
            alertType,
            commitList,
            commitsLoading,
            repoFilter,
            pageConfig
        } = this.props;

        if (!isLogged) return <Redirect to="/landing/" />;

        const loadingIcon = commitsLoading ? (
            <div className="m-3 text-center">
                <i className="fas fa-3x fa-sync fa-spin"></i>
            </div>
        ) : (null);

        const header = repoFilter ? (
            <h4>Filtering by {repoFilter}
                <div className="btn btn-dark ml-2 py-0 px-1 cursor-pointer" title="Clear filter" onClick={() => this.handleRepoClear()}>
                    <i className="fas fa-fw fa-sm fa-times"></i>
                </div>
            </h4>
        ) : (<h4>All repositories</h4>)

        return (
            <div>
                <div>
                    <Alert
                        msg={alertMessage}
                        type={alertType}
                        onDismiss={() => this.handleAlertDismiss()}
                    />
                </div>
                <div className="row">
                    <div className="col-12 col-md-6">
                        {header}
                    </div>

                    <div className="col-12 col-md-6 offset-lg-2 col-lg-4">
                        <RepoAdd
                            onAdd={reponame => this.handleRepoAdd(reponame)}
                            onError={error => this.handleRepoAddError(error)}
                            loading={repoAddLoading}
                            />
                    </div>
                </div>
                <div className="mt-3">
                    <CommitList list={commitList} onRepoSelect={(reponame) => this.handleRepoSelect(reponame)}/>
                    <Paginator config={pageConfig} onAction={(newPage) => this.handlePaginatorAction(newPage)}/>
                </div>
                {loadingIcon}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLogged: state.auth.hasSession,

        alertMessage: state.commit.alertMessage,
        alertType: state.commit.alertType,
        repoAddLoading: state.commit.repoAddLoading,

        commitList: state.commit.commitList,
        commitsLoading: state.commit.commitsLoading,

        repoFilter: state.commit.repoFilter,
        pageConfig: state.commit.pageConfig
    };
};

const mapDispatchToProps = dispatch => {
    return {
        repoAddStart: (reponame, page, repoFilter) => dispatch(repoAddAction(reponame, page, repoFilter)),
        fetchCommits: (page, repoFilter) => dispatch(fetchCommitsAction(page, repoFilter)),

        setAlertError: error => dispatch(setAlertAction(error, 'ERROR')),
        clearAlert: error => dispatch(clearAlertAction()),

        setRepoFilter: reponame => dispatch(setRepoFilterAction(reponame)),
        clearRepoFilter: reponame => dispatch(clearRepoFilterAction(reponame))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppPage);
