import _ from 'lodash';
import Observer from './common/js/observer/index'

let tmp = {
      a:'1',
      b:'2',
      c:'3'
    }
tmp = [
	{name:'黄晶'},
	{name:'黄晶002'}
	
]
new Observer(tmp)
window._ = _;