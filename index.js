const {send} = require('micro');
const url = require('url');
const level = require('level');
const promisify = require('then-levelup');

const visits = {}

const db = promisify(level('visits.db'), {
  valueEncoding: 'json'
})

module.exports = async function(request, response){
  const {pathname} = url.parse(request.url)

  try{
    const currentVisits = await db.get(pathname);
    await db.put(pathname, Number(currentVisits) + 1)
  } catch(error){
    if(error.notFound){
      await db.put(pathname, 1)
    }
  }

  send(response, 200, `hello ${await db.get(pathname)}`)
}
