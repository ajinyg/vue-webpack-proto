/*
		VNode的作用

		我们在视图渲染之前，把写好的tmp模版编译成vnode并把它缓存起来，
		然后等数据发生变化的时候，我们把发生变化后的vnode与之前缓存起来的vnode去做
		比较，找出差异，然后有差异的vnode对应的真实dom节点就是我们需要重新渲染的dom节点，
		最后根据有差异的vnode创建出来的真实dom节点再插入到视图中去，最后完成一次视图更新.
*/ 
export default class VNode {
	constructor(
		tag,//当前节点的标签名
		data,//当前节点对应的对象，包含了具体的一些数据信息，是一个VNodeData类型
		children,//当前节点的子节点，是一个数组
		text,//当前节点的文本
		elm,//当前虚拟节点对应的真实DOM节点
		context,//当前组件节点对应的Vue实例
		componentOptions,//组件options选项
		asyncFactory
	){
		this.tag = tag;//当前节点的标签名
		this.data = data;//当前节点对应的对象，包含了具体的一些数据信息，是一个VNodeData类型
		this.children = children; //当前节点的子节点，是一个数组
		this.text = text;//当前节点的文本
		this.elm = elm;//当前虚拟节点对应的真实DOM节点
		

		this.ns = undefined; //当前节点的名字空间

		this.context = context;//当前组件节点对应的Vue实例

		this.fnContext = undefined; // 函数式组件对应Vue实例
		this.fnOptions = undefined;
		this.fnScopeId = undefined;
		this.key = data && data.key;//节点的key属性，被当作节点的标志，用于优化


		this.componentOptions = componentOptions;//组件options选项
		this.componentInstance = undefined; //当前节点对应组件的实例
		this.parent = undefined;//当前节点的父节点
		this.raw = false; //简而言之口就是是否为原生HTML或是普通文本，innerHTML的时候为true,textContext的时候为false
		this.isStatic = false;//静态节点标志
		this.isRootInsert = true;//是否作为跟节点插入
		this.Comment = false;//是否为注释节点
		this.isCloned = false;//是否为克隆节点
		this.isOnce = false;//是否有v-once指令
		this.asyncFactory = asyncFactory;
		this.asyncMeta = undefined;
		this.isAsyncPlaceholder = false;
	}
	get child(){
		return this.componentInstance;
	}
}
/*
	VNode类型 
	1.注释节点
	2.文本节点
	3.元素节点
	4.组件节点
	5.函数式组件节点
	6.克隆节点
*/
//注释节点
export const createEmptyVNode = (text = '') => {
	const node = new VNode();
	node.text = text ;
	node.isComment = true;
	return node;
}
//文本节点
export function createTextVNode (val){
	return new VNode(undefined,undefined,undefined,String(val))
}
//克隆节点
export function cloneVNode(vnode){
	if(!(vnode && typeof vnode == 'object')){
		return
	}
	const cloned = new VNode(
		vnode.tag,
		vnode.data,
		vnode.children,
		vnode.text,
		vnode.elm,
		vnode.context,
		vnode.componentOptions,
		vnode.asyncFactory
	)
	cloned.ns = vnode.ns;
	cloned.isStatic = vnode.isStatic;
	cloned.key = vnode.key;
	cloned.isComment = vnode.isComment;
	cloned.fnContext = vnode.fnContext;
	cloned.fnOptions = vnode.fnOptions;
	cloned.fnScopeId = vnode.fnScopeId;
	cloned.asyncMeta = vnode.asyncMeta;
	cloned.isCloned = true;
	return cloned;
}
//元素节点
/*
	<div id="a"><span>hello,word!</span></div>

	VNode 节点
	{
		tag :'div',
		data : {},
		children:[
			{
				tag:'span',
				text:'hello,word!'
			}
		]
	}
*/ 
//组件节点
/*
	组件节点除了有元素节点具有的属性之外，它还有两个特有的属性： 
	1.componentOptions 组件的options选项，如组件的props
	2.componentInstance 当前组件节点对应的Vue实例
*/

//函数式组件节点
/*
	函数式组件节点相较于组件节点，它又又两个特有的属性：
	1.fnContext 函数式组件对应的Vue实例
	2.fnOptions 组件的option选项
*/ 