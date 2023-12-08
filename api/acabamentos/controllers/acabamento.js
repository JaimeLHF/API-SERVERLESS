const { buildResponse } = require('../../util.js')
const { saveResultsDataBase } = require('../../database.js')
const { authorize } = require('../../auth/auth.js')

function extractBody(event) {
    if (!event?.body) {
      return buildResponse(422, { error: 'Missing body' })
    }
  
    return JSON.parse(event.body)
  }

module.exports.sendAcabamento = async (event) => {

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