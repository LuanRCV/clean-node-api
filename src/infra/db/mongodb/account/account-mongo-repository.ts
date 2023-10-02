import { type AddAccountRepository } from '../../../../data/protocols/db/account/add-account-repository'
import { type LoadAccountByEmailRepository } from '../../../../data/protocols/db/account/load-account-by-email-repository'
import { type UpdateAccessTokenRepository } from '../../../../data/protocols/db/account/update-access-token-repository'
import { type LoadAccountByIdRepository } from '../../../../data/usecases/load-account-by-token/db-load-account-by-token-protocols'
import { type AccountModel } from '../../../../domain/models/account'
import { type AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository, LoadAccountByIdRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)
    const account = result.ops[0]

    return MongoHelper.mapEntity<AccountModel>(account)
  }

  async loadByEmail (email: string): Promise<AccountModel | null> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({ email })

    if (account) {
      return MongoHelper.mapEntity<AccountModel>(account)
    }

    return null
  }

  async loadById (id: string): Promise<AccountModel | null> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({ _id: id })

    if (account) {
      return MongoHelper.mapEntity<AccountModel>(account)
    }

    return null
  }

  async updateAccessToken (id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.updateOne({
      _id: id
    }, {
      $set: {
        accessToken: token
      }
    })
  }
}
