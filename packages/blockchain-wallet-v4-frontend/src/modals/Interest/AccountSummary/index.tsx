import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import React, { PureComponent } from 'react'

import { actions } from 'data'
import {
  CoinType,
  InterestAccountBalanceType,
  InterestRateType,
  RemoteDataType,
  SupportedCoinsType
} from 'core/types'
import { InterestStepMetadata } from 'data/types'
import DataError from 'components/DataError'

import { getData } from './selectors'
import AccountSummary from './template.success'
import Loading from './template.loading'

class AccountSummaryContainer extends PureComponent<Props, State> {
  state: State = {
    showMoreDetails: false
  }

  handleDepositClick = () => {
    this.props.interestActions.showInterestModal('DEPOSIT')
  }

  toggleMoreDetails = () => {
    this.setState({ showMoreDetails: !this.state.showMoreDetails })
  }

  handleRefresh = () => {
    this.props.interestActions.showInterestModal('ACCOUNT_SUMMARY')
  }

  render () {
    const { data } = this.props
    return data.cata({
      Success: val => (
        <AccountSummary
          {...val}
          {...this.props}
          {...this.state}
          handleDepositClick={this.handleDepositClick}
          toggleMoreDetails={this.toggleMoreDetails}
        />
      ),
      Failure: () => <DataError onClick={this.handleRefresh} />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state): LinkStatePropsType => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  interestActions: bindActionCreators(actions.components.interest, dispatch),
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
)

export type OwnProps = {
  handleClose: () => void
  handleSBClick: () => void
  stepMetadata: InterestStepMetadata
}

export type LinkDispatchPropsType = {
  interestActions: typeof actions.components.interest
  simpleBuyActions: typeof actions.components.simpleBuy
}

export type SuccessStateType = {
  accountBalances: InterestAccountBalanceType
  coin: CoinType
  interestRate: InterestRateType
  supportedCoins: SupportedCoinsType
}

export type State = {
  showMoreDetails: boolean
}

type LinkStatePropsType = {
  data: RemoteDataType<string | Error, SuccessStateType>
}

type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(AccountSummaryContainer)