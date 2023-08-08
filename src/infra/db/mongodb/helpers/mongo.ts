import { MongoClient, type Collection } from 'mongodb'

export class MongoHelper {
  static client: MongoClient
  static uri: string

  static async connect (uri: string): Promise<void> {
    this.uri = uri
    this.client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  }

  static async disconnect (): Promise<void> {
    await this.client.close()
  }

  static async getCollection (name: string): Promise<Collection> {
    if (!this.client.isConnected()) {
      await this.connect(this.uri)
    }

    return this.client.db().collection(name)
  }

  static mapEntity<T> (entity: any): T {
    const { _id, ...entityWithoutId } = entity

    return Object.assign({}, entityWithoutId, { id: _id })
  }
}
