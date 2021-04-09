import _ from 'lodash';
import Observer from './common/js/observer/index'

// let tmp = {
//       a:'1',
//       b:'2',
//       c:'3'
//     }
let tmp = [
	{name:'黄晶001'},
	{name:'黄晶002'},
	{name:'黄晶003'},
	{name:'黄晶004'}
	
]
setTimeout(()=>{
	// tmp.push({
	// 	name :'黄晶005'
	// })
	tmp.splice(0,1,'黄晶bb')
},2000)
new Observer(tmp)
window._ = _;