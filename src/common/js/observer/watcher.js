/*
	Watcher
	1.当实例化 Watcher 类时，会先执行其构造函数；
	2.在构造函数中调用了 this.get() 实例方法；
	3.在 get() 方法中
		首先通过 window.target = this 
		把实例自身赋给了全局的一个唯一对象 window.target 上，
		然后通过 let value = this.getter.call(vm,vm)获取被依赖的数据，
		获取被依赖的数据的目的是为了去触发该数据上面的getter 
	a.然后在getter里调用 depend() 收集依赖
	b.然后在dep.depend()中取到挂载 window.target 上的值之后， 并将其存入依赖
	数组中 
	c.在get()方法最后将window.target 最终释放掉

	而当数据变化时，会触发数据的setter，在setter中调用了dep.notify()方法，
	在dep.notify() 方法中，遍历所有依赖(watcher实例) ,执行依赖的update()方法
	也就是watcher 类中的update()实例方法，在update()方法中调用数据变化回调函数，
	从而更新视图

	imgurl : https://vue-js.com/learn-vue/reactive/object.html#_4-依赖到底是谁
	
	总结
		
	1.首先，我们通过Object.defineProperty方法实现了对object数据的可观测，并且封装了Observer类，
	让我们能够方便的把object数据中的所有属性（包括子属性）都转换成getter/seter的形式来侦测变化。

	2.接着，我们学习了什么是依赖收集？并且知道了在getter中收集依赖，
	在setter中通知依赖更新，以及封装了依赖管理器Dep，用于存储收集到的依赖。

	3.最后，我们为每一个依赖都创建了一个Watcher实例，当数据发生变化时，通知Watcher实例，
	由Watcher实例去做真实的更新操作。

	其整个流程大致如下：

	Data通过observer转换成了getter/setter的形式来追踪变化。
	当外界通过Watcher读取数据时，会触发getter从而将Watcher添加到依赖中。
	当数据发生了变化时，会触发setter，从而向Dep中的依赖（即Watcher）发送通知。
	Watcher接收到通知后，会向外界发送通知，变化通知到外界后可能会触发视图更新，也有可能触发用户的某个回调函数等。
*/

export default class Watcher {
	constructor(vm,expOrFn,cb){
		this.vm = vm;
		this.cb = cb;
		this.getter = parsePath(expOrFn)
		this.value = this.get();
	}
	get(){
		window.target = this;
		const vm = this.vm;
		let value = this.getter.call(vm,vm)
		window.target = undefined;  // 释放 window.target
		return value 
	}
	update(){
		const oldValue = this.value;
		this.value = this.get();
		this.cb.call(this.vm,this.value,oldValue);
	}
} 

const bailRE = /[^\w.$]/;
export function parsePath(path){
	console.log(path,`path`)
	if (bailRE.test(path)){
		return
	}

	const segments = path.split('.')
	return function(obj){
		for(let i=0;i<segments.length;i++){
			if(!obj){
				return
			}

			obj = obj[segments[i]]
		}

		return obj
	}
}