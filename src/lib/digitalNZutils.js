const digitalnz=`https://api.digitalnz.org/v3/records.json`

let categories = [
  "Newspapers", 
  "Images", 
  "Books", 
  "Articles", 
  "Journals", 
  "Archives", 
  "Audio", 
  "Other", 
  "Manuscripts", 
  "Reference sources", 
  "Research papers", 
  "Videos", 
  "Music Score", 
  "Groups", 
  "Data", 
  "Websites", 
  "Sets"
]

const primaryCollections = async (category="",page=0)=>{
  let url = `${digitalnz}?&facets=primary_collection&facets_per_page=350&facets_page=${page+1}`
  if(category){url=url+`&and[category][]=${category}`}
 console.log(url)
 let resp = fetch(url)
  .then(response => response.json())
  .then(d=>{console.log(d.search.facets.primary_collection);return d})
  .then(d => Object.keys(d.search.facets.primary_collection))
  return await resp
}

const searchByTerm = async (text='cat')=>{
  const url = `${digitalnz}?text=${text}`
  let resp = fetch(url)
    .then(response => response.json())
  return await resp
}

const searchByCategory = async (category='Newspapers')=>{
  //category must be one of categories above
  if(!categories.find(d=>d==category)){return }
  const url = `${digitalnz}?and[category][]=${category}`
  console.log(url)
  let resp = fetch(url)
    .then(response => response.json())
  return await resp
}




const searchWithParams = async (/** @type {object} */ searchparams)=>{
  const defaultparams={
    text:"",
    category:"",
    primary_collection:""
  }
  const reducer = (/** @type {string} */ accumulator, /** @type {any[]} */ d)=>{
    accumulator =  accumulator ? accumulator : ""
    console.log(accumulator)
    if(d[1] && d[0]!='text'){
      return `${accumulator}&and[${d[0]}][]=${d[1]}`
    }
    return accumulator
  }

  const params = {...defaultparams, ...searchparams}
  console.log({params})
  let p = Object.entries(params)
  let searchstring = p.reduce(reducer,`text=${params.text}`)
  const url = `${digitalnz}?${searchstring}`
  let resp = fetch(url)
    .then(response => response.json())
  return await resp

}

export {searchWithParams,searchByTerm,searchByCategory,categories,primaryCollections}