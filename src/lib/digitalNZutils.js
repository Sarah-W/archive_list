import book from '@iconify-icons/mdi/book-open-variant.js';
import newspaper from '@iconify-icons/mdi/newspaper-variant-outline.js';
import image from '@iconify-icons/mdi/image-outline.js';
import paper from '@iconify-icons/mdi/script-text-outline.js';
import archive from '@iconify-icons/mdi/archive-outline.js';
import audio from '@iconify-icons/mdi/volume-high.js';
import ufo from '@iconify-icons/mdi/ufo-outline.js';
import video from '@iconify-icons/mdi/video-outline.js';
import music from '@iconify-icons/mdi/music.js';
import group from '@iconify-icons/mdi/account-group-outline.js';
import data from '@iconify-icons/mdi/table-large.js';
import website from '@iconify-icons/mdi/web.js';
import set from '@iconify-icons/mdi/checkbox-multiple-blank-outline.js';

const _categories = [
  {text:"Newspapers", icon:newspaper, index:0},
  {text:"Images", icon:image, index:1},
  {text:"Books", icon:book, index:2},
  {text:"Articles", icon:paper, index:3},
  {text:"Journals", icon:book, index:4},
  {text:"Archives",icon:archive, index:5},
  {text:"Audio", icon:audio, index:6},
  {text:"Other", icon:ufo, index:7},
  {text:"Manuscripts", icon:paper, index:8},
  {text:"Reference sources", icon:archive, index:9},
  {text:"Research papers", icon:paper, index:10},
  {text:"Videos", icon:video, index:11},
  {text:"Music Score", icon:music, index:12},
  {text:"Groups", icon:group, index:13},
  {text:"Data", icon:data, index:14},
  {text:"Websites", icon:website, index:15},
  {text:"Sets", icon:set, index:16}
]

const categories={
  dict:Object.fromEntries(_categories.map(d=>[d.text,d])),
  list:_categories.map(d=>d.text)
}


const primaryCollections = async (category="",page=0)=>{
  let search = `?&facets=primary_collection&facets_per_page=350&facets_page=${page+1}`
  if(category){search=search+`&and[category][]=${category}`}
 let resp = fetch("api/"+search)
  .then(response => response.json())
  .then(d => Object.keys(d.search.facets.primary_collection))
  return await resp
}

const searchById = async(id)=>{
  if(id){
    let resp = fetch("api/"+id)
    .then(response => response.json())
    .then(d=>d.record)
    return await resp
  }
  await new Promise(()=>{})
}

const searchByTerm = async (text='cat')=>{
  const url = `api/?text=${text}`
  let resp = fetch(url)
    .then(response => response.json())
  return await resp
}

const searchByCategory = async (category='Newspapers')=>{
  //category must be one of categories above
  if(!categories.find(d=>d==category)){return }
  const url = `/api?and[category][]=${category}`
  let resp = fetch(url)
    .then(response => response.json())
  return await resp
}

const searchWithParams = async (/** @type {object} */ searchparams)=>{
  const defaultparams={
    text:"",
    category:"",
    primary_collection:"",
    page:1
  }


  const params = {...defaultparams, ...searchparams}

  let text = `text=${params.text}&page=${params.page}`
  const sort = "&sort=syndication_date&direction=desc"

  const reducer = (/** @type {string} */ accumulator, /** @type {any[]} */ d)=>{
    accumulator =  accumulator ? accumulator : ""
    // console.log(accumulator)
    if(d[1]){ 
      switch (d[0]){
        case "text":
        case "page":
          return accumulator
          break;
        case "year":
          return `${accumulator}&and[${d[0]}]=[${d[1].join("+TO+")}]`
          break;
        default:
          return `${accumulator}&and[${d[0]}][]=${d[1]}`
      } 
    }

    return accumulator
  }

  let p = Object.entries(params)
  let searchstring = p.reduce(reducer,text+sort)
  // console.log(searchstring)

  const url = `/api?${searchstring}`
  let resp = fetch(url)
    .then(response => response.json())
  return await resp

}

export {searchWithParams,searchByTerm,searchByCategory,categories,primaryCollections,searchById}