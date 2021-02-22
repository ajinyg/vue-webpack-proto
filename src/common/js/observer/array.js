import { def } from '../util/index'
const arrayProto = Array.prototype;
//创建一个对象作为拦截器
export const arrayMethods  = Object.create(arrayProto);

//改变数组自身内容的7个方法
const methodsToPatch = [
	'push',
	'pop',
	'shift',
	'unshift',
	'splice',
	'sort',
	'reverse'
]

methodsToPatch.forEach(function(method){
	const original = arrayProto[method]
	def(arrayMethods,method,function mutator(...args){
		const result = original.apply(this,args);
		const ob = this.__ob__
		
		ob.dep.notify()
		return result;
	})
})
