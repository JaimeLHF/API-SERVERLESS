const { MongoClient, ObjectId } = require("mongodb")

let connectionInstance = null

async function connectDataBase() {
    if (connectionInstance) return connectionInstance

    const client = new MongoClient(process.env.MONGODB_CONNECTIONSTRING)
    const connection = await client.connect()
    connectionInstance = connection.db(process.env.MONGODB_DB_NAME)

    return connectionInstance

}

async function saveResultsDataBase(result) {

    const client = await connectDataBase();
    const collection = client.collection('produtos')
    const { insertedId } = await collection.insertOne(result)

    return insertedId
}

async function getResultById(id) {
    const client = await connectDataBase();
    const collection = client.collection('produtos')

    const result = await collection.findOne({
        _id: new ObjectId(id)
    })

    if (!result) return null

    return result
}

async function getResults() {
    const client = await connectDataBase();
    const collection = client.collection('produtos')

    const results = await collection.find({}).toArray();

    if (!results) return null

    return results
}

async function deleteResultById(id) {
    const client = await connectDataBase();
    const collection = client.collection('produtos')

    const result = await collection.deleteOne({
        _id: new ObjectId(id)
    })

    if (!result) return null

    return result
}

async function getUserCredentials(username, password) {
    const client = await connectDataBase()
    const collection = await client.collection('users')
    const user = await collection.findOne({
        username: username,
        password: password
    })

    if (!user) return null
    return user
}

module.exports = {
    getUserCredentials,
    saveResultsDataBase,
    getResultById,
    getResults,
    deleteResultById
}