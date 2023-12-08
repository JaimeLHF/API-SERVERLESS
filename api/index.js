'use restrict'

const { buildResponse } = require('./util')
const { getUserCredentials, saveResultsDataBase, getResultById, getResults, deleteResultById } = require('./database')
const { authorize, createToken, makeHash } = require('./auth/auth')

function extractBody(event) {
  if (!event?.body) {
    return buildResponse(422, { error: 'Missing body' })
  }

  return JSON.parse(event.body)
}


module.exports.login = async (event) => {

  const { username, password } = extractBody(event);
  const hashedPass = makeHash(password)

  const user = await getUserCredentials(username, hashedPass)

  if (!user) {
    return buildResponse({ error: 'Invalid User!' })
  }

  return buildResponse(200, {
    token: createToken(username, user._id)
  })
}


module.exports.sendResponse = async (event) => {

  const authResult = await authorize(event)

  if (authResult.statusCode === 401) return authResult

  const sku = extractBody(event)

  const insertedId = await saveResultsDataBase(sku)

  return buildResponse(201, {
    resultId: insertedId,
    __hypermedia: {
      href: `/results.html`,
      query: { sku: sku }
    }
  })

}

module.exports.getResult = async (event) => {

  const authResult = await authorize(event)

  if (authResult.statusCode === 401) return authResult

  const result = await getResultById(event.pathParameters.id)


  if (!result) {
    return buildResponse(404, { error: 'Result not found!' })
  }
  return buildResponse(202, result)

}

module.exports.deletResult = async (event) => {

  const authResult = await authorize(event)

  if (authResult.statusCode === 401) return authResult

  const result = await deleteResultById(event.pathParameters.id)


  if (!result) {
    return buildResponse(404, { error: 'Result not found!' })
  }
  return buildResponse(202, "Item deletado com Sucesso!", result)

}


module.exports.getAllResults = async (event) => {

  const authResult = await authorize(event)

  if (authResult.statusCode === 401) return authResult

  const results = await getResults(event)


  if (!results) {
    return buildResponse(404, { error: 'Result not found!' })
  }
  return buildResponse(202, results)

};