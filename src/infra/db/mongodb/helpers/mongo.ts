import { MongoClient, type Collection } from 'mongodb'

export class MongoHelper {
  static client: MongoClient

  static async connect (uri: string): Promise<void> {
    this.client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  }

  static async disconnect (): Promise<void> {
    await this.client.close()
  }

  static getCollection (name: string): Collection {
    return this.client.db().collection(name)
  }

  static mapEntity<T> (entity: any): T {
    const { _id, ...entityWithoutId } = entity

    return Object.assign({}, entityWithoutId, { id: _id })
  }
}
