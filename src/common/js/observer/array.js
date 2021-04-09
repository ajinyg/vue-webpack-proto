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
		let inserted;
		switch(method){
			case 'push':
			case 'unshift':
				inserted = args
				break;
			case 'splice':
				console.log(args,`args`)
				inserted = args.slice(2);//如果是splice方法，那么传入参数列表中下标为2的就是新增元素
				break;
		}
		if(inserted){
			console.log(inserted,`inserted`)
			// console.log(ob,`ob`)
			ob.observeArray(inserted);//调用observer函数将新增的元素转化成响应式
		}
		ob.dep.notify()
		return result;
	})
})
