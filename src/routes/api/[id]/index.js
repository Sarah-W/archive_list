
// @ts-ignore
export async function get({params}) {
  let digitalnz=`https://api.digitalnz.org/v3/records/${params.id}.json`
  console.log({digitalnz})
  let resp = fetch(digitalnz)
  .then(response => response.json())

  return { 
    status: 200, 
    body: await resp
  }
}