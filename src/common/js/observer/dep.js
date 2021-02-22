import Watcher from './watcher'
/*
	视图更新, 在getter中收集依赖，在setter中通知依赖更新视图
	依赖管理器
*/ 

window.target = null
export default class Dep {
	constructor(){
		this.subs = []
	}
	addSub(sub){
		this.subs.push(sub)
	}
	//删除一个依赖
	removeSub(sub){
		_remove(this.subs,sub)
	}
	//添加一个依赖
	depend(){
		console.log(window.target,`window.target`)
		if(window.target){
			window.target.addSub(this)
		}
	}
	//通知所有依赖更新
	notify(){
		const subs = this.subs.slice();
		for( let i=0, l=subs.length; i<l; i++){
			subs[i].update()
		}
	}
}


function _remove(arr,item){
	if(arr.length){
		const index = arr.indexOf(item);
		if (index > -1){
			return arr.splice(index,1)
		}
	}
}