import Dep from './dep'
import { arrayMethods } from './array'
import {def} from '../util/index'
/*
	使 Object 数据变得 “ 可观测 ” Object.defineProty(type:Object,type:String,setting)
	object 数据侦测，依赖收集，依赖的更新等所有操作
*/ 

//能力检测 判断 __proto__ 是否可用 因为有的浏览器不支持该属性
export const hasProto = '__proto__' in {}
const arrayKeys = Object.getOwnPropertyNames(arrayMethods);

// __proto__ 如果支持 直接写入到 __proto__ 原型即
function protoAugment(target,src,keys){
	target.__proto__ = src;
	// console.log(target,`target.__proto__`)
}
// __proto__ 如果不支持 则需要重新遍历写入 
function copyAugment(target,src,keys){
	for( let i=0,l=keys.length;i<i;i++){
		const key = keys[i]
		def(target,key,src[key])
	}
}

export default class Observer{
	constructor(value){
		this.value = value;
		//给value新增一个 __ob__ 属性 ，值为该value的Observer实例
		//相当于为value打上标记，表示它已经被转化成响应式了，避免重复炒作
		//处理array
		this.dep = new Dep(); // 实例一个依赖管理器，用来收集数组依赖
		// console.log(value,`value`)
		def(value,'__ob__',this);
		if(Array.isArray(value)){
			console.log('array...')
			/*
				* 数组方法拦截器 vue 内部就是这么干的。。
				*	针对原生push方法定义个一个新的newPush方法，这个newPush 方法内部调用了原生push方法
					，这样就保证了新的newPush方法跟原生push方法具有相同功能，而且我们还可以在新的newPush方法内部
					干一些别的事情，比如通知变化 。 等等。 。 。 。 
				* 
				*

				imgurl https://vue-js.com/learn-vue/reactive/array.html#_3-使array型数据可观测
			*/		
			//当value为数组时的处理逻辑

			const augment = hasProto  ?  protoAugment : copyAugment
			// console.log(augment,`augment`)
			augment(value,arrayMethods,arrayKeys)
			// console.log(hasProto,`hasProto`)
			// console.log(value,`value`);
			// console.log(arrayMethods,`arrayMethods`);
			// console.log(arrayKeys,`arrayKeys`);
			/*
					将数组中的所有元素转化为响应式
					说明 ：该方法内部会便利数组中的每一个元素，
					然后通过调用observe函数将每一个元素都转化成可侦测的响应式数据
			*/
			this.observeArray(value)
		}else{
			//处理object 
			this.walk(value);
		}
	}
	observeArray(items){
		for(let i=0,l=items.length;i<l;i++){
		// console.log(items[i],`observeArray`)
			observe(items[i]);
		}
	}
	//obj:Object
	/*
	*  转换成可观测的object,并且给value新增一个 __ob__ 属性 
	*	 值为该value 的 Observer 实例。这个操作相当于为value打上标记
	*	 表示它已经被转化成响应式了， 避免重复操作
	*/ 

	walk(obj){
		console.log('walk...')
		const keys = Object.keys(obj);
		for(let i =0;i<keys.length; i++){
			__defineReactive(obj,keys[i])
		}
	}
}

/*
*	使一个对象转化成可观测对象
*		params { Object } obj 对象
* 	params { String } key 对象的key
*		params { Any } val 对象的某个key值
*/ 
function __defineReactive(obj,key,val){
		//如果只传了obj和key ，那么val = obj[key]
		// console.log(arguments)
		if(arguments.length === 2){
			val = obj[key]
		}

		if(typeof val === 'Object'){
			new Observer(val);
		}

		const dep = new Dep()
		let childOb = observe(val)


		Object.defineProperty(obj,key,{
			enumerable : true,
			configurable : true,
			get(){
				if ( childOb ){
					 // getter收集依赖
					childOb.dep.depend()
				}
				console.log(`${key}属性被读取了`)
				return val
			},
			set(newVal){
				if ( val === newVal ){
					return
				}
				console.log(`${key}属性被修改了`)
				val = newVal;
				dep.notify(); // 在setter中通知依赖更新
			}
		})
}

/*
	* 尝试为value 创建一个Observer 实例，如果创建成功，直接返回新创建Observer 实例
		如果Value 已经存在一个Observer实例 则直接返回它
	*
*/ 
export function observe(value,asRootData){
	console.log(value,'value11')
	if(!_.isObject(value)){
		return 
	}
	// vNode //虚拟dom
	// if (!_.isObject(value) || value instanceof VNode){
	// 	return 
	// }
	// console.log(_.hasOwnProperty(value,'set'),`hasOwnProperty`)
	let ob;
	if (_.hasOwnProperty(value,'__ob__') && value.__ob__ instanceof Observer){
		ob = value.__ob__
	}else {
		ob = new Observer(value)
	}
	// console.log(ob,`value`)

	return ob

}

